"""
Game Logo Downloader — Multi-Source Edition
============================================
Tries CrazyGames → Newgrounds → Itch.io → Google Images
for each game, saving square 256x256 PNGs.

SETUP:
1. pip3 install requests pillow beautifulsoup4 --break-system-packages
2. Put this script in the SAME folder as your games.html
3. python3 download_game_logos.py
"""

import requests
import os
import re
import time
import urllib.parse
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/121.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

TARGET_SIZE = 256
DELAY = 0.8


def get_entries_from_html(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    results = []
    for a in soup.select("a.image-link-border"):
        img = a.find("img")
        if not img:
            continue
        src = img.get("src", "").strip()
        if src.startswith("http://") or src.startswith("https://"):
            continue
        search = a.get("data-search", "").strip()
        data_id = a.get("data-id", "").strip()
        if not search:
            search = data_id.replace("-", " ")
        game_name = re.sub(r'\s+', ' ', search).strip()
        results.append((game_name, src, data_id))
    return results


def extract_og_image(html):
    for pattern in [
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
    ]:
        m = re.search(pattern, html)
        if m:
            url = m.group(1)
            if url.startswith("http"):
                return url
    return None


def search_crazygames(session, query):
    slug = re.sub(r'[^a-z0-9]+', '-', query.lower()).strip('-')
    try:
        resp = session.get(f"https://www.crazygames.com/game/{slug}", headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            img = extract_og_image(resp.text)
            if img:
                return img
    except Exception:
        pass
    try:
        q = urllib.parse.quote(query)
        resp = session.get(f"https://www.crazygames.com/search?q={q}", headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            link = soup.select_one("a[href*='/game/']")
            if link:
                href = "https://www.crazygames.com" + link["href"] if link["href"].startswith("/") else link["href"]
                r2 = session.get(href, headers=HEADERS, timeout=10)
                img = extract_og_image(r2.text)
                if img:
                    return img
    except Exception:
        pass
    return None


def search_newgrounds(session, query):
    try:
        q = urllib.parse.quote(query)
        resp = session.get(f"https://www.newgrounds.com/search/conduct/games?terms={q}", headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            thumb = soup.select_one("img.item-icon, .search-results img")
            if thumb:
                src = thumb.get("src") or thumb.get("data-src", "")
                if src and src.startswith("http"):
                    return src
            link = soup.select_one("a.item-portalitem-game, a[href*='newgrounds.com/portal/view']")
            if link:
                href = link.get("href", "")
                if href:
                    r2 = session.get(href, headers=HEADERS, timeout=10)
                    img = extract_og_image(r2.text)
                    if img:
                        return img
    except Exception:
        pass
    return None


def search_itchio(session, query):
    try:
        q = urllib.parse.quote(query)
        resp = session.get(f"https://itch.io/games/free?q={q}", headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            thumb = soup.select_one(".game_cell_image img, .thumb_link img")
            if thumb:
                src = thumb.get("src") or thumb.get("data-lazy_src") or thumb.get("data-src", "")
                if src and src.startswith("http"):
                    return src
    except Exception:
        pass
    return None


def search_google_images(session, query):
    try:
        q = urllib.parse.quote(f"{query} game logo square")
        url = f"https://www.google.com/search?q={q}&tbm=isch&tbs=iar:s"
        resp = session.get(url, headers=HEADERS, timeout=10)
        urls = re.findall(r'"(https://[^"]+\.(?:png|jpg|jpeg|webp))"', resp.text)
        for u in urls[:5]:
            if "gstatic" not in u and "google" not in u and len(u) > 30:
                return u
    except Exception:
        pass
    return None


def find_image(session, game_name):
    sources = [
        ("CrazyGames", search_crazygames),
        ("Newgrounds", search_newgrounds),
        ("itch.io", search_itchio),
        ("Google Images", search_google_images),
    ]
    for source_name, fn in sources:
        try:
            url = fn(session, game_name)
            if url:
                return url, source_name
        except Exception:
            pass
        time.sleep(0.3)
    return None, None


def download_and_square(session, url, filepath):
    try:
        resp = session.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content)).convert("RGBA")
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize((TARGET_SIZE, TARGET_SIZE), Image.LANCZOS)
        png_path = os.path.splitext(filepath)[0] + ".png"
        img.save(png_path, "PNG")
        return png_path if os.path.getsize(png_path) > 500 else None
    except Exception:
        return None


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(script_dir, "games.html")

    if not os.path.exists(html_path):
        print("❌ games.html not found! Make sure this script is in the same folder as games.html")
        return

    print("📖 Reading games.html...")
    entries = get_entries_from_html(html_path)
    print(f"   Found {len(entries)} local image references\n")

    session = requests.Session()
    log_lines = []
    success = 0
    failed = 0
    skipped = 0
    total = len(entries)

    print("🎮 Downloading square thumbnails (CrazyGames → Newgrounds → itch.io → Google Images)")
    print(f"   Output folder: {script_dir}/\n")

    for i, (game_name, src, data_id) in enumerate(entries, 1):
        save_filename = (data_id if data_id else re.sub(r'[^a-z0-9]', '', game_name.lower())) + ".png"
        filepath = os.path.join(script_dir, save_filename)

        if os.path.exists(filepath) and os.path.getsize(filepath) > 500:
            print(f"[{i:4}/{total}] ⏭  SKIP        {game_name}")
            skipped += 1
            log_lines.append(f"SKIP\t{game_name}\t{save_filename}")
            continue

        img_url, source = find_image(session, game_name)
        time.sleep(DELAY)

        if not img_url:
            print(f"[{i:4}/{total}] ✗  NOT FOUND   {game_name}")
            failed += 1
            log_lines.append(f"FAIL\t{game_name}\t{save_filename}")
            continue

        saved_path = download_and_square(session, img_url, filepath)
        time.sleep(DELAY)

        if saved_path:
            size_kb = os.path.getsize(saved_path) // 1024
            print(f"[{i:4}/{total}] ✓  [{source:12}] {game_name} → {save_filename} ({size_kb}KB)")
            success += 1
            log_lines.append(f"OK\t{source}\t{game_name}\t{save_filename}")
        else:
            print(f"[{i:4}/{total}] ✗  FAILED       {game_name}")
            failed += 1
            log_lines.append(f"FAIL\t{game_name}\t(download error)")

    log_path = os.path.join(script_dir, "download_log.txt")
    with open(log_path, "w", encoding="utf-8") as f:
        f.write(f"Total: {total} | Success: {success} | Failed: {failed} | Skipped: {skipped}\n")
        f.write("=" * 60 + "\n")
        f.write("\n".join(log_lines))

    print(f"\n{'='*50}")
    print(f"✅ Done!  Success: {success}  |  Failed: {failed}  |  Skipped: {skipped}")
    print(f"📋 Log: {log_path}")


if __name__ == "__main__":
    main()

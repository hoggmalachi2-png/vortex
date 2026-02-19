// VorteX Sidebar - Reusable Component
// Just include this file and call initSidebar('game-id')

const GAME_DATA = {
  'game-1': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/image-removebg-preview%20(1).png',
    href: 'geo.htm',
    name: 'Geometry Dash'
  },
  'game-2': {
    img: 'https://i.postimg.cc/qBnQ79vc/image.png',
    href: 'balatro.htm',
    name: 'Balatro'
  },
  'game-3': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/SMASH.png',
    href: 'http://smashkarts.surge.sh',
    name: 'Smash Karts'
  },
  'game-4': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/448fmdpjw/fnaf.avif',
    href: 'fnaf.htm',
    name: 'FNAF'
  },
  'game-5': {
    img: 'https://i.postimg.cc/wvM6qcZG/escaperoad2.jpg',
    href: 'escape.htm',
    name: 'Escape Road'
  },
  'smash': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/SMASH.png',
    href: 'smash.htm',
    name: 'Smash Karts'
  },
  'fnaf': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/448fmdpjw/fnaf.avif',
    href: 'fnaf.htm',
    name: 'FNAF'
  },
  'escape': {
    img: 'https://i.postimg.cc/wvM6qcZG/escaperoad2.jpg',
    href: 'escape.htm',
    name: 'Escape Road'
  },
  'geo': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/image-removebg-preview%20(1).png',
    href: 'geo.htm',
    name: 'Geometry Dash'
  },
   'chess': {
    img: 'https://i.postimg.cc/8PkTv7WJ/image.png',
    href: 'chess.htm',
    name: 'Chess'
  },
   'poker': {
    img: 'https://i.postimg.cc/MZ5JVKdh/image.png',
    href: 'poker.htm',
    name: 'Poker'
  },
  'balatro': {
    img: 'https://i.postimg.cc/qBnQ79vc/image.png',
    href: 'balatro.htm',
    name: 'Balatro'
  },
  'gran': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/turismo.jpeg',
    href: 'gran.htm',
    name: 'Gran Turismo'
  },
  'eagle': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/REMASTERD.png',
    href: 'http://eaglercraft1.surge.sh/',
    name: 'Eaglercraft'
  },
  'mlb': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/Griffey-jr-mlb-cover.jpg',
    href: 'mlb.htm',
    name: 'MLB'
  },
  '1v1': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/1v1.png',
    href: '1v1.htm',
    name: '1v1.LOL'
  },
  'madden': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/madden06.jpeg',
    href: 'madden06.htm',
    name: 'Madden 06'
  },
  'doom': {
    img: 'https://i.postimg.cc/fWYP30s6/doom.jpg',
    href: 'doom.htm',
    name: 'DOOM'
  },
  'yard': {
    img: 'https://i.postimg.cc/N09jc87S/image.png',
    href: 'yard.htm',
    name: 'Backyard Baseball'
  },
  'footyard': {
    img: 'https://i.postimg.cc/GtMWtVby/image.png',
    href: 'footyard.htm',
    name: 'Backyard Football'
  },
  'day': {
    img: 'https://i.postimg.cc/QCLBP424/8XPsrw.jpg',
    href: 'day.htm',
    name: 'Day of the Dead'
  },
  'bullet': {
    img: 'https://i.postimg.cc/Jhy6RsKp/bullet.png',
    href: 'bullet.htm',
    name: 'Bullet Force'
  },
  'brainrot': {
    img: 'https://i.postimg.cc/wjr246Hq/brainrot.jpg',
    href: 'brainrot.htm',
    name: 'Brain Rot'
  },
  'cross': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/css.jpeg',
    href: 'cross.htm',
    name: 'Crossy Road'
  },
  'back': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/ack.webp',
    href: 'back.htm',
    name: 'Backrooms'
  },
  'rh': {
    img: 'https://i.postimg.cc/76hxHMdR/retrohiu.png',
    href: 'rh.htm',
    name: 'Retro Hockey'
  },
  'retro': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/retro.png',
    href: 'http://agartha.surge.sh/retro.html',
    name: 'Retro Bowl'
  },
  'super': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/super.png',
    href: 'super.htm',
    name: 'Super Mario'
  },
  'cod4': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/cod4.jpeg',
    href: 'cod4.htm',
    name: 'Call of Duty 4'
  },
  'fallout': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/fallout.jpeg',
    href: 'fallout.htm',
    name: 'Fallout'
  },
  'thps': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/thps.jpeg',
    href: 'thps.htm',
    name: 'Tony Hawk Pro Skater'
  },
  'zelda': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/elda.jpeg',
    href: 'zelda.htm',
    name: 'Zelda'
  },
  'mike': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/mtpu.jpeg',
    href: 'mike.htm',
    name: 'Mike Tyson Punchout'
  },
  'g1': {
    img: 'https://i.postimg.cc/1RgwS9WL/granny.png',
    href: 'g1.htm',
    name: 'Granny 1'
  },
  'g2': {
    img: 'https://i.postimg.cc/SxGzdjsz/granny2.jpg',
    href: 'g2.htm',
    name: 'Granny 2'
  },
  'g3': {
    img: 'https://i.postimg.cc/zDRbMxvg/gran3.jpg',
    href: 'g3.htm',
    name: 'Granny 3'
  },
  'space': {
    img: 'https://i.postimg.cc/NjNjLXLY/space-waves-1x1-cover.png',
    href: 'space.htm',
    name: 'Space Waves'
  },
  'poly': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/download%20(1).jpeg',
    href: 'poly.htm',
    name: 'Polytrack'
  },
  'cookie': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/download%20(2).jpeg',
    href: 'cookie.htm',
    name: 'Cookie Clicker'
  },
  'drift': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/drift.jpeg',
    href: 'drift.htm',
    name: 'Drift Hunters'
  },
  'tank': {
    img: 'https://uploads.onecompiler.io/445bmgf4z/445cc6tsh/tank.jpeg',
    href: 'https://www.tankgank.com',
    name: 'Tank Gank'
  },
  'state': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/stae.jpeg',
    href: 'state.htm',
    name: 'State.io'
  },
  'superhot': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/hot.jpeg',
    href: 'superhot.htm',
    name: 'Superhot'
  },
  'bit': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/bite.png',
    href: 'bit.htm',
    name: 'BitLife'
  },
  'rbc': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/c.jpeg',
    href: 'college.htm',
    name: 'Retro Bowl College'
  },
  'slit': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/s.jpeg',
    href: 'slit.htm',
    name: 'Slither.io'
  },
  'world': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/w.jpeg',
    href: 'https://www.worldguessr.com/',
    name: 'World Guessr'
  },
  'ore': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/ire.jpeg',
    href: 'ore.htm',
    name: 'Iron Ore'
  },
  'mr': {
    img: 'https://i.postimg.cc/pVwHGZhg/df.png',
    href: 'mr.htm',
    name: 'Mr. Mine'
  },
  'grow': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/rwo.webp',
    href: 'grow.htm',
    name: 'Grow RPG'
  },
  'agar': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/3xbzqzhtg/agar.jpg',
    href: 'agar.htm',
    name: 'Agar.io'
  },
  'ex': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/ultamite.jpeg',
    href: 'ex.htm',
    name: 'Extreme Pamplona'
  },
  'just': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/jsut.jpeg',
    href: 'just.htm',
    name: 'Just Fall'
  },
  'kour': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/kour.jpeg',
    href: 'kour.htm',
    name: 'Kour.io'
  },
  'hunt': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/446mx7tqd/drif.png',
    href: 'hunt.htm',
    name: 'Drift Hunters'
  },
  '99': {
    img: 'https://uploads.onecompiler.io/4427p9zfv/448fmdpjw/99.png',
    href: '99.htm',
    name: '99 Balls'
  },
  'chat': {
    img: 'https://i.postimg.cc/MHWsSvgd/chat.png',
    href: 'chat.htm',
    name: 'Chat'
  },
  'form': {
    img: 'https://i.postimg.cc/rFjBKLJF/store.png',
    href: 'https://forms.gle/Aj4CVGuVqTAo5VB79',
    name: 'Store'
  },
  'youtube': {
    img: 'https://i.postimg.cc/BQprXGgZ/Black_And_White_Modern_Vintage_Retro_Brand_Logo.png',
    href: 'https://downr.org/',
    name: 'YouTube Downloader'
  },
  'silk': {
    img: 'https://i.postimg.cc/CLjFJ1gV/silk2.png',
    href: 'silk.htm',
    name: 'Silk'
  },
  'rocket': {
    img: 'https://i.postimg.cc/YSY3yZSy/image.png',
    href: 'rocket.htm',
    name: 'Rocket League'
  },
  'indian': {
    img: 'https://i.postimg.cc/hG1mmBvK/image.png',
    href: 'indian.htm',
    name: 'Indian Truck Simulator'
  },
  'russian': {
    img: 'https://i.postimg.cc/tJKJfSJN/image.png',
    href: 'russian.htm',
    name: 'Russian Car Driver'
  },
  'slow': {
    img: 'https://i.postimg.cc/w3YxF1b8/image.png',
    href: 'slow.htm',
    name: 'Slow Roads'
  },
  'slope': {
    img: 'https://i.postimg.cc/wBqcxVc2/image.png',
    href: 'slope.htm',
    name: 'Slope 3'
  },
  'solar': {
    img: 'https://i.postimg.cc/CLbjjtcH/image.png',
    href: 'solar.htm',
    name: 'Solar Smash'
  },
  'top': {
    img: 'https://i.postimg.cc/B68Ftw8N/image.png',
    href: 'top.htm',
    name: 'Top Speed Racing'
  },
  'yellow': {
    img: 'https://i.postimg.cc/Qd0Kmr1C/image.png',
    href: 'yellow.htm',
    name: 'Undertale Yellow'
  },
  'tunnel': {
    img: 'https://i.postimg.cc/bv5DXH6t/image.png',
    href: 'tunnel.htm',
    name: 'Tunnel Rush'
  },
  'uno': {
    img: 'https://i.postimg.cc/tRW1f6Wf/image.png',
    href: 'uno.htm',
    name: 'UNO'
  },
  'mortal': {
    img: 'https://i.postimg.cc/fTWwKSCQ/image.png',
    href: 'mortal.htm',
    name: 'Mortal Kombat'
  },
  'house': {
    img: 'https://i.postimg.cc/3wG7RX8J/image.png',
    href: 'house.htm',
    name: 'House of Hazards'
  },
  'fnaf2': {
    img: 'https://i.postimg.cc/fTghf2ky/image.png',
    href: 'fnaf2.htm',
    name: 'FNAF 2'
  },
  'soinc': {
    img: 'https://i.postimg.cc/WzWxSzNS/image.png',
    href: 'soinc.htm',
    name: 'Soinc'
  },
  'tower': {
    img: 'https://i.postimg.cc/cHdjSwrJ/image.png',
    href: 'tower.htm',
    name: 'Tower Blocks'
  },
  'fork': {
    img: 'https://i.postimg.cc/tgjv3Wds/image.png',
    href: 'fork.htm',
    name: 'Fork and Sausage'
  },
  'subway': {
    img: 'https://i.postimg.cc/kGzfBbXS/image.png',
    href: 'subway.htm',
    name: 'Subway Surfers'
  },
  'miner': {
    img: 'https://i.postimg.cc/q74Qh00g/image.png',
    href: 'miner.htm',
    name: 'Idle Miner'
  },
  'wordle': {
    img: 'https://i.postimg.cc/dQpb77f5/image.png',
    href: 'wordle.htm',
    name: 'Wordle'
  },
  'fnafe': {
    img: 'https://i.postimg.cc/0NyWXx3x/image.png',
    href: 'fnafe.htm',
    name: 'FNAF Epstein'
  },
  'level': {
    img: 'https://i.postimg.cc/B6dmvFvD/image.png',
    href: 'level.htm',
    name: 'Level Devil'
  },
  'little': {
    img: 'https://i.postimg.cc/B61CRvBr/image.png',
    href: 'little.htm',
    name: 'Little Alchemy 2'
  },
  'ragdoll': {
    img: 'https://i.postimg.cc/BbB2GPLz/image.png',
    href: 'ragdoll.htm',
    name: 'Ragdoll Hit'
  },
  'smashbros': {
    img: 'https://i.postimg.cc/C5mMpbYq/2.jpg',
    href: 'smashbros.htm',
    name: 'Smash Bros'
  },
  'south': {
    img: 'https://i.postimg.cc/1535c7cr/southpark.jpg',
    href: 'south.htm',
    name: 'South Park'
  },
  'ssf': {
    img: 'https://i.postimg.cc/YqCqfDff/street.jpg',
    href: 'ssf.htm',
    name: 'Super Street Fighter'
  },
  'mk3': {
    img: 'https://i.postimg.cc/SQrx9b8j/mk2.jpg',
    href: 'mk3.htm',
    name: 'Mortal Kombat 3'
  },
  'pac': {
    img: 'https://i.postimg.cc/kXgXFYF7/pac.jpg',
    href: 'pac.htm',
    name: 'Pac-Man'
  },
  'mario2': {
    img: 'https://i.postimg.cc/C5mMpbYq/2.jpg',
    href: 'mario2.htm',
    name: 'Super Mario 2'
  },
  'tetris': {
    img: 'https://i.postimg.cc/sfcgWCSf/etetris.webp',
    href: 'tetris.htm',
    name: 'Tetris Attack'
  },
  'sonic': {
    img: 'https://i.postimg.cc/1535c7cp/sonic.webp',
    href: 'sonic.htm',
    name: 'Sonic'
  },
  'lego': {
    img: 'https://i.postimg.cc/Hsks4v4Y/lego.jpg',
    href: 'lego.htm',
    name: 'Lego Star Wars'
  },
  'ultamite': {
    img: 'https://i.postimg.cc/m2g2NpNj/ua.jpg',
    href: 'ultamite.htm',
    name: 'Ultimate Assassin'
  },
  'fire': {
    img: 'https://i.postimg.cc/tR546GP4/irebo.jpg',
    href: 'fire.htm',
    name: 'Fireboy and Watergirl'
  },
  'egg': {
    img: 'https://i.postimg.cc/KcN8ThTV/eggcar.jpg',
    href: 'egg.htm',
    name: 'Eggy Car'
  },
  'block': {
    img: 'https://i.postimg.cc/cCX1GfZK/bp.jpg',
    href: 'block.htm',
    name: 'Blockpost'
  },
  'blast': {
    img: 'https://i.postimg.cc/Gtq3nvrD/bb.jpg',
    href: 'blast.htm',
    name: 'Block Blast'
  },
  'solitare': {
    img: 'https://i.postimg.cc/m2g2NpNF/solitaert.png',
    href: 'solitare.htm',
    name: 'Solitare'
  },
  'baldi': {
    img: 'https://i.postimg.cc/2y2jNnmB/baldi.webp',
    href: 'baldi.htm',
    name: 'Baldi'
  },
  'bubble': {
    img: 'https://i.postimg.cc/QC0NZcsk/bs.png',
    href: 'bubble.htm',
    name: 'Bubble Shooter'
  },
  'baby': {
    img: 'https://i.postimg.cc/gjNcb3dV/bss.webp',
    href: 'baby.htm',
    name: 'Baby Shooter'
  },
  'tennis': {
    img: 'https://i.postimg.cc/kMcgSPSj/cntt.webp',
    href: 'tennis.htm',
    name: 'Tennis'
  },
  'plane': {
    img: 'https://i.postimg.cc/T293bvbF/cpn.png',
    href: 'plane.htm',
    name: 'Plane Landing'
  },
  'csgo': {
    img: 'https://i.postimg.cc/CMNx8pDy/csgo.png',
    href: 'csgo.htm',
    name: 'CSGO Clicker'
  },
  'cattle': {
    img: 'https://i.postimg.cc/RhXCxw91/cc3.jpg',
    href: 'cattle.htm',
    name: 'Crazy Cattle'
  },
  'dragon': {
    img: 'https://i.postimg.cc/NG4jXvTv/ddg.jpg',
    href: 'dragon.htm',
    name: 'Dungeons and Dragon Gamble'
  },
  'es2': {
    img: 'https://i.postimg.cc/5932zWvJ/es2.jpg',
    href: 'es2.htm',
    name: 'Escape Road 2'
  },
  'fort': {
    img: 'https://i.postimg.cc/8kHzvgWp/fortzone.jpg',
    href: 'fort.htm',
    name: 'Fortzone'
  },
  'hill': {
    img: 'https://i.postimg.cc/Lsc3jZcq/image.png',
    href: 'hill.htm',
    name: 'Hill Climb Racing'
  },
  'minecraft': {
    img: 'https://i.postimg.cc/pTjCZQhp/image.png',
    href: 'https://eaglercraft.surge.sh',
    name: 'Minecraft'
  }
};

// Main initialization function
function initSidebar(currentGameId, iframeSrc) {
  // Create sidebar HTML
  const sidebarHTML = `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="xbox-logo">
          <img src="logo1.png" alt="VorteX" class="logo-img">
        </div>
      </div>

      <nav class="nav-section">
        <a href="index.html" class="nav-item">
          <span class="material-symbols-rounded nav-icon">home</span>
        </a>

        <a onclick="refreshPage()" style="cursor: pointer;" class="nav-item">
          <span class="material-symbols-rounded nav-icon">refresh</span>
        </a>
      </nav>

      <div id="recently-played-container"></div>
    </div>

    <div class="content">
      <iframe src="${iframeSrc}"></iframe>
    </div>
  `;

  // Insert sidebar into body
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // Add refresh function to global scope
  window.refreshPage = function() {
    location.reload();
  };

  // Initialize recently played
  const recentContainer = document.getElementById('recently-played-container');
  let lastPlayed = JSON.parse(localStorage.getItem('lastPlayed')) || [];

  function dedupeRecent(list) {
    const seen = new Set();
    const unique = [];
    for (let i = list.length - 1; i >= 0; i--) {
      const id = list[i];
      if (!id || seen.has(id)) continue;
      seen.add(id);
      unique.push(id);
    }
    return unique.reverse();
  }

  function renderRecentlyPlayed() {
    recentContainer.innerHTML = '';
    
    // Filter out the current game and get last 5
    lastPlayed = dedupeRecent(lastPlayed);
    localStorage.setItem('lastPlayed', JSON.stringify(lastPlayed));

    const recentGames = lastPlayed
      .slice()
      .reverse()
      .filter(gameId => gameId !== currentGameId)  // Exclude current game
      .slice(0, 5);

    const seen = new Set();
    recentGames.forEach(gameId => {
      const game = GAME_DATA[gameId];
      if (game && !seen.has(gameId)) {
        seen.add(gameId);
        const tile = document.createElement('a');
        tile.className = 'recent-game-tile';
        tile.href = game.href;
        tile.innerHTML = `<img src="${game.img}" alt="${game.name}">`;
        
        tile.addEventListener('click', () => {
          trackGamePlay(gameId);
        });

        recentContainer.appendChild(tile);
      }
    });
  }

  function trackGamePlay(gameId) {
    lastPlayed = dedupeRecent(lastPlayed).filter(id => id !== gameId);
    lastPlayed.push(gameId);
    lastPlayed = lastPlayed.slice(-10);
    localStorage.setItem('lastPlayed', JSON.stringify(lastPlayed));
    setTimeout(renderRecentlyPlayed, 100);
  }

  // Track current game
  trackGamePlay(currentGameId);
  renderRecentlyPlayed();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSidebar, GAME_DATA };
}

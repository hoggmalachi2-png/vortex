(function () {
  const navItems = [
    { key: 'home', href: 'index.html', icon: 'home', label: 'Home' },
    { key: 'games', href: 'games.html', icon: 'newsstand', label: 'Game Library' },
    { key: 'grid', href: 'multiview.html', icon: 'grid_view', label: 'Grid View' },
    { key: 'news', href: 'notifications.html', icon: 'notifications', label: 'Notifications' },
    { key: 'settings', href: 'settings.html', icon: 'settings', label: 'Settings' },
    { key: 'report', href: 'https://forms.gle/u7oQ1HBnrdqtmXRc9', icon: 'report', label: 'Report', bottom: true }
  ];

  function ensureIconFont() {
    if (document.querySelector('link[data-vtx-icons="1"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
    link.setAttribute('data-vtx-icons', '1');
    document.head.appendChild(link);
  }

  function buildSidebar(activeKey) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'vtx-page-sidebar';
    sidebar.setAttribute('aria-label', 'Site navigation');

    const logoLink = document.createElement('a');
    logoLink.className = 'vtx-sidebar-logo-link';
    logoLink.href = 'index.html';
    logoLink.title = 'Home';
    logoLink.innerHTML = '<img class="vtx-sidebar-logo" src="logo.png" alt="VorteX logo">';
    sidebar.appendChild(logoLink);

    navItems.forEach(item => {
      const link = document.createElement('a');
      link.className = 'vtx-sidebar-link';
      if (item.bottom) {
        link.classList.add('vtx-sidebar-link-report');
      }
      link.href = item.href;
      link.title = item.label;
      link.setAttribute('aria-label', item.label);
      link.innerHTML = `<span class="material-symbols-outlined">${item.icon}</span>`;
      sidebar.appendChild(link);
    });

    return sidebar;
  }

  window.initPageSidebar = function initPageSidebar(activeKey) {
    if (window.self !== window.top) return;
    if (document.querySelector('.vtx-page-sidebar')) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function onReady() {
        initPageSidebar(activeKey);
      }, { once: true });
      return;
    }

    ensureIconFont();
    document.body.classList.add('vtx-has-page-sidebar');
    if (activeKey === 'games') {
      document.body.classList.add('vtx-sidebar-no-scroll');
    }
    document.body.prepend(buildSidebar(activeKey || ''));
  };
})();

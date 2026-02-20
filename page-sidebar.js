(function () {
  const navItems = [
    { key: 'home', href: 'index.html', icon: 'home', label: 'Home' },
    { key: 'games', href: 'games.html', icon: 'newsstand', label: 'Games' },
    { key: 'news', href: 'notifications.html', icon: 'notifications', label: 'Notifications' },
    { key: 'settings', href: 'settings.html', icon: 'settings', label: 'Settings' }
  ];

  function ensureIconFont() {
    if (document.querySelector('link[data-vtx-icons="1"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400';
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
      if (item.key === activeKey) link.classList.add('active');
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
    document.body.prepend(buildSidebar(activeKey || ''));
  };
})();

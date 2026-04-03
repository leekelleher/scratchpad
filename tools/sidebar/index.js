export default {
    name: 'sidebar',
    footer: true,
    action() {
        const sidebarEl = document.getElementById("sidebar");
        const isOpen = sidebarEl.style.display == 'flex';
        sidebarEl.style.display = isOpen ? 'none' : 'flex';
        sidebarEl.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    }
};

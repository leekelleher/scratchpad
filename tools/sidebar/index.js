export default {
    name: 'sidebar',
    footer: true,
    action() {
        let sidebarEl = document.querySelector("#sidebar");
        let isOpen = sidebarEl.style.display == 'block';
        sidebarEl.style.display = isOpen ? 'none' : 'block';
        sidebarEl.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    }
};

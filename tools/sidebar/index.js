export default {
    name: 'sidebar',
    footer: true,
    action() {
        const sidebarEl = document.getElementById("sidebar");
        sidebarEl.ariaHidden = sidebarEl.ariaHidden === 'false' ? 'true' : 'false';
    }
};

export default {
    name: 'sidebar',
    footer: true,
    action() {
        let sidebarEl = document.querySelector("#sidebar");
        sidebarEl.style.display = sidebarEl.style.display == 'block' ? 'none' : 'block';
    }
};

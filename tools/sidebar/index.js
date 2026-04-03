export default function() {
    const sidebarEl = document.getElementById("sidebar");
    sidebarEl.ariaHidden = sidebarEl.ariaHidden === 'false' ? 'true' : 'false';
}

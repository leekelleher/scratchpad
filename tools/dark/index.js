export default {
    name: 'dark',
    footer: true,
    action() {
        const root = document.documentElement;
        const isDark = root.style.colorScheme === 'dark';
        root.style.colorScheme = isDark ? 'light' : 'dark';
        localStorage.setItem("mode", isDark ? "light" : "dark");
    }
};

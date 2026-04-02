export default {
    name: 'dark',
    footer: true,
    action() {
        let body = document.querySelector('body');

        if (body.classList.contains('night')) {
            body.classList = 'day';
            localStorage.setItem("mode", "day");
        } else {
            body.classList = 'night';
            localStorage.setItem("mode", "night");
        }
    }
};

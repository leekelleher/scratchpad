export default {
    name: 'base64-decode',
    action(scratchpad) {
        scratchpad.value = atob(scratchpad.value);
    }
};

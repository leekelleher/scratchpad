export default {
    name: 'base64-encode',
    action(scratchpad) {
        scratchpad.value = btoa(scratchpad.value);
    }
};

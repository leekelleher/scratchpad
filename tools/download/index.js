export default function(scratchpad) {
    var link = "data:application/octet-stream;charset=utf-16le;base64," + btoa(scratchpad.value);
    var el = document.createElement('a');
    el.setAttribute("href", link);
    el.setAttribute("download", new Date().toISOString().replaceAll(":", "") + "-scratchpad.txt");
    el.innerText = "dl";
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}

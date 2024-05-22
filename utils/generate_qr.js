const qr = require("qrcode")
document.addEventListener("DOMContentLoaded", async function() {
    const btn = document.getElementById("enter");
    const qrcode = document.getElementById("qrcode");

    btn.addEventListener("click", async function() {
        const text = document.getElementById("text").value;
        const qrDataURL = qr.toDataURL(text);
        qrcode.innerHTML = `<img src="${qrDataURL}" alt="QR Code"/>`;
    });
});

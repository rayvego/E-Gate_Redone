const scanner = new Html5QrcodeScanner('reader' , {
    qrbox: {
        width: 300,
        height: 300,
    },
    fps: 20,
});

scanner.render(success, error);

function success(result) {
    console.log("QR content: ", result);
    window.location = `http://localhost:3000/security/verify/${result}`;
    scanner.clear();
    document.getElementById('reader').remove();
}

function error(err) {
    //console.error(err);
}
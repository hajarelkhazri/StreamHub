window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    if (room) {
        document.getElementById('room-create').hidden = true;
        document.querySelector('.room-comm').hidden = false;
        document.querySelector('#randomNumber').innerText = room;
    }
});
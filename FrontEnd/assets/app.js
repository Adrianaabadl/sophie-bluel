document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Funny click');
    });
});
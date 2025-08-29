document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById('send-button');
    const modalPhotoGallery = document.getElementById('modal-photogallery');
    const closeBtns = document.querySelectorAll('.close');
    const addPhotoButtom = document.getElementById("addPhoto");
    const modalAddPhoto = document.getElementById('modal-addphoto');

    // Open modal
    sendButton.addEventListener('click', function(event) {
        event.preventDefault();
        modalPhotoGallery.style.display = 'block'

    });

    // Close modal #ASK 
    closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modalPhotoGallery.style.display = 'none';
        modalAddPhoto.style.display = 'none';
        });
    });

    // Force close if user click outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modalPhotoGallery.style.display = 'none';
            modalAddPhoto.style.display = 'none';
        }
    });

    // Open second modal 
     addPhotoButtom.addEventListener('click', function(event) {
        event.preventDefault();
        modalPhotoGallery.style.display = 'none'; // Close the other modal
        modalAddPhoto.style.display = 'block' // Open the new modal

    });


});

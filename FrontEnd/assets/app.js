// ===========================
// Modals
// ===========================
function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'block';
}

function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
}

// ===========================
// Login
// ===========================
async function handleLogin(event) {
    
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', { // Todo: Change the URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('User Not Found');

        const result = await response.json(); // Save the token => window.token or local storage
        // console.log(result)
        // console.log(result.json)
        localStorage.setItem("token", result.token);
        const token = localStorage.getItem("token"); // I can create another variable by going to the local storage localStorage.getItem('token')
        window.location.href = 'index.html';
    } catch (error) {
        console.error(error);
        alert('User Not Found');
        window.location.reload();
    }
}

// ===========================
// DOMContentLoaded
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    // Modales
    const sendButton = document.getElementById('send-button');
    const addPhotoButton = document.getElementById("addPhoto");
    const modalPhotoGallery = document.getElementById('modal-photogallery');
    const modalAddPhoto = document.getElementById('modal-addphoto');
    const closeBtns = document.querySelectorAll('.close');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    // Open Modal Photo Gallery
    if (sendButton && nameInput && emailInput) {
    sendButton.addEventListener('click', (e) => {
        e.preventDefault();

        const nameLength = nameInput.value.trim().length;
        const emailLength = emailInput.value.trim().length;

        if (nameLength === 0 || emailLength === 0) {
            alert('Name and Email are required');
            return; // detiene la ejecución, evita abrir el modal
        }

        // Si pasa la validación, abre el modal
        openModal(modalPhotoGallery);
    });
}

    // Open Modal Add Photo
    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(modalPhotoGallery);
            openModal(modalAddPhoto);
        });
    }

    // Close Modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => { 
            closeModal(modalPhotoGallery); 
            closeModal(modalAddPhoto); 
        });
    });

    // Close Modal
    window.addEventListener('click', (event) => {
        if (event.target === modalPhotoGallery) closeModal(modalPhotoGallery);
        if (event.target === modalAddPhoto) closeModal(modalAddPhoto);
    });

    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
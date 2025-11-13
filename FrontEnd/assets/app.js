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
// DOMContentLoaded
// ===========================
document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // LOAD GALLERY FROM API
    // ===========================
    async function loadGallery() {
        const gallery = document.querySelector('.gallery');

        try {
            const response = await fetch("http://localhost:5678/api/works");
            const works = await response.json();

            gallery.innerHTML = "";

            works.forEach(work => {
                const figure = document.createElement("figure");

                figure.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <figcaption>${work.title}</figcaption>
                `;

                gallery.appendChild(figure);
            });

        } catch (error) {
            console.error("Error trying loading the content:", error);
            gallery.innerHTML = "<p>Error while loading the gallery content.</p>";
        }
    };

    loadGallery();


    // const sendButton = document.getElementById('send-button');
    const contactForm = document.forms['contact-form'] ? document.forms['contact-form'] : null;
    const addPhotoForm = document.forms['addphoto-form'];
    const addPhotoButton = document.getElementById("addPhoto");
    const modalPhotoGallery = document.getElementById('modal-photogallery');
    const modalAddPhoto = document.getElementById('modal-addphoto');
    const closeBtns = document.querySelectorAll('.close');

    // Open Modal Photo Gallery
    if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // el formulario hace redirects 
            openModal(modalPhotoGallery);
        });
    };

    // Open Modal Add Photo
    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(modalPhotoGallery);
            openModal(modalAddPhoto);

        });
    };

    addPhotoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const imageTitle = document.getElementById("title").value;
        const category = document.getElementById("category").value;
        const uploadInput = document.getElementById('uploadPhoto');
        const imageFile = uploadInput.files ? uploadInput.files[0] : null;

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', imageTitle);
        formData.append('category', 1); // FIXME
        
        // HTML values
        const gallery = document.querySelector('.gallery');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const caption = document.createElement('figcaption');

        try {
            const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            });
            const data = await response.json();
            // localStorage.setItem("apiResponse", JSON.stringify(data)); //TODO

            // == Update HTML == // 
            console.log(imageUrl);
            img.src = data.imageUrl;
            img.alt = data.title;
            caption.textContent = data.title;

            figure.appendChild(img);
            figure.appendChild(caption);
            gallery.appendChild(figure);
            
        } catch (error) {
            console.error('Error in file submission:', error);
        }
    });


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


    // Preview de la imagen 
    const uploadInput = document.getElementById("uploadPhoto");
    const preview = document.getElementById("uploadPhotoPreview");
    const uploadBox = document.getElementById("uploadBox");
    if (uploadInput) {
        uploadInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader(); // read from disk or storage from clients side

                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                    preview.style.objectFit = "cover";
                    preview.style.width = "420px";
                    preview.style.height = "160px";
                    if (uploadBox)  {
                        uploadBox.style.display = "none";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});


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

    let works = [];
    const gallery = document.querySelector('.gallery');
    // ===========================
    // LOAD GALLERY FROM API
    // ===========================
    async function loadGallery() {
        try {
            const response = await fetch("http://localhost:5678/api/works");
            works = await response.json();

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

    // =============================
    // LOAD GALLERY DINAMICALLY
    // =============================
    const categoriesList = document.getElementById("categories");
    categoriesList.addEventListener("click", (e) => {
        let filteredWork;
        if (e.target.tagName === "LI") {
            const categoryValue = e.target.dataset.value || "all";
            console.log(categoryValue);
            
            if (categoryValue === "all") {
                filteredWork = works;
            } else {
                filteredWork = works.filter(work => work.categoryId === Number(categoryValue));
            }
            gallery.innerHTML = "";
            filteredWork.forEach(filteredWork => {
                const figure = document.createElement("figure");
                figure.innerHTML = `
                    <img src="${filteredWork.imageUrl}" alt="${filteredWork.title}">
                    <figcaption>${filteredWork.title}</figcaption>
                `;
                gallery.appendChild(figure);
            });
        }
    });

    const editProjectIcon = document.getElementsByClassName('edit-project-icon')[0];
    const contactForm = document.forms['contact-form'] ? document.forms['contact-form'] : null;
    const addPhotoForm = document.forms['addphoto-form'];
    const addPhotoButton = document.getElementById("addPhoto");
    const modalPhotoGallery = document.getElementById('modal-photogallery');
    const modalAddPhoto = document.getElementById('modal-addphoto');
    const closeBtns = document.querySelectorAll('.close');

    // Open Modal Photo Gallery
    editProjectIcon.addEventListener('click', (e) => {
        openModal(modalPhotoGallery);
    });

    // ==============================
    // LOAD GALLERY IN MODAL FROM API
    // ==============================
    const photoGrid = document.querySelector('.photo-grid');

    async function loadPhotoGrid() {
        try {
            const response = await fetch("http://localhost:5678/api/works");
            const works = await response.json();

            photoGrid.innerHTML = "";

            works.forEach(work => {
                const gridwrapper = document.createElement("div");
                gridwrapper.classList.add("grid-wrapper");
                gridwrapper.innerHTML = `
                    <img src="${work.imageUrl}" alt="${work.title}">
                    <i class="fa-regular fa-trash-can delete-icon" data-id="${work.id}"></i>
                `;
                photoGrid.appendChild(gridwrapper);
            });

            // Delete picture event
            const deleteIcons = document.querySelectorAll('.delete-icon');
            deleteIcons.forEach(icon => {
                const token = localStorage.getItem("token");
                icon.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    
                    try {
                        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'accept': '*/*'
                            }
                        });

                        if (response.ok) {
                            e.currentTarget.parentElement.remove();
                            console.log(`Work ID ${id} deleted`);
                        } else {
                            console.error("Error while deleting:", response.statusText);
                        }

                    } catch (error) {
                        console.error("Error:", error);
                    }
                });
            });

        } catch (error) {
            console.error("Error loading gallery:", error);
            photoGrid.innerHTML = "<p>Error while loading the gallery content.</p>";
        }
    }

    loadPhotoGrid();


    // Contact Form
    if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Thank you!');
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
        const categoryId = document.getElementById("category").value;
        const uploadInput = document.getElementById('uploadPhoto');
        const imageFile = uploadInput.files ? uploadInput.files[0] : null;

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', imageTitle);
        formData.append('category', categoryId);
        
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


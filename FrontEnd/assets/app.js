// ===========================
// DOMContentLoaded
// ===========================
document.addEventListener("DOMContentLoaded", () => {

    // Login-Logout Section 
    const btn = document.getElementById("login-logout-hyperlink");
    const token = localStorage.getItem("token");
    // Delete edit section
    const editSection = document.getElementById("edit-section");

    if (!token) {
        editSection.style.display = "none";
    }

    if (token) {
        btn.textContent = "Logout";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    } else {
        btn.innerHTML = `<a href="login.html">Login</a>`;
    }

    // ===========================
    // LOAD GALLERY FROM API
    // ===========================

    const API_WORKS = "https://web-6z5du17st95d.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/works";
    let works = [];
    const gallery = document.querySelector('.gallery');
    const photoGrid = document.querySelector('.photo-grid');


    async function loadWorks({
        containerSelector = '.gallery',
        showDeleteIcons = false,
        forceReload = false
    } = {}) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        try {
            if (forceReload || !works || works.length === 0) {
                const res = await fetch(API_WORKS);
                works = await res.json();
            }

            container.innerHTML = "";

            works.forEach(work => {
                if (showDeleteIcons) {
                    const wrapper = document.createElement("div");
                    wrapper.classList.add("grid-wrapper");
                    wrapper.innerHTML = `
                        <img src="${work.imageUrl}" alt="${work.title}">
                        <i class="fa-regular fa-trash-can delete-icon" data-id="${work.id}"></i>
                    `;
                    container.appendChild(wrapper);
                    const delIcon = wrapper.querySelector('.delete-icon');
                    delIcon.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const id = e.currentTarget.dataset.id;
                        const token = localStorage.getItem("token");
                        try {
                            const response = await fetch(`${API_WORKS}/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'accept': '*/*'
                                }
                            });

                            if (response.ok) {
                                works = works.filter(w => w.id !== Number(id));
                                if (response.ok) {
                                    await loadWorks({
                                        containerSelector: '.gallery',
                                        showDeleteIcons: false,
                                        forceReload: true
                                    });

                                    await loadWorks({
                                        containerSelector: '.photo-grid',
                                        showDeleteIcons: true,
                                        forceReload: true
                                    });

                                    modalPhotoGallery.close();
                                }
                                modalPhotoGallery.close();
                                console.log(`Work ID ${id} deleted`);
                            } else {
                                console.error("Error while deleting:", response.statusText);
                            }
                        } catch (error) {
                            console.error("Error:", error);
                        }
                    });

                } else {
                    const figure = document.createElement("figure");
                    figure.innerHTML = `
                        <img src="${work.imageUrl}" alt="${work.title}">
                        <figcaption>${work.title}</figcaption>
                    `;
                    container.appendChild(figure);
                }
            });

        } catch (error) {
            console.error("Error loading works:", error);
            container.innerHTML = "<p>Error while loading the gallery content.</p>";
        }
    }

    loadWorks({ containerSelector: '.gallery', showDeleteIcons: false });
    loadWorks({ containerSelector: '.photo-grid', showDeleteIcons: true, forceReload: true });


    // Filter elements
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
    const modalPhotoGallery = document.getElementById("modal-photogallery");
    const modalAddPhoto = document.getElementById('modal-addphoto');
    const closeBtns = document.querySelectorAll('.close');
        
    // Open Modal Photo Gallery
    editProjectIcon.addEventListener('click', () => {
        modalPhotoGallery.showModal();
        // loadWorks({ containerSelector: '.photo-grid', showDeleteIcons: true, forceReload: true });
    });


    // Open Modal Add Photo
    if (addPhotoButton) {
        addPhotoButton.addEventListener('click', (e) => {
            e.preventDefault();
            modalPhotoGallery.close();
            modalAddPhoto.showModal();
        });
    };

    // Close ANY Modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => { 
            modalPhotoGallery.close();
            modalAddPhoto.close();
        });
    });

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
            const response = await fetch('https://web-6z5du17st95d.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/works', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            });
            const data = await response.json();

            // == Update HTML == // 
            img.src = data.imageUrl;
            img.alt = data.title;
            caption.textContent = data.title;

            figure.appendChild(img);
            figure.appendChild(caption);
            gallery.appendChild(figure);

            modalAddPhoto.close();
            
        } catch (error) {
            console.error('Error in file submission:', error);
        }
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

    // Contact Form
    if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            windows.alert("Thank you for your message. We'll be in touch soon.")
        });
    };

});


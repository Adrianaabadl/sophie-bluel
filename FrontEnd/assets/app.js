document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById('send-button');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const gallery = document.getElementById("gallery");

    // Lista de imágenes
    const imageList = [
        "abajour-tahina.png",
        "appartement-paris-v.png",
        "appartement-paris-x.png",
        "appartement-paris-xviii.png",
        "bar-lullaby-paris.png",
        "hotel-first-arte-new-delhi.png",
        "la-balisiere.png",
        "le-coteau-cassis.png",
        "restaurant-sushisen-londres.png",
        "sophie-bluel.png",
        "structures-thermopolis.png",
        "villa-ferneze.png"
    ];

    // Insertar imágenes en el contenedor
    imageList.forEach(fileName => {
        const img = document.createElement("img");
        img.src = `assets/images/${fileName}`; // ruta relativa
        img.alt = fileName.split(".")[0];
        gallery.appendChild(img);
    });

    // Abrir modal
    sendButton.addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'block';
    });

    // Cerrar modal con la X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal clicando fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

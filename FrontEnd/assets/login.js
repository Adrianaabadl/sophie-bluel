// ===========================
// Login
// ===========================
async function handleLogin(event) {
    
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://web-6z5du17st95d.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('User Not Found');

        const result = await response.json();
        localStorage.setItem("token", result.token);
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

    // Login
    const loginForm = document.forms['login-form'];
    // const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});


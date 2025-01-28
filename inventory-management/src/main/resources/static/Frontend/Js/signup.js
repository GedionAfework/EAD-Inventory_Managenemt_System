// Js/signup.js
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const user = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            const data = await response.json();
            alert('Registration successful!');
            // Optionally redirect to login or another page
            window.location.href = 'dashboard.html';
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});
// Js/login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const loginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // If the response is OK, parse the JSON
            }
            return response.json().then(err => { // Handle error response
                throw new Error(err.message || 'Invalid credentials');
            });
        })
        .then(data => {
            console.log('Login successful:', data);
            // Redirect to the dashboard on successful login
            window.location.href = 'dashboard.html'; // Adjust the path as necessary
        })
        .catch(error => {
            console.error('Login failed:', error);
            alert(error.message); // Show an alert with the error message
        });
});
document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const userData = {
        username: username,
        email: email,
        password: password
    };

    fetch('/api/auth/update-profile', {  // Remove hardcoded localhost:8080
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',  // Important for sending cookies
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Profile updated successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update profile. Please try again.');
        });
});
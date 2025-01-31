document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const loginData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((err) => {
          throw new Error(err.message || "Invalid credentials");
        });
      })
      .then((data) => {
        console.log("Login successful:", data);

        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert(error.message);
      });
  });

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger-menu");
    const layoutOptions = document.querySelector(".layout-options");
    const addItemModal = document.getElementById("add-item-modal");
    const closeBtn = document.querySelector(".close-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const addItemButton = document.getElementById("add-item-btn");
    const itemsContainer = document.getElementById("added-items-container");
    const totalItemsSpan = document.getElementById("total-items");
    const totalQuantitySpan = document.getElementById("total-quantity");
    const totalValueSpan = document.getElementById("total-value");
    const showAddItemBtn = document.getElementById("show-add-item-btn");

    let totalItems = 0;
    let totalQuantity = 0;
    let totalValue = 0;

    // Fetch items on page load
    fetchItems();

    function fetchItems() {
        fetch("/api/items") // Adjust this endpoint as necessary
            .then(response => response.json())
            .then(data => {
                itemsContainer.innerHTML = "";
                data.forEach(displayItem);
                updateTotals(data);
            })
            .catch(error => console.error("Error fetching items:", error));
    }

    function displayItem(item) {
        const newItem = document.createElement("div");
        newItem.classList.add("added-item");
        newItem.dataset.id = item.id;
        newItem.dataset.price = item.price * item.quantity;
        newItem.innerHTML = `
            <p>Name: ${item.name}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ETB ${item.price}</p>
            ${item.imageUrl ? `<img src="${item.imageUrl}" class="item-image">` : ""}
            <div class="item-actions">
                <button class="edit-btn" data-id="${item.id}">Edit</button>
                <button class="delete-btn" data-id="${item.id}">Delete</button>
            </div>
        `;
        itemsContainer.appendChild(newItem);
    }

    function updateTotals(items) {
        totalItems = items.length;
        totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        totalItemsSpan.textContent = totalItems;
        totalQuantitySpan.textContent = `${totalQuantity} units`;
        totalValueSpan.textContent = `ETB ${totalValue.toFixed(2)}`;
    }

    // Show modal
    showAddItemBtn.addEventListener("click", () => addItemModal.style.display = "flex");

    // Close modal
    closeBtn.addEventListener("click", () => addItemModal.style.display = "none");
    cancelBtn.addEventListener("click", () => addItemModal.style.display = "none");
    window.addEventListener("click", event => {
        if (event.target === addItemModal) addItemModal.style.display = "none";
    });

    // Add new item
    addItemButton.addEventListener("click", function () {
        const itemName = document.getElementById("item-name").value;
        const itemDescription = document.getElementById("item-description").value;
        const itemNumber = parseInt(document.getElementById("item-number").value);
        const itemPrice = parseFloat(document.getElementById("item-price").value);
        const itemImage = document.getElementById("item-image").files[0];

        if (!itemName || !itemNumber || !itemPrice) return alert("Please fill in all fields.");

        const formData = new FormData();
        formData.append("item", JSON.stringify({ name: itemName, description: itemDescription, quantity: itemNumber, price: itemPrice }));
        if (itemImage) formData.append("image", itemImage);

        fetch("/api/items", { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                displayItem(data);
                updateTotals([...document.querySelectorAll(".added-item")].map(item => ({
                    quantity: parseInt(item.dataset.quantity),
                    price: parseFloat(item.dataset.price) / parseInt(item.dataset.quantity)
                })));
                addItemModal.style.display = "none";
                document.getElementById("add-item-form").reset();
            })
            .catch(error => console.error("Error adding item:", error));
    });

    // Delete or Edit item using event delegation
    itemsContainer.addEventListener("click", event => {
        if (event.target.classList.contains("delete-btn")) {
            const itemId = event.target.dataset.id;
            fetch(`/api/items/${itemId}`, { method: "DELETE" })
                .then(() => {
                    document.querySelector(`[data-id='${itemId}']`).remove();
                    updateTotals([...document.querySelectorAll(".added-item")].map(item => ({
                        quantity: parseInt(item.dataset.quantity),
                        price: parseFloat(item.dataset.price) / parseInt(item.dataset.quantity)
                    })));
                })
                .catch(error => console.error("Error deleting item:", error));
        }

        if (event.target.classList.contains("edit-btn")) {
            const itemId = event.target.dataset.id;
            fetch(`/api/items/${itemId}`)
                .then(response => response.json())
                .then(item => {
                    document.getElementById("item-name").value = item.name;
                    document.getElementById("item-description").value = item.description;
                    document.getElementById("item-number").value = item.quantity;
                    document.getElementById("item-price").value = item.price;
                    addItemModal.style.display = "flex";

                    addItemButton.onclick = () => {
                        const updatedItem = {
                            name: document.getElementById("item-name").value,
                            description: document.getElementById("item-description").value,
                            quantity: parseInt(document.getElementById("item-number").value),
                            price: parseFloat(document.getElementById("item-price").value)
                        };

                        fetch(`/api/items/${itemId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedItem)
                        })
                            .then(response => response.json())
                            .then(() => {
                                fetchItems();
                                addItemModal.style.display = "none";
                            })
                            .catch(error => console.error("Error updating item:", error));
                    };
                })
                .catch(error => console.error("Error fetching item details:", error));
        }
    });
});
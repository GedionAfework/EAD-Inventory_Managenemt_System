document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger-menu");
    const layoutOptions = document.querySelector(".layout-options");
    const addItemModal = document.getElementById("add-item-modal");
    const closeBtn = addItemModal.querySelector(".close-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const addItemButton = document.getElementById("add-item-btn");
    const itemsContainer = document.getElementById("added-items-container");
    const totalItemsSpan = document.getElementById("total-items");
    const totalQuantitySpan = document.getElementById("total-quantity");
    const totalValueSpan = document.getElementById("total-value");

    let totalItems = 0;
    let totalQuantity = 0;
    let totalValue = 0;

    // Fetch items on page load
    fetchItems();

    function fetchItems() {
        fetch("/api/items") // Adjust this endpoint as necessary
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                itemsContainer.innerHTML = ''; // Clear existing items
                data.forEach(item => {
                    displayItem(item);
                });
                updateTotals(data);
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
    }

    function displayItem(item) {
        const newItem = document.createElement("div");
        newItem.classList.add("added-item");
        newItem.innerHTML = `
            <p>Name: ${item.name}</p>
            <p>Number of Items: ${item.quantity}</p>
            <p>Price: ETB ${item.price}</p>
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Item Image" class="item-image">` : ""}
            <div class="item-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        newItem.addEventListener("click", function () {
            showItemDetails(item);
        });

        itemsContainer.appendChild(newItem);
    }

    function updateTotals(items) {
        totalItems = items.length;
        totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        totalItemsSpan.textContent = `Items: ${totalItems}`;
        totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
        totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(2)}`;
    }

    // Modal functionality
    document.getElementById("show-add-item-btn").addEventListener("click", function () {
        addItemModal.style.display = "flex";
    });

    closeBtn.addEventListener("click", function () {
        addItemModal.style.display = "none";
    });

    cancelBtn.addEventListener("click", function () {
        addItemModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === addItemModal) {
            addItemModal.style.display = "none";
        }
    });

    // Add new item
    addItemButton.addEventListener("click", function () {
        const itemName = document.getElementById("item-name").value;
        const itemDescription = document.getElementById("item-description").value;
        const itemNumber = parseInt(document.getElementById("item-number").value);
        const itemPrice = parseFloat(document.getElementById("item-price").value);
        const itemImage = document.getElementById("item-image").files[0];

        if (itemName && itemNumber && itemPrice) {
            const formData = new FormData();
            formData.append("item", JSON.stringify({
                name: itemName,
                description: itemDescription,
                quantity: itemNumber,
                price: itemPrice,
            }));
            if (itemImage) {
                formData.append("image", itemImage);
            }

            fetch("/api/items", {
                method: "POST",
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    displayItem(data); // Display the new item without re-fetching
                    totalItems++;
                    totalQuantity += data.quantity;
                    totalValue += data.price * data.quantity;

                    totalItemsSpan.textContent = `Items: ${totalItems}`;
                    totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
                    totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(2)}`;

                    addItemModal.style.display = "none";
                    addItemModal.querySelector("form").reset();
                })
                .catch(error => {
                    console.error("Error adding item:", error);
                    alert("There was a problem adding the item.");
                });
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Show item details
    function showItemDetails(item) {
        document.getElementById("item-details-name").innerText = item.name;
        document.getElementById("item-details-description").innerText = item.description;
        document.getElementById("item-details-number").innerText = `Number: ${item.quantity}`;
        document.getElementById("item-details-price").innerText = `Price: ETB ${item.price}`;
        document.getElementById("item-details-image").src = item.imageUrl || "";

        document.getElementById("item-details-modal").style.display = "flex";
    }

    // Close item details modal
    document.getElementById("close-details-modal").addEventListener("click", function () {
        document.getElementById("item-details-modal").style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === document.getElementById("item-details-modal")) {
            document.getElementById("item-details-modal").style.display = "none";
        }
    });

    // Item action listeners
    itemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            // Handle edit logic here
        }

        if (event.target.classList.contains("delete-btn")) {
            // Handle delete logic here
        }
    });
});
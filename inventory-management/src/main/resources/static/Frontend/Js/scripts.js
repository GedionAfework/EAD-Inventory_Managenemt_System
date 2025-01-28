document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("show-add-item-btn");
  const addItemModal = document.getElementById("add-item-modal");
  const closeBtn = document.querySelector(".close-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const addItemForm = document.getElementById("add-item-form");
  const itemsContainer = document.getElementById("added-items-container");
  const emptyMessage = document.getElementById("empty-message");

  // Show the modal when the "ADD ITEM" button is clicked
  addItemBtn.addEventListener("click", function () {
    addItemModal.style.display = "flex"; // Show modal
  });

  // Close the modal when the close button or cancel button is clicked
  closeBtn.addEventListener("click", function () {
    addItemModal.style.display = "none"; // Close modal
  });

  cancelBtn.addEventListener("click", function () {
    addItemModal.style.display = "none"; // Close modal
  });

  // Close the modal if clicked outside of it
  window.addEventListener("click", function (event) {
    if (event.target === addItemModal) {
      addItemModal.style.display = "none"; // Close modal
    }
  });

  // Handle form submission
  addItemForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const itemName = document.getElementById("item-name").value;
    const itemDescription = document.getElementById("item-description").value;
    const itemNumber = document.getElementById("item-number").value;
    const itemPrice = document.getElementById("item-price").value;

    if (itemName && itemNumber && itemPrice) {
      const newItem = {
        name: itemName,
        description: itemDescription,
        quantity: parseInt(itemNumber),
        price: parseFloat(itemPrice)
      };

      try {
        const response = await fetch('http://localhost:8080/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newItem)
        });

        if (response.ok) {
          const createdItem = await response.json();
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("added-item");
          itemDiv.innerHTML = `
                        <p>Name: ${createdItem.name}</p>
                        <p>Description: ${createdItem.description}</p>
                        <p>Quantity: ${createdItem.quantity}</p>
                        <p>Price: ETB ${createdItem.price}</p>
                    `;
          itemsContainer.appendChild(itemDiv);

          if (itemsContainer.children.length === 1) {
            emptyMessage.style.display = "none"; // Hide empty message
          }

          addItemForm.reset(); // Reset form fields
          addItemModal.style.display = "none"; // Close modal
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'An error occurred while adding the item.');
        }
      } catch (error) {
        console.error('Error adding item:', error);
        alert('An error occurred while adding the item.');
      }
    } else {
      alert("Please fill in all fields.");
    }
  });
});
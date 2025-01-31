document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger-menu");
  const layoutOptions = document.querySelector(".layout-options");

  hamburger.addEventListener("click", function () {
    layoutOptions.classList.toggle("show");
  });

  const addItemModal = document.getElementById("add-item-modal");
  const closeBtn = addItemModal.querySelector(".close-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const addItemButton = document.getElementById("add-item-btn");
  const itemsContainer = document.getElementById("added-items-container");
  const emptyMessage = document.getElementById("empty-message");
  const totalItemsSpan = document.getElementById("total-items");
  const totalQuantitySpan = document.getElementById("total-quantity");
  const totalValueSpan = document.getElementById("total-value");

  let totalItems = 0;
  let totalQuantity = 0;
  let totalValue = 0;

  document
    .getElementById("show-add-item-btn")
    .addEventListener("click", function () {
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

  addItemButton.addEventListener("click", function () {
    const itemName = document.getElementById("item-name").value;
    const itemDescription = document.getElementById("item-description").value;
    const itemNumber = parseInt(document.getElementById("item-number").value);
    const itemPrice = parseFloat(document.getElementById("item-price").value);
    const itemImage = document.getElementById("item-image").files[0];

    if (itemName && itemNumber && itemPrice) {
      const formData = new FormData();
      formData.append(
        "item",
        JSON.stringify({
          name: itemName,
          description: itemDescription,
          quantity: itemNumber,
          price: itemPrice,
        })
      );
      if (itemImage) {
        formData.append("image", itemImage);
      }

      fetch("/api/items", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const newItem = document.createElement("div");
          newItem.classList.add("added-item");
          newItem.innerHTML = `
          <p>Name: ${data.name}</p>
          <p>Number of Items: ${data.quantity}</p>
          <p>Price: ETB ${data.price}</p>
          ${
            data.imageUrl
              ? `<img src="${data.imageUrl}" alt="Item Image" class="item-image">`
              : ""
          }
          <div class="item-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;

          newItem.addEventListener("click", function () {
            showItemDetails(data);
          });

          itemsContainer.appendChild(newItem);

          totalItems++;
          totalQuantity += data.quantity;
          totalValue += data.price * data.quantity;

          totalItemsSpan.textContent = `Items: ${totalItems}`;
          totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
          totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(
            2
          )}`;

          addItemModal.style.display = "none";
          addItemModal.querySelector("form").reset();
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          alert("There was a problem adding the item.");
        });
    } else {
      alert("Please fill in all fields.");
    }
  });

  function showItemDetails(item) {
    document.getElementById("item-details-name").innerText = item.name;
    document.getElementById("item-details-description").innerText =
      item.description;
    document.getElementById(
      "item-details-number"
    ).innerText = `Number: ${item.quantity}`;
    document.getElementById(
      "item-details-price"
    ).innerText = `Price: ETB ${item.price}`;
    document.getElementById("item-details-image").src = item.imageUrl || "";

    document.getElementById("item-details-modal").style.display = "flex";
  }

  document
    .getElementById("close-details-modal")
    .addEventListener("click", function () {
      document.getElementById("item-details-modal").style.display = "none";
    });

  window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("item-details-modal")) {
      document.getElementById("item-details-modal").style.display = "none";
    }
  });

  itemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
    }

    if (event.target.classList.contains("delete-btn")) {
    }
  });
});

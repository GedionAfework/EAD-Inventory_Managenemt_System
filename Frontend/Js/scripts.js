document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger-menu");
  const layoutOptions = document.querySelector(".layout-options");

  hamburger.addEventListener("click", function () {
    layoutOptions.classList.toggle("show");
    layoutOptions.style.position = "absolute";
    layoutOptions.style.top = "100%";
    layoutOptions.style.left = "0";
  });

  const addItemBtn = document.querySelector(".add-btn.bottom-btn");
  const addItemModal = document.getElementById("add-item-modal");
  const closeBtn = document.querySelector(".close-btn");
  const cancelBtn = document.querySelector(".cancel-btn");

  const addItemForm = document.getElementById("add-item-form");
  const addItemButton = document.getElementById("add-item-btn");
  const itemsContainer = document.getElementById("added-items-container");
  const emptyMessage = document.getElementById("empty-message");
  const bottomAddItemBtn = document.querySelector(".add-btn.bottom-btn");

  const totalItemsSpan = document.getElementById("total-items");
  const totalQuantitySpan = document.getElementById("total-quantity");
  const totalValueSpan = document.getElementById("total-value");

  let totalItems = 0;
  let totalQuantity = 0;
  let totalValue = 0;
  let editItemIndex = null; // To store the index of the item being edited

  addItemBtn.addEventListener("click", function () {
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
      const newItem = document.createElement("div");
      newItem.classList.add("added-item");

      let imageHTML = "";
      if (itemImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imageHTML = `<img src="${e.target.result}" alt="Item Image" class="item-image">`;
          newItem.innerHTML = `
            <p>Name: ${itemName}</p>
            <p>Number of Items: ${itemNumber}</p>
            <p>Price: ETB ${itemPrice}</p>
            <div class="item-actions" style="display: none;">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          `;
          itemsContainer.appendChild(newItem);

          totalItems++;
          totalQuantity += itemNumber;
          totalValue += itemPrice * itemNumber;

          totalItemsSpan.textContent = `Items: ${totalItems}`;
          totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
          totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(
            2
          )}`;

          if (itemsContainer.children.length === 1) {
            emptyMessage.style.display = "none";
            bottomAddItemBtn.style.display = "none";
          }

          addItemForm.reset();
          addItemModal.style.display = "none";

          // Click event for new item
          newItem.addEventListener("click", function () {
            const itemDetailsModal =
              document.getElementById("item-details-modal");
            const itemDetailsName =
              document.getElementById("item-details-name");
            const itemDetailsDescription = document.getElementById(
              "item-details-description"
            );
            const itemDetailsNumber = document.getElementById(
              "item-details-number"
            );
            const itemDetailsPrice =
              document.getElementById("item-details-price");
            const itemDetailsImage =
              document.getElementById("item-details-image");

            itemDetailsName.textContent = `Name: ${itemName}`;
            itemDetailsDescription.textContent = `Description: ${itemDescription}`;
            itemDetailsNumber.textContent = `Number of Items: ${itemNumber}`;
            itemDetailsPrice.textContent = `Price: ETB ${itemPrice}`;

            if (itemImage) {
              itemDetailsImage.src = URL.createObjectURL(itemImage);
              itemDetailsImage.style.display = "block";
            } else {
              itemDetailsImage.style.display = "none";
            }

            itemDetailsModal.style.display = "flex";
            document.body.style.overflow = "hidden";

            // Show edit and delete buttons
            const itemActions = newItem.querySelector(".item-actions");
            itemActions.style.display = "block";

            // Edit button functionality
            const editButton = itemActions.querySelector(".edit-btn");
            const deleteButton = itemActions.querySelector(".delete-btn");

            editButton.addEventListener("click", function (event) {
              event.stopPropagation(); // Prevent card click event

              // Fill the edit form with existing item data
              document.getElementById("item-name").value = itemName;
              document.getElementById("item-description").value =
                itemDescription;
              document.getElementById("item-number").value = itemNumber;
              document.getElementById("item-price").value = itemPrice;

              // Store the index of the item being edited
              editItemIndex = Array.from(itemsContainer.children).indexOf(
                newItem
              );

              addItemModal.style.display = "flex";
            });

            // Delete button functionality
            deleteButton.addEventListener("click", function (event) {
              event.stopPropagation(); // Prevent card click event

              newItem.remove();

              totalItems--;
              totalQuantity -= itemNumber;
              totalValue -= itemPrice * itemNumber;

              totalItemsSpan.textContent = `Items: ${totalItems}`;
              totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
              totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(
                2
              )}`;

              if (itemsContainer.children.length === 0) {
                emptyMessage.style.display = "block";
                bottomAddItemBtn.style.display = "block";
              }
            });
          });
        };
        reader.readAsDataURL(itemImage);
      } else {
        newItem.innerHTML = `
          <p>Name: ${itemName}</p>
          <p>Number of Items: ${itemNumber}</p>
          <p>Price: ETB ${itemPrice}</p>
          <div class="item-actions" style="display: none;">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;
        itemsContainer.appendChild(newItem);

        totalItems++;
        totalQuantity += itemNumber;
        totalValue += itemPrice * itemNumber;

        totalItemsSpan.textContent = `Items: ${totalItems}`;
        totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
        totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(
          2
        )}`;

        if (itemsContainer.children.length === 1) {
          emptyMessage.style.display = "none";
          bottomAddItemBtn.style.display = "none";
        }

        addItemForm.reset();
        addItemModal.style.display = "none";
      }
    } else {
      alert("Please fill in all fields.");
    }
  });

  // Update existing item when editing
  addItemButton.addEventListener("click", function () {
    if (editItemIndex !== null) {
      const itemName = document.getElementById("item-name").value;
      const itemDescription = document.getElementById("item-description").value;
      const itemNumber = parseInt(document.getElementById("item-number").value);
      const itemPrice = parseFloat(document.getElementById("item-price").value);
      const itemImage = document.getElementById("item-image").files[0];

      const itemToEdit = itemsContainer.children[editItemIndex];

      itemToEdit.innerHTML = `
        <p>Name: ${itemName}</p>
        <p>Number of Items: ${itemNumber}</p>
        <p>Price: ETB ${itemPrice}</p>
        <div class="item-actions" style="display: none;">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // If there is a new image, update the image
      if (itemImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const newImageHTML = `<img src="${e.target.result}" alt="Item Image" class="item-image">`;
          itemToEdit.insertAdjacentHTML("beforeend", newImageHTML);
        };
        reader.readAsDataURL(itemImage);
      }

      totalQuantity -= parseInt(
        itemToEdit
          .querySelector("p:nth-child(2)")
          .textContent.split(":")[1]
          .trim()
      );
      totalValue -=
        parseFloat(
          itemToEdit
            .querySelector("p:nth-child(3)")
            .textContent.split(":")[1]
            .trim()
        ) *
        parseInt(
          itemToEdit
            .querySelector("p:nth-child(2)")
            .textContent.split(":")[1]
            .trim()
        );

      totalItemsSpan.textContent = `Items: ${totalItems}`;
      totalQuantitySpan.textContent = `Total Quantity: ${totalQuantity}`;
      totalValueSpan.textContent = `Total Value: ETB ${totalValue.toFixed(2)}`;

      addItemForm.reset();
      addItemModal.style.display = "none";

      // Clear editItemIndex after updating
      editItemIndex = null;
    }
  });
});

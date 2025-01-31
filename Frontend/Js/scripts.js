document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger-menu");
  const layoutOptions = document.querySelector(".layout-options");
  const addItemBtn = document.querySelector(".add-btn.bottom-btn");
  const addItemModal = document.getElementById("add-item-modal");
  const closeBtn = document.querySelector(".close-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const addItemForm = document.getElementById("add-item-form");
  const addItemButton = document.getElementById("add-item-btn");
  const itemsContainer = document.getElementById("added-items-container");
  const emptyMessage = document.getElementById("empty-message");
  const totalItemsSpan = document.getElementById("total-items");
  const totalQuantitySpan = document.getElementById("total-quantity");
  const totalValueSpan = document.getElementById("total-value");

  let totalItems = 0, totalQuantity = 0, totalValue = 0, editItemIndex = null;

  hamburger.addEventListener("click", () => {
    layoutOptions.classList.toggle("show");
    Object.assign(layoutOptions.style, { position: "absolute", top: "100%", left: "0" });
  });

  [addItemBtn, closeBtn, cancelBtn].forEach(btn =>
    btn.addEventListener("click", () => addItemModal.style.display = btn === addItemBtn ? "flex" : "none")
  );

  window.addEventListener("click", (event) => {
    if (event.target === addItemModal) addItemModal.style.display = "none";
  });

  addItemButton.addEventListener("click", () => {
    const itemName = document.getElementById("item-name").value;
    const itemDescription = document.getElementById("item-description").value;
    const itemNumber = parseInt(document.getElementById("item-number").value);
    const itemPrice = parseFloat(document.getElementById("item-price").value);
    const itemImage = document.getElementById("item-image").files[0];

    if (!itemName || !itemNumber || !itemPrice) return alert("Please fill in all fields.");

    const newItem = document.createElement("div");
    newItem.classList.add("added-item");
    newItem.innerHTML = `
      <p>Name: ${itemName}</p>
      <p>Number of Items: ${itemNumber}</p>
      <p>Price: ETB ${itemPrice}</p>
      <div class="item-actions" style="display: none;">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    if (itemImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newItem.insertAdjacentHTML("afterbegin", `<img src="${e.target.result}" alt="Item Image" class="item-image">`);
      };
      reader.readAsDataURL(itemImage);
    }

    itemsContainer.appendChild(newItem);
    updateSummary(++totalItems, totalQuantity += itemNumber, totalValue += itemPrice * itemNumber);
    toggleEmptyState();

    addItemForm.reset();
    addItemModal.style.display = "none";

    newItem.addEventListener("click", () => showItemDetails(newItem, { itemName, itemDescription, itemNumber, itemPrice, itemImage }));
  });

  function showItemDetails(itemElement, itemData) {
    const { itemName, itemDescription, itemNumber, itemPrice, itemImage } = itemData;
    const itemDetailsModal = document.getElementById("item-details-modal");

    document.getElementById("item-details-name").textContent = `Name: ${itemName}`;
    document.getElementById("item-details-description").textContent = `Description: ${itemDescription}`;
    document.getElementById("item-details-number").textContent = `Number of Items: ${itemNumber}`;
    document.getElementById("item-details-price").textContent = `Price: ETB ${itemPrice}`;

    const itemDetailsImage = document.getElementById("item-details-image");
    itemDetailsImage.style.display = itemImage ? "block" : "none";
    if (itemImage) itemDetailsImage.src = URL.createObjectURL(itemImage);

    itemDetailsModal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const itemActions = itemElement.querySelector(".item-actions");
    itemActions.style.display = "block";

    itemActions.querySelector(".edit-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      document.getElementById("item-name").value = itemName;
      document.getElementById("item-description").value = itemDescription;
      document.getElementById("item-number").value = itemNumber;
      document.getElementById("item-price").value = itemPrice;
      editItemIndex = [...itemsContainer.children].indexOf(itemElement);
      addItemModal.style.display = "flex";
    });

    itemActions.querySelector(".delete-btn").addEventListener("click", (event) => {
      event.stopPropagation();
      itemElement.remove();
      updateSummary(--totalItems, totalQuantity -= itemNumber, totalValue -= itemPrice * itemNumber);
      toggleEmptyState();
    });
  }

  function updateSummary(items, quantity, value) {
    totalItemsSpan.textContent = `Items: ${items}`;
    totalQuantitySpan.textContent = `Total Quantity: ${quantity}`;
    totalValueSpan.textContent = `Total Value: ETB ${value.toFixed(2)}`;
  }

  function toggleEmptyState() {
    emptyMessage.style.display = itemsContainer.children.length ? "none" : "block";
    addItemBtn.style.display = itemsContainer.children.length ? "none" : "block";
  }

  addItemButton.addEventListener("click", () => {
    if (editItemIndex === null) return;

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

    if (itemImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        itemToEdit.insertAdjacentHTML("afterbegin", `<img src="${e.target.result}" alt="Item Image" class="item-image">`);
      };
      reader.readAsDataURL(itemImage);
    }

    updateSummary(totalItems, totalQuantity -= parseInt(itemToEdit.querySelector("p:nth-child(2)").textContent.split(":")[1].trim()) + itemNumber,
      totalValue -= parseFloat(itemToEdit.querySelector("p:nth-child(3)").textContent.split(":")[1].trim()) * itemNumber + itemPrice * itemNumber);

    addItemForm.reset();
    addItemModal.style.display = "none";
    editItemIndex = null;
  });
});

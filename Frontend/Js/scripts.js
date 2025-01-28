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

  addItemBtn.addEventListener("click", function () {
    addItemModal.style.display = "flex";
  });

  const showAddItemBtn = document.querySelector(".add-btn");
  showAddItemBtn.addEventListener("click", function () {
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

  const addItemForm = document.getElementById("add-item-form");
  const addItemButton = document.getElementById("add-item-btn");
  const itemsContainer = document.getElementById("added-items-container");
  const emptyMessage = document.getElementById("empty-message");
  const bottomAddItemBtn = document.querySelector(".add-btn.bottom-btn");

  addItemButton.addEventListener("click", function () {
    const itemName = document.getElementById("item-name").value;
    const itemNumber = document.getElementById("item-number").value;
    const itemPrice = document.getElementById("item-price").value;

    if (itemName && itemNumber && itemPrice) {
      const newItem = document.createElement("div");
      newItem.classList.add("added-item");
      newItem.innerHTML = `
                    <p>Name: ${itemName}</p>
                    <p>Number of Items: ${itemNumber}</p>
                    <p>Price: ETB ${itemPrice}</p>
                `;

      itemsContainer.appendChild(newItem);

      if (itemsContainer.children.length === 1) {
        emptyMessage.style.display = "none";
        bottomAddItemBtn.style.display = "none";
      }

      addItemForm.reset();
      addItemModal.style.display = "none";
    } else {
      alert("Please fill in all fields.");
    }
  });

  const layoutRadios = document.querySelectorAll('input[name="layout"]');

  layoutRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const layoutValue = this.value;

      if (layoutValue === "grid") {
        itemsContainer.classList.add("grid-layout");
        itemsContainer.classList.remove("list-layout");
      } else if (layoutValue === "list") {
        itemsContainer.classList.add("list-layout");
        itemsContainer.classList.remove("grid-layout");
      }
    });
  });
});

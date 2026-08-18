const STORAGE_KEY = "northstar_preorder";

let preOrderItems = [];

const productCatalog = {
  sourdough: { name: "Classic Sourdough", price: 7.5 },
  croissant: { name: "Butter Croissant", price: 4.0 },
  cake: { name: "Custom Celebration Cake", price: 45.0 }
};

function loadPreOrders() {
  const saved = localStorage.getItem(STORAGE_KEY);
  preOrderItems = saved ? JSON.parse(saved) : [];
}

function savePreOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preOrderItems));
}

function addToPreOrder(productId) {
  const product = productCatalog[productId];
  if (!product) {
    return;
  }
  preOrderItems.push({ id: productId, name: product.name, price: product.price });
  savePreOrders();
  renderPreOrderList();
}

function removeFromPreOrder(index) {
  preOrderItems.splice(index, 1);
  savePreOrders();
  renderPreOrderList();
}

function clearPreOrders() {
  preOrderItems = [];
  savePreOrders();
  renderPreOrderList();
}

function calculateTotal() {
  return preOrderItems.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);
}

function renderPreOrderList() {
  const listEl = document.getElementById("preorder-list");
  const countEl = document.getElementById("preorder-count");
  const totalEl = document.getElementById("preorder-total");

  listEl.innerHTML = "";

  if (preOrderItems.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.id = "preorder-empty";
    emptyItem.textContent = "Your pre-order list is empty.";
    listEl.appendChild(emptyItem);
  } else {
    preOrderItems.forEach(function (item, index) {
      const li = document.createElement("li");
      li.textContent = item.name + " - $" + item.price.toFixed(2) + " ";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.setAttribute("aria-label", "Remove " + item.name + " from pre-order list");
      removeBtn.addEventListener("click", function () {
        removeFromPreOrder(index);
      });

      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }

  countEl.textContent = preOrderItems.length;
  totalEl.textContent = calculateTotal().toFixed(2);
}

function setupPreOrderButtons() {
  const buttons = document.querySelectorAll(".preorder-btn");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      addToPreOrder(button.dataset.id);
    });
  });

  const clearBtn = document.getElementById("clear-preorder");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearPreOrders);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadPreOrders();
  renderPreOrderList();
  setupPreOrderButtons();
});

const amount = document.querySelector(".amount")
let counter = parseInt(localStorage.getItem('cartCounter')) || 0;

if(counter === 0) {
  amount.classList.add("amount-none")
} 

function amountCounter() {
  amount.classList.remove("amount-none")
  counter++;
  amount.textContent = counter;
  saveCartCounter();
}

//модальне вікно
const modal = document.getElementById("modal");
const btn = document.getElementById("basketBtn");
const span = document.getElementsByClassName("close")[0];
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


//додавання продукту в модальне
function addToCart(event) {
  const product = event.target.closest('.product-cart');
  const productName = product.querySelector('.name-product').textContent;
  const productPrice = product.querySelector('.price-product').textContent;

  if (cartItems[productName]) {
      cartItems[productName].quantity++;
  } else {
      cartItems[productName] = {
          quantity: 1,
          price: productPrice
      };
  }
  cartItems[productName].index = cartItems[productName].index || Object.keys(cartItems).length;

  updateCartModal();
  saveCartCounter();
  saveCartStorage();
}

function updateCartModal() {
  const cartItemsEl = document.getElementById('cartItems');
  cartItemsEl.innerHTML = '';
  let priceCounter = 0;
  let index = 0;


  for (let itemName in cartItems) {
      const item = cartItems[itemName];
      const itemRow = document.createElement('div');
      itemRow.classList.add('cart-item');

      itemRow.innerHTML = `
        <img src="img/${itemName}.jpg" alt="${itemName}" class="cart-item-photo">
        <span class="cart-item-name">${itemName}</span>
        <span class="cart-item-price">${item.price}$</span>
        <div class="quantity-paragraph">
          <button class="quantity-btn1" data-item="${itemName}" onclick="decreaseQuantity(event)">-</button>
          <span class="cart-item-quantity">${item.quantity} шт</span>
          <button class="quantity-btn2" data-item="${itemName}" onclick="increaseQuantity(event)">+</button>
        </div>
      `;
      cartItemsEl.appendChild(itemRow);
      priceCounter += +item.price * item.quantity
      cartItems[itemName].index = index++;
    }
    document.querySelector('.total-price').textContent = priceCounter;
    
    saveCartCounter();
    saveCartStorage();
}

function decreaseQuantity(event) {
  counter--;
  amount.textContent = counter

  const itemName = event.target.getAttribute('data-item');
  cartItems[itemName].quantity--;

  if (cartItems[itemName].quantity <= 0) {
    delete cartItems[itemName];
    if(Object.keys(cartItems).length === 0) {
      modal.style.display = "none";
      amount.classList.add("amount-none")
    }
  }
  updateCartModal();
  saveCartStorage();
}

function increaseQuantity(event) {
  counter++;
  amount.textContent = counter

  const itemName = event.target.getAttribute('data-item');
  cartItems[itemName].quantity++;
  const cartItemPrice = document.querySelector(".cart-item-price")
  const itemPrice = cartItems[itemName].price * cartItems[itemName].quantity;
  cartItemPrice.textContent = itemPrice;
  updateCartModal();
  saveCartStorage()
}

function saveCartStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function saveCartCounter() {
  localStorage.setItem('cartCounter', counter);
}

const addToCartButtons = document.querySelectorAll('.button-product');
addToCartButtons.forEach(function(button) {
  button.addEventListener('click', addToCart);
  saveCartCounter();
});



window.addEventListener('load', function() {
  if (localStorage.getItem('cartItems')) {
      cartItems = JSON.parse(localStorage.getItem('cartItems'));
      const totalCount = Object.values(cartItems).reduce((acc, curr) => acc + curr.quantity, 0);
      amount.textContent = totalCount;
      basketCounter.textContent = totalCount;
      updateCartModal();
  }
});

window.addEventListener('load', function() {
  amount.textContent = counter; 
});
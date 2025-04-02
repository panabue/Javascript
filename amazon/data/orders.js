import {addToCart, calculateCartQuantity} from './cart.js';
import { formatCurrency } from '../scripts/utils/money.js';
import { products, loadProducts } from './products.js';

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('orders', JSON.stringify(orders));
}

function generateOrders() {
  let orderHtml = ``;

  orders.forEach((order) => {
    let productHtml = ``;

    // Converter orderTime para um objeto Date
    const orderDate = new Date(order.orderTime);

    // Formatar a data no estilo "MMMM, D"
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(orderDate);

    // Gerar os produtos do pedido
    order.products.forEach((element) => {
      products.forEach((product) => {
        if (element.productId === product.id) {
          // Converter orderTime para um objeto Date
          let orderDate2 = new Date(element.estimatedDeliveryTime);

          // Formatar a data no estilo "MMMM, D"
          let formattedDate2 = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(orderDate2);
          
          let formattedDate3 = new Intl.DateTimeFormat('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric' 
          }).format(orderDate2);

          productHtml += `
          <div class="product-image-container">
            <img src="${product.image}">
          </div>

          <div class="product-details">
            <div class="product-name">${product.name}</div>
            <div class="product-delivery-date">Arriving on: ${formattedDate2}</div>
            <div class="product-quantity">Quantity: ${element.quantity}</div>
            <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.id}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html">
              <button class="track-package-button button-secondary" data-product-name="${product.name}" data-product-date="${formattedDate3}" data-product-quantity="${element.quantity}" data-product-img="${product.image}">Track package</button>
            </a>
          </div>`;
        }
      });
    });

    // Construindo o HTML do pedido
    orderHtml += `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formattedDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>

      <div class="order-details-grid js-order-details-grid">
        ${productHtml} 
      </div>
    </div>`;
  });

  // Atualizar a área de pedidos antes de modificar qualquer elemento dentro dela
  const ordersGrid = document.querySelector('.js-orders-grid');
  if (ordersGrid) {
    ordersGrid.innerHTML = orderHtml;
  }

  const cartQ = document.querySelector('.js-cart-quantity');
  if (cartQ) {
    cartQ.innerHTML = calculateCartQuantity();
  }

  document.querySelectorAll('.js-buy-again-button').forEach((element)=>{
    element.addEventListener('click', ()=>{
      const productId = element.dataset.productId;
  
      addToCart(productId, 1);
  
      window.location.href = 'checkout.html';
    });
  });

  document.querySelectorAll('.track-package-button').forEach((element)=>{
    element.addEventListener('click', ()=> {
      const productName = element.dataset.productName;
      const productDate = element.dataset.productDate;
      const productQuantity = element.dataset.productQuantity;
      const productImg = element.dataset.productImg;
    
      const trackingData = {
        productName,
        productDate,
        productQuantity,
        productImg
      };
    
      localStorage.setItem('trackingData', JSON.stringify(trackingData)); 
    
      window.location.href = 'tracking.html';
    });    
  });
}

loadProducts(generateOrders);

//console.log(orders);
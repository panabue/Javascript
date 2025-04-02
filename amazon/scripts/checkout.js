import {cart, removeFromCart, calculateCartQuantity, saveToStorage, updateDeliveryOption} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import {renderPaymentSummary} from './utils/paymentSummary.js'
import {deliveryOptions} from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

new Promise((resolve)=>{
  loadProducts(()=>{
    resolve();
  });
}).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
}).catch((error)=>{
  console.log('Unexpected Error. Please try again later.');
});

async function renderOrderSummary(){
  let cartHtml = '';

  if(cart.length === 0){
    let noItem = `<div style="width: max-content;">
      <p>Your cart is empty.</p>
      <button class="place-order-button button-primary" onclick="window.location.href='amazon.html'">
      View products
      </button>
    </div>
    `;
    await renderPaymentSummary();

    document.querySelector('.js-order-summary').innerHTML = noItem;

    const orderButton = document.querySelector(`.js-place-order`);
    orderButton.classList.remove('button-primary');
    orderButton.classList.add('edited');
    orderButton.disabled = true;
  }else{
    cart.forEach((product)=>{
      const productId = product.productId;
  
      products.forEach((element)=>{
        if(element.id === productId){
          let deliveryOption;
  
          deliveryOptions.forEach((option)=>{
            if(option.id === product.deliveryOptionId){
              deliveryOption = option;
            }
          });
  
          cartHtml += `<div class="cart-item-container js-cart-container-${productId}">
            <div class="delivery-date">
              Delivery date: ${calculateDeliveryDate(deliveryOption.deliveryDays)}
            </div>
  
            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${element.image}">
  
              <div class="cart-item-details">
                <div class="product-name">
                  ${element.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(element.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label quantity-label-${productId}">${product.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${productId}">
                    Update
                  </span>
                  <input class="quantity-input quantity-input-${productId}" data-product-id="${productId}">
                  <span class="link-primary js-save-button" data-product-id="${productId}">
                    Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
                    Delete
                  </span>
                </div>
              </div>
  
              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(productId, product)}
              </div>
            </div>
          </div>
          </div>`;
        }
      });
    });

    await renderPaymentSummary();

    const orderButton = document.querySelector(`.js-place-order`);
    orderButton.classList.add('button-primary');
    orderButton.classList.remove('edited');
    orderButton.disabled = false;

    document.querySelector('.js-order-summary').innerHTML = cartHtml;

    document.querySelectorAll('.js-delete-link').forEach((link)=>{
      link.addEventListener('click', ()=>{
        const productId = link.dataset.productId;
        removeFromCart(productId);
        updateCartItems();
        renderOrderSummary();

        const container = document.querySelector(`.js-cart-container-${productId}`);
        container.remove();
      });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element)=>{
      element.addEventListener('click', ()=>{
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
      });
    });

    function updateButton(){
      document.querySelectorAll('.js-update-quantity-link').forEach((item)=>{
        item.addEventListener('click', ()=>{
          const productId = item.dataset.productId;
          const teste = document.querySelector(`.js-cart-container-${productId}`);
          teste.classList.add('is-editing-quantity');
        });
      });
    }
    
    updateButton();
    
    function saveButton(){
      document.querySelectorAll('.js-save-button').forEach((item)=>{
        item.addEventListener('click', ()=>{
          const productId = item.dataset.productId;
          let newValue = document.querySelector(`.quantity-input-${productId}`);
          let x = Number(newValue.value);
          if(x && x>0 && x<1000){
            document.querySelector(`.quantity-label-${productId}`).innerHTML = x;
            const teste = document.querySelector(`.js-cart-container-${productId}`);
            teste.classList.remove('is-editing-quantity');
            updateQuantity(productId, x);
          }
        });
      });
    }
    
    saveButton();
    
    function enterInput(){
      document.querySelectorAll('.quantity-input').forEach((item)=>{
        item.addEventListener('keydown', (event)=>{
          if(event.key === 'Enter'){
            const productId = item.dataset.productId;
            let x = Number(item.value);
            if(x && x>0 && x<1000){
              document.querySelector(`.quantity-label-${productId}`).innerHTML = x;
              const teste = document.querySelector(`.js-cart-container-${productId}`);
              teste.classList.remove('is-editing-quantity');
              updateQuantity(productId, x);
            }
          }
        });
      });
    }
    
    enterInput();
  }
}

function deliveryOptionsHTML(productId, product){
  let html = '';
  deliveryOptions.forEach((deliveryOption)=>{
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === product.deliveryOptionId;
    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${productId}" 
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${calculateDeliveryDate(deliveryOption.deliveryDays)};
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>`;
  });
  return html;
}

function updateCartItems(){
  if(cart.length===0){
    document.querySelector('.js-return-to-home-link').innerHTML = 'No items';
  }
  else{
    if(calculateCartQuantity()===1){
      document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} item`;
    }else{
      document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
    }
  }
}

updateCartItems();

function updateQuantity(productId, newQuantity){
  cart.forEach((item)=>{
    if(item.productId===productId){
      item.quantity = newQuantity;
    }
  });

  updateCartItems();
  renderPaymentSummary();
  saveToStorage();
}

function calculateDeliveryDate(deliveryDays){
  const today = dayjs();
  let deliveryDate = today;
  let dias = deliveryDays;

  while(dias>0){
    deliveryDate = deliveryDate.add(1, 'days');
    /*if(!isWeekend(deliveryDate.format('dddd'))){
      dias--;
    }*/
   dias--;
  }

  const dateString = deliveryDate.format('dddd, MMMM D');
  return dateString;
}

//A API usada nao calcula se é ou nao fim de semana :(
/*function isWeekend(date){
  if(date === 'Saturday' || date === 'Sunday'){
    return true;
  }else{
    return false;
  }
}*/

import {cart, calculateCartQuantity, resetCart} from '../../data/cart.js';
import { products } from '../../data/products.js';
import {formatCurrency} from './money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary(){
  let paymentHtml = '';

  paymentHtml = 
  `<div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${calculateCartQuantity()}):</div>
    <div class="payment-summary-money">$${formatCurrency(calculatePrice())}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">$${formatCurrency(calculateShipping())}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(calculateTotalBeforeTax())}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(calculateTax())}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">$${formatCurrency(calculateTotal())}</div>
  </div>

  <button class="place-order-button button-primary js-place-order">
    Place your order
  </button>`;

  document.querySelector('.js-payment-summary').innerHTML = paymentHtml;

  document.querySelector('.js-place-order').addEventListener('click', async ()=>{

    try{
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cart: cart})
      });
  
      const order = await response.json();
      addOrder(order);
      resetCart();
    } catch (error) {
      console.log('Unexpected Error. Please try again later.');
    }

    window.location.href = 'orders.html';
  });
}

function calculatePrice(){
  let price = 0;
  cart.forEach((item)=>{

    products.forEach((product)=>{
      if(item.productId === product.id){
        price += product.priceCents * item.quantity;
      }
    });
  });

  return price;
}

function calculateShipping(){
  let shipping = 0;
  cart.forEach((item)=>{
    if(item.deliveryOptionId==='2'){
      shipping += 499;
    }else if(item.deliveryOptionId==='3'){
      shipping += 999;
    }
  });

  return shipping;
}

function calculateTotalBeforeTax(){
  let totalBeforeTax = 0;
  totalBeforeTax += calculatePrice() + calculateShipping();
  return totalBeforeTax;
}

function calculateTax(){
  let tax = 0;
  tax = calculateTotalBeforeTax() * 0.1;
  return tax;
}

function calculateTotal(){
  let total = 0;
  total = calculateTax() + calculateTotalBeforeTax();
  return total;
}
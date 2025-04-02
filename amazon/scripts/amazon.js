import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(renderProductsGrid);

export function renderProductsGrid(){
  let productsHtml = ``;
  let ativo = false;
  let interval;

  //Gera os obejtos em HTML
  products.forEach((product)=>{
    productsHtml += `<div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHtml()}

      <div class="product-spacer"></div>

      <div class="added-to-cart added-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHtml;

  function addedNotification(added){
    added.classList.add('added');

    if(ativo===false){
      ativo = true;
      interval = setTimeout(()=>{added.classList.remove('added'); ativo=false},1500);
    }else{
      clearTimeout(interval);
      interval = setTimeout(()=>{added.classList.remove('added'); ativo=false},1500);
    }
  }

  function addCartQuantity(){
    document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
  }

  //Adiciona compras no carrinho
  document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
    button.addEventListener('click', ()=>{

    const productId = button.dataset.productId;
    const quantity = Number(document.querySelector(`.js-quantity-selector-${button.dataset.productId}`).value);
    const added = document.querySelector(`.added-${button.dataset.productId}`);

    addedNotification(added);
    addToCart(productId, quantity);
    addCartQuantity();
    })
  });

  addCartQuantity();
}
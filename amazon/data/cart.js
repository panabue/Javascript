export let cart;

loadFromStorage();

export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart')) || [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  },{
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: '2'
  }];
}

export function addToCart(productId, quantity){
  if(cart.length === 0){
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
   }
   else{
    let achou = false;
    for(let i=0;i<cart.length;i++){
      if(cart[i].productId === productId){
        cart[i].quantity += quantity;
        achou = true;
        break;
      }
    }
    if(!achou){
      cart.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: '1'
      });
    }
   }
  saveToStorage();
}

export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(productId){
  for(let i=0;i<cart.length;i++){
    if(cart[i].productId === productId){
      cart.splice(i,1);
    }
  }

  saveToStorage();
}

export function calculateCartQuantity(){
  let cartQuantity = 0;

  cart.forEach((item)=>{
    cartQuantity += item.quantity;
  });

  return cartQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionId){
  cart.forEach((item)=>{
    if(item.productId===productId){
      item.deliveryOptionId = deliveryOptionId;
    }
  });
  saveToStorage();
}

export function resetCart(){
  cart = [];
  saveToStorage();
}
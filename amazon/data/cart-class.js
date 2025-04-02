class Cart {
  cartItems = undefined;
  #localStorageKey = undefined;

  constructor(localStorageKey){
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  };

  #loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: '1'
    },{
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: '2'
    }];
  };

  saveToStorage(){
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  };

  addToCart(productId, quantity){
    if(this.cartItems.length === 0){
      this.cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: '1'
      });
    }
    else{
      let achou = false;
      for(let i=0;i<this.cartItems.length;i++){
        if(this.cartItems[i].productId === productId){
          this.cartItems[i].quantity += quantity;
          achou = true;
          break;
        }
      }
      if(!achou){
        this.cartItems.push({
          productId: productId,
          quantity: quantity,
          deliveryOptionId: '1'
        });
      }
    }
    this.saveToStorage();
  };

  removeFromCart(productId){
    for(let i=0;i<this.cartItems.length;i++){
      if(this.cartItems[i].productId === productId){
        this.cartItems.splice(i,1);
      }
    }

    this.saveToStorage();
  };

  calculateCartQuantity(){
    let cartQuantity = 0;

    this.cartItems.forEach((item)=>{
      cartQuantity += item.quantity;
    });

    return cartQuantity;
  };

  updateDeliveryOption(productId, deliveryOptionId){
    this.cartItems.forEach((item)=>{
      if(item.productId===productId){
        item.deliveryOptionId = deliveryOptionId;
      }
    });
    this.saveToStorage();
  };

}

/*const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

cart.addToCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e', 2);

console.log(cart);
console.log(businessCart);*/
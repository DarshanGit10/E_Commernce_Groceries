import React, { useEffect } from "react";
import "./Cart.css";
import { useCart } from "../../context/cart";

const Cart = () => {
  const [cart, setCart] = useCart();

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  const totalPrice = () =>{
    try {
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        return total.toLocaleString('en-IN', {
            style : "currency",
            currency : "INR"
        });
    } catch (error) {
        console.log(error)
    }
}




  const removeItemFromCart = (index) => {
    try {
        const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
        console.log(error)
    }
    
  }

  return (
    <div>
      <div className="container cartContainer">
        <div className="row">
          <div className="md-col-12">
            <h1 className="text-center bg-light p-2 mb-1">Your Cart</h1>
            <h4 className="text-center">
              {cart?.length > 1
                ? `You Have ${cart.length} items in your cart`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7">
          {cart.map((item, index) => {
  return (
    <div key={index} className="row m-2 card p-1 flex-row">
      <div className="col-md-4">
        <img src={item.photo} alt="photo" width={"180px"} height={"180px"}/>
      </div>
      <div className="col-md-8 mt-3">
        <h6>{item.name}</h6>
        <p>{item.description}</p>
        <span>Price: {item.price}/-</span> <span style={{marginLeft:"15px"}}> Quantity: {item.quantity}</span>
        <div className="cartRemoveBtn"><button onClick={() => removeItemFromCart(index)}>Remove</button></div>
      </div>
    </div>
  );
})}

          </div>
          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Total | Checkout | Payment</p>
            <hr/>
            <h5>Total: {totalPrice()}/-</h5>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

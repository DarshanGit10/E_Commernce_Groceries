import React, { useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert";
import { useCart } from "../../context/cart";

const ProductCard = ({
  name,
  description,
  photo,
  price,
  quantity,
  count,
  _id,
}) => {
  const [alert, setAlert] = useState(null);
  const [cart, setCart] = useCart();

  function showAlert(message, type) {
    setAlert({
      msg: message,
      ty: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  }

  const navigate = useNavigate();

  const handleCartClick = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("User:Token");
    if (!token) {
      showAlert("Please log in to add items to your cart", "warning");
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } else {
      if (count === 0) {
        showAlert("Item out of stock", "warning");
        return;
      }
      const userId = localStorage.getItem("User:Id");
      let existingCart = localStorage.getItem(`User:${userId}:cart`)
        ? JSON.parse(localStorage.getItem(`User:${userId}:cart`))
        : [];

      // Check if the current product already exists in the cart
      // const existingProductIndex = existingCart.findIndex(product => product._id === _id);
      // if (existingProductIndex > -1) {
      //   // If the current product already exists, update its quantity and count
      //   existingCart[existingProductIndex].count += count;
      //   showAlert('Item updated in cart', 'success');
      // } else {

      // }
      // If the current product does not exist, add it to the cart
      existingCart.push({
        _id,
        name,
        description,
        photo,
        price,
        quantity,
        count,
      });
      showAlert("Item added to cart", "success");
      // Save the updated cart to localStorage
      localStorage.setItem(`User:${userId}:cart`, JSON.stringify(existingCart));

      // Update the cart state with the updated cart data
      setCart(existingCart);
    }
  };

  return (
    <>
      <div className="product-card">
        <div className="cart-image">
          <img
            src={require("../../assets/cart.png")}
            alt={name}
            onClick={handleCartClick}
          />
        </div>
        <div className="alertPositionProduct">
          <Alert alert={alert} />
        </div>
        <div className="product-image">
          <img src={photo} alt={name} />
        </div>
        <div className="product-details">
          <h3>{name}</h3>
          <p>{description}</p>
          <div className="product-info">
            <div className="product-price">Price: {price}</div>
            <div className="product-quantity">Quantity: {quantity}</div>
            <div className="product-count">Count: {count}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

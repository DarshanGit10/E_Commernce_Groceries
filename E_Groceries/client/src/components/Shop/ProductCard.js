import React, {useState} from 'react';
import './ProductCard.css'
import {useNavigate} from 'react-router-dom'
import Alert from "../Alert";
import { useCart } from '../../context/cart';


const ProductCard = ({ name, description, photo, price, quantity, count }) => {
  const [alert, setAlert] = useState(null);
  const [cart, setCart] = useCart()

  function showAlert(message, type) {
    setAlert({
      msg: message,
      ty: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  }

  const navigate = useNavigate()

  const handleCartClick = (event) =>{
    event.preventDefault();
    const token = localStorage.getItem('User:Token');
    if(!token){
      showAlert("Please try login ", "warning");
      setTimeout(() => {
          navigate('/login')
      }, 4000);
    }
    else{
      setCart((prevCart) => {
        // Add the current product to the cart
        const updatedCart = [...prevCart, { name, description, photo, price, quantity, count }];
        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        // Return the updated cart to set it in the state
        return updatedCart;
      });
      showAlert("Item added to cart ", "success");
    }
    
  }


  return (
    <>
    <div className="alertPositionProduct">
    <Alert alert={alert} />
    {/* Alert Text !!!! */}
  </div>
    <div className="product-card">
        <div className="cart-image">
        <img src={require("../../assets/cart.png")} alt={name} onClick={handleCartClick}/>
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

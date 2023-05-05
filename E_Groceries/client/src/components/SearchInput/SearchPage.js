import React from 'react'
import { useSearch } from '../../context/search'
import {useNavigate} from 'react-router-dom'
import Alert from "../Alert";
import { useCart } from '../../context/cart'
import { useState } from 'react'

const SearchPage = () => {
  const [alert, setAlert] = useState(null);
    const [values, setValues] = useSearch()
    const [cart, setCart] = useCart()
    const navigate = useNavigate()

    function showAlert(message, type) {
      setAlert({
        msg: message,
        ty: type,
      });
  
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    }

    const handleCartClick = (event, product) =>{
      event.preventDefault();
    const token = localStorage.getItem('User:Token');
    if(!token){
      showAlert("Please log in to add items to your cart", "warning");
      setTimeout(() => {
          navigate('/login')
      }, 4000);
    }
    else{
      setCart((prevCart) => {
      
          const newCart = [...prevCart, { ...product }];
          localStorage.setItem('cart', JSON.stringify(newCart));
          return newCart;
        
      });
      showAlert("Item added to cart", "success");
    }
    }


  return (
    <div style={{marginTop:"80px"}}>
           <div className="" style={{position:"fixed", left:"100px", top:"90px"}}>
        <Alert alert={alert} />
      </div>
        <div className="container">
            <div className="text-center">
                <h1>
                    Search Results
                </h1>
                <h6>
                    {values?.matchingProducts.length<1 ?  'No Products Found!' : `Found ${values.matchingProducts.length}`}
                </h6>
                
                <div className="d-flex flex-wrap mt-4">
                    {values.matchingProducts.map((product) => (
                          <div key={product._id} className="product-card">
                          <div className="cart-image">
                          <img src={require("../../assets/cart.png")} alt={product.name}  onClick={(event) => handleCartClick(event, product)}/>
                        </div>
                        <div className="product-image">
                          <img src={product.photo} alt={product.name} />
                        </div>

                        <div className="product-details">
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className="product-info">
                            <div className="product-price">Price: {product.price}</div>
                            <div className="product-quantity">Quantity: {product.quantity}</div>
                            <div className="product-count">Count: {product.count}</div>
                          </div>
                        </div>
                      </div>
                    ))}

                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchPage
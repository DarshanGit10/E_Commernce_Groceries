import React from 'react'

const SearchCard = ({ name, description, photo, price, quantity, count, _id }) => {
  return (
    <div> <div className="product-card">
    <div className="cart-image">
    <img src={require("../../assets/cart.png")} alt={name} />
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
</div></div>
  )
}

export default SearchCard
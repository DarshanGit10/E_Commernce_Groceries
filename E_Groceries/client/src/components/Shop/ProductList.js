import React, { useState} from 'react';
import ProductCard from './ProductCard';
import './ProductCard.css'


const ProductList = ({ products }) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const filterProductsByPriceRange = (priceRange) => {
    setSelectedPriceRange(priceRange);
  };

  const filterProductsWithPriceRange = (products) => {
    switch (selectedPriceRange) {
      case '0-99':
        return products.filter(product => product.price >= 0 && product.price < 100);
        case '100-499':
        return products.filter(product => product.price >= 100 && product.price < 500);
      case '500-999':
        return products.filter(product => product.price >= 500 && product.price < 1000);
      case '1000-1999':
        return products.filter(product => product.price >= 1000 && product.price < 2000);
      case '2000+':
        return products.filter(product => product.price >= 2000);
      default:
        return products;
    }
  };

  const filteredProducts = filterProductsWithPriceRange(products);
  
  return (
    <>
<div className="price-filter" >
  <label className="price-filter__label" htmlFor="category-select">Price:</label>
  <select className="price-filter__select" id="category-select" value={selectedPriceRange} onChange={(e) => filterProductsByPriceRange(e.target.value)}>
    <option value="">All</option>
    <option value="0-99">Rs. 1 - Rs. 99</option>
    <option value="100-499">Rs. 100 - Rs. 499</option>
    <option value="500-999">Rs. 500 - Rs. 999</option>
    <option value="1000-1999">Rs. 1000 - Rs. 1999</option>
    <option value="2000+">Rs. 2000 and above</option>
  </select>
</div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }} className='product-container'>
        {filteredProducts.map(product => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </>
  );
};

export default ProductList;

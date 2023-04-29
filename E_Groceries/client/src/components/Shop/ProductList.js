import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }} className='product-container'>
    {products.map((product) => (
      <ProductCard key={product._id} {...product} />
    ))}
  </div>
  );
};

export default ProductList;

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';

const ProductList = ({ products }) => {
  const [filter, setFilter] = useState(null);

  const handleFilterChange = (range) => {
    setFilter(range);
  };

  const filteredProducts = filter
    ? products.filter((product) => product.price >= filter.min && product.price <= filter.max)
    : products;

  return (
    <>
      <div className='productFilter'>
        <ProductFilter onFilterChange={handleFilterChange} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }} className='product-container'>
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </>
  );
};

export default ProductList;

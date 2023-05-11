import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
const host = process.env.REACT_APP_LOCALHOST;

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${host}api/products/get_product`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => console.log(error));
  }, []);

  return <ProductList products={products} />;
};

export default Shop;

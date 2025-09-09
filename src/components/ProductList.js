import React from 'react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, name: 'Áo sơ mi nam', price: 250000, image: 'https://via.placeholder.com/200x200?text=Shirt' },
  { id: 2, name: 'Quần jean', price: 350000, image: 'https://via.placeholder.com/200x200?text=Jeans' },
  { id: 3, name: 'Giày thể thao', price: 500000, image: 'https://via.placeholder.com/200x200?text=Shoes' },
  { id: 4, name: 'Balo du lịch', price: 300000, image: 'https://via.placeholder.com/200x200?text=Bag' }
];

function ProductList() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;

import React from 'react';

function ProductCard({ product }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
      backgroundColor: '#fff'
    }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
      <h3 style={{ color: '#333' }}>{product.name}</h3>
      <p style={{ color: '#555' }}>{product.price}₫</p>
      <button style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Mua ngay
      </button>
    </div>
  );
}

export default ProductCard;

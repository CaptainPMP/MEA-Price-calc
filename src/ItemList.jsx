import React from 'react';
import './App.css'; // Ensure this is imported

function ItemList({ items, handleQuantityChange }) {
  return (
    <div className="itemListStyle">
      {items.map((item, index) => (
        <div
          key={index}
          className={`itemRowStyle ${index === items.length - 1 ? 'noBorder' : ''}`}
        >
          <div>{item.name}</div>
          <div className="itemFlexStyle">
            <strong style={{ color: 'black', fontSize: 16 }}>
              {item.price.toLocaleString()} ฿
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleQuantityChange(index, -1)}
                className="qtyBtnStyle"
              >
                -
              </button>
              <span className="qtySpanStyle">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(index, 1)}
                className="qtyBtnStyle"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ItemList;

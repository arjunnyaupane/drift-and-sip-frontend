import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import './Menu.css';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// 🧋 Bubble Tea Images
import classicMilkTea from '../assets/classic_milk_tea.jpg';
import taroBubbleTea from '../assets/taro_bubble_tea.jpg';
import mangoGreenTea from '../assets/mango_green_tea.jpg';
import strawberryBoba from '../assets/strawberry_boba.jpg';

// ☕ Coffee Images
import espresso from '../assets/espresso.jpg';
import cappuccino from '../assets/cappuccino.jpg';
import latte from '../assets/latte.jpg';

// 🍽️ Food Images
import chickenMomo from '../assets/chicken_momo.jpg';
import vegNoodles from '../assets/veg_noodles.jpg';
import burger from '../assets/burger.jpg';

// 💨 Hookah Images
import mintHookah from '../assets/mint_hookah.jpg';
import doubleAppleHookah from '../assets/double_apple_hookah.jpg';
import grapesHookah from '../assets/grapes_hookah.jpg';

// Menu Items
const bubbleTeaItems = [
  { id: 1, name: 'Classic Milk Tea', priceHalf: 70, priceFull: 120, image: classicMilkTea },
  { id: 2, name: 'Taro Bubble Tea', priceHalf: 75, priceFull: 130, image: taroBubbleTea },
  { id: 3, name: 'Mango Green Tea', priceHalf: 80, priceFull: 135, image: mangoGreenTea },
  { id: 4, name: 'Strawberry Boba', priceHalf: 85, priceFull: 140, image: strawberryBoba },
];

const coffeeItems = [
  { id: 5, name: 'Espresso', priceHalf: 50, priceFull: 90, image: espresso },
  { id: 6, name: 'Cappuccino', priceHalf: 70, priceFull: 120, image: cappuccino },
  { id: 7, name: 'Latte', priceHalf: 75, priceFull: 130, image: latte },
];

const foodItems = [
  { id: 8, name: 'Chicken Momo', priceHalf: 90, priceFull: 160, image: chickenMomo },
  { id: 9, name: 'Veg Noodles', priceHalf: 80, priceFull: 140, image: vegNoodles },
  { id: 10, name: 'Burger', priceHalf: 70, priceFull: 120, image: burger },
];

const hookahItems = [
  { id: 11, name: 'Mint Hookah', priceHalf: 150, priceFull: 250, image: mintHookah },
  { id: 12, name: 'Double Apple Hookah', priceHalf: 160, priceFull: 270, image: doubleAppleHookah },
  { id: 13, name: 'Grapes Hookah', priceHalf: 155, priceFull: 260, image: grapesHookah },
];

function MenuSection({ title, items }) {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const section = params.get('section');
  if (section) {
    const el = document.getElementById(section);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  }
}, [location]);


  const [itemStates, setItemStates] = useState(items.map(() => ({ size: 'Half', quantity: 1 })));

  const handleSizeChange = (index, size) => {
    const newStates = [...itemStates];
    newStates[index].size = size;
    setItemStates(newStates);
  };

  const handleQuantityChange = (index, delta) => {
    const newStates = [...itemStates];
    const newQty = newStates[index].quantity + delta;
    if (newQty >= 1) {
      newStates[index].quantity = newQty;
      setItemStates(newStates);
    }
  };

  const calculateSectionTotal = () => {
    return items.reduce((acc, item, index) => {
      const { size, quantity } = itemStates[index];
      const price = size === 'Half' ? item.priceHalf : item.priceFull;
      return acc + price * quantity;
    }, 0);
  };

  return (
    <div className="menu-category">
      <h1 className="menu-heading">{title}</h1>
      <div className="menu-grid">
        {items.map((item, index) => {
          const { size, quantity } = itemStates[index];
          const price = size === 'Half' ? item.priceHalf : item.priceFull;

          return (
            <div className="menu-card" key={item.id}>
              <img src={item.image} alt={item.name} className="menu-img" />
              <h2>{item.name}</h2>
              <div className="price-line">
                <label>
                  <input
                    type="radio"
                    name={`size-${item.id}`}
                    value="Half"
                    checked={size === 'Half'}
                    onChange={() => handleSizeChange(index, 'Half')}
                  />
                  Half (₹{item.priceHalf})
                </label>
                <label>
                  <input
                    type="radio"
                    name={`size-${item.id}`}
                    value="Full"
                    checked={size === 'Full'}
                    onChange={() => handleSizeChange(index, 'Full')}
                  />
                  Full (₹{item.priceFull})
                </label>
              </div>
              <div className="quantity-select">
                <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(index, 1)}>+</button>
              </div>
              <p className="final-price">Total: ₹{price * quantity}</p>
              <button
                className="add-to-cart-btn"
                onClick={() =>
                  addToCart({
                    ...item,
                    size,
                    price,
                    quantity,
                    finalPrice: price * quantity,
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
      <div className="section-total">Section Total: ₹{calculateSectionTotal()}</div>
    </div>
  );
}

function Menu() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="menu-wrapper">
      {/* Top Category Buttons */}
      <div className="menu-top-buttons">
        <button onClick={() => scrollTo('bubble-tea')}>🧋 Bubble Tea</button>
        <button onClick={() => scrollTo('coffee')}>☕ Coffee</button>
        <button onClick={() => scrollTo('food')}>🍽️ Food</button>
        <button onClick={() => scrollTo('hookah')}>💨 Hookah</button>
      </div>
      {/* Menu Sections with IDs */}
      <div id="bubble-tea">
        <MenuSection title="🧋 Bubble Tea" items={bubbleTeaItems} />
      </div>
      <div id="coffee">
        <MenuSection title="☕ Coffee" items={coffeeItems} />
      </div>
      <div id="food">
        <MenuSection title="🍽️ Food Items" items={foodItems} />
      </div>
      <div id="hookah">
        <MenuSection title="💨 Hookah" items={hookahItems} />
      </div>
    </div>
  );
}

export default Menu;

import React, { useEffect, useState } from 'react';
import './CoffeeEntryForm.css';

const CoffeeEntryForm = ({ initialData, onSave, onClose }) => {
  const [id, setID] = useState('');
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (initialData) {
      setID(initialData.name + initialData.price);
      setName(initialData.name || '');
      setItems(Array.isArray(initialData.items) ? initialData.items.join(', ') : initialData.items || '');
      setRating(initialData.rating || '');
      setPrice(initialData.price || '');
    } else {
      setID('');
      setName('');
      setItems('');
      setRating('');
      setPrice('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const shop = {
      ...(initialData?.id && { id: initialData.id }), 
      name,
      items: items.split(',').map((item) => item.trim()),
      rating: Number(rating),
      price: Number(price),
    };

    console.log("Submitting shop with ID:", shop.id);
    onSave(shop);
  };

  return (
    <div className="form-container">

      <button className="back-button" onClick={onClose}>Back</button>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Coffee Shop Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Items (separate with commas):</label>
          <input
            type="text"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Rating (1-5):</label>
          <input
            type="float"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>

        <div>
          <label>Total Price ($):</label>
          <input
            type="float"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <button type="submit">{initialData ? 'Save Changes' : 'Add Coffee Shop'}</button>
        
      </form>
    </div>
  );
};

export default CoffeeEntryForm;

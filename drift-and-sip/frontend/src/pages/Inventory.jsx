import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';

function Inventory() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdmin) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    priceHalf: '',
    priceFull: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('inventoryItems');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this item?')) {
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
    }
  };

  const handleAddItem = () => {
    const { name, category, priceHalf, priceFull, image, stock } = newItem;
    if (!name || !category || !priceHalf || !priceFull || !image || stock === '') {
      alert('Please fill all fields');
      return;
    }

    const newItemObj = {
      id: Date.now(),
      name,
      category,
      priceHalf: parseInt(priceHalf),
      priceFull: parseInt(priceFull),
      image,
      stock: parseInt(stock),
    };

    setItems([...items, newItemObj]);
    setNewItem({ name: '', category: '', priceHalf: '', priceFull: '', image: '', stock: '' });
    setIsModalOpen(false);
  };

  const exportToExcel = async () => {
    if (items.length === 0) {
      alert('No inventory data to export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    worksheet.columns = [
      { header: 'S.N.', key: 'sn', width: 6 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Price (Half)', key: 'priceHalf', width: 15 },
      { header: 'Price (Full)', key: 'priceFull', width: 15 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Image URL', key: 'image', width: 40 },
    ];

    items.forEach((item, index) => {
      worksheet.addRow({
        sn: index + 1,
        name: item.name,
        category: item.category,
        priceHalf: item.priceHalf,
        priceFull: item.priceFull,
        stock: item.stock,
        image: item.image,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Inventory_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async () => {
      await workbook.xlsx.load(reader.result);
      const worksheet = workbook.getWorksheet('Inventory') || workbook.worksheets[0];

      const newItems = [];
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return;
        const [sn, name, category, priceHalf, priceFull, stock, image] = row.values.slice(1);
        newItems.push({
          id: Date.now() + rowIndex,
          name, category,
          priceHalf: Number(priceHalf),
          priceFull: Number(priceFull),
          stock: Number(stock),
          image,
        });
      });

      setItems(prev => [...prev, ...newItems]);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="inventory-page">
      <h2>📦 Inventory Management</h2>

      <div className="top-controls">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>➕ Add Item</button>
        <button className="export-button" onClick={exportToExcel}>📥 Export Excel</button>

        {/* Highlighted Excel Upload */}
        <label className="import-label">
          📤 Import Excel
          <input type="file" accept=".xlsx" onChange={handleExcelImport} className="hidden-input" />
        </label>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All</option>
          {[...new Set(items.map(i => i.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Item</h3>
            <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
            <input type="number" placeholder="Price (Half)" value={newItem.priceHalf} onChange={(e) => setNewItem({ ...newItem, priceHalf: e.target.value })} />
            <input type="number" placeholder="Price (Full)" value={newItem.priceFull} onChange={(e) => setNewItem({ ...newItem, priceFull: e.target.value })} />
            <input type="number" placeholder="Stock" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} />

            {/* Highlighted Image Upload */}
            <label className="import-label">
              🖼️ Upload Image
              <input type="file" accept="image/*" className="hidden-input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => setNewItem({ ...newItem, image: reader.result });
                  if (file) reader.readAsDataURL(file);
                }}
              />
            </label>
            {newItem.image && <img src={newItem.image} alt="Preview" className="item-img" />}

            <button className="save-btn" onClick={handleAddItem}>✅ Add</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Item</h3>
            <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
            <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} />
            <input type="number" value={editingItem.priceHalf} onChange={(e) => setEditingItem({ ...editingItem, priceHalf: e.target.value })} />
            <input type="number" value={editingItem.priceFull} onChange={(e) => setEditingItem({ ...editingItem, priceFull: e.target.value })} />
            <input type="number" value={editingItem.stock} onChange={(e) => setEditingItem({ ...editingItem, stock: e.target.value })} />

            <label className="import-label">
              🖼️ Change Image
              <input type="file" accept="image/*" className="hidden-input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => setEditingItem({ ...editingItem, image: reader.result });
                  if (file) reader.readAsDataURL(file);
                }}
              />
            </label>
            {editingItem.image && <img src={editingItem.image} alt="Preview" className="item-img" />}

            <button className="save-btn" onClick={() => {
              const updated = items.map(i => (i.id === editingItem.id ? editingItem : i));
              setItems(updated);
              setEditingItem(null);
            }}>💾 Save</button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="inventory-header">
          <div>Name</div>
          <div>Category</div>
          <div>Price (Half/Full)</div>
          <div>Stock</div>
          <div>Image</div>
          <div>Actions</div>
        </div>

        {items
          .filter(item => {
            const matchName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchName && matchCategory;
          })
          .map((item) => (
            <div key={item.id} className="inventory-row">
              <div>{item.name}</div>
              <div>{item.category}</div>
              <div>₹{item.priceHalf} / ₹{item.priceFull}</div>
              <div>{item.stock}</div>
              <div><img src={item.image} alt={item.name} className="item-img" /></div>
              <div>
                <button className="edit-btn" onClick={() => setEditingItem(item)}>🖊️</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;

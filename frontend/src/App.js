import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [showProducts, setShowProducts] = useState(false);
  
  const [sqlQuery, setSqlQuery] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingProductId, setEditingProductId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsAdminOnly, setEditIsAdminOnly] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const query = `SELECT * FROM user_accounts WHERE username = '${username}' AND password = '${password}';`;
    setSqlQuery(query);

    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      setMessage(response.data.message);
      if (response.data.message === 'Login successful') {
        setIsLoggedIn(true);
        setIsAdmin(response.data.isAdmin);
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Server error");
    }
  };

  const fetchProducts = async () => {
    const query = isAdmin
      ? `SELECT * FROM products;`
      : `SELECT * FROM products WHERE is_admin_only = FALSE;`;
    setSqlQuery(query);

    try {
      const response = await axios.get(`http://localhost:3001/products?isAdmin=${isAdmin}`);
      setProducts(response.data);
      setShowProducts(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async () => {
    const query = isAdmin
      ? `SELECT * FROM products WHERE description LIKE '%${searchQuery}%';`
      : `SELECT * FROM products WHERE description LIKE '%${searchQuery}%' AND is_admin_only = FALSE;`;
    setSqlQuery(query);

    try {
      const response = await axios.get(`http://localhost:3001/products/search`, {
        params: {
          description: searchQuery,
          isAdmin
        }
      });
      setProducts(response.data);
      setShowProducts(true);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditIsAdminOnly(product.is_admin_only);
  };

  const handleSave = async (id) => {
    const query = `UPDATE products SET name = '${editName}', price = ${editPrice}, description = '${editDescription}', is_admin_only = ${editIsAdminOnly} WHERE id = ${id};`;
    setSqlQuery(query);

    try {
      await axios.put(`http://localhost:3001/products/update/${id}`, {
        name: editName,
        price: editPrice,
        description: editDescription,
        is_admin_only: editIsAdminOnly
      }, { params: { isAdmin } });
      setMessage('Product updated successfully');
      fetchProducts(); 
      setEditingProductId(null); 
    } catch (error) {
      console.error("Error updating product:", error);
      setMessage('Error updating product');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    setPassword('');
    setProducts([]);
    setMessage('');
    setShowProducts(false);
    setSqlQuery('');
  };

  return (
    <div className="app">
      <div className="container">
        {!isLoggedIn ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
          </>
        ) : (
          <>
            <h2>Welcome, {username}</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <button onClick={fetchProducts}>Show Products</button>

            {}
            <div>
              <input
                type="text"
                placeholder="Search products by description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {showProducts && (
              <ul className="product-list">
                {products.length > 0 ? (
                  products.map((product) => (
                    <li key={product.id} className="product-card">
                      {editingProductId === product.id ? (
                        <div className="edit-mode">
                          <h3>Edit Product</h3>
                          <label>
                            Name:
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </label>
                          <label>
                            Price:
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                          </label>
                          <label>
                            Description:
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          </label>
                          <label>
                            Admin Only:
                            <input
                              type="checkbox"
                              checked={editIsAdminOnly}
                              onChange={(e) => setEditIsAdminOnly(e.target.checked)}
                            />
                          </label>
                          <button onClick={() => handleSave(product.id)}>Save</button>
                        </div>
                      ) : (
                        <>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <p>Price: ${product.price}</p>
                          <p>Available to Users: {product.is_admin_only ? "No" : "Yes"}</p>
                          {isAdmin && (
                            <button onClick={() => handleEdit(product)}>Edit</button>
                          )}
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <p>No products to display.</p>
                )}
              </ul>
            )}
          </>
        )}

        {}
        {sqlQuery && (
          <div className="sql-query-window">
            <h3>SQL Query Preview:</h3>
            <pre>{sqlQuery}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

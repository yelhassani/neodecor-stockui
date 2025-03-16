import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [storeName, setStoreName] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // ✅ Pagination dynamique
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // 🔹 Récupérer le nom du store
        const storeResponse = await axios.get("http://localhost:8080/api/store", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStoreName(storeResponse.data.name);

        // 🔹 Récupérer les produits avec pagination
        const response = await axios.get(`http://localhost:8080/api/store/products?page=${page}&size=${size}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };

    fetchStoreDetails();
  }, [page, size]);

  // 🔹 Fonction pour supprimer un produit
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== productId)); // Met à jour la liste
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // 🔹 Fonction pour modifier un produit (Affichage console)
  const updateProduct = (productId) => {
    console.log("Update product:", productId);
    // On pourra ajouter une modale pour modifier le produit ici
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="store-name">{storeName}</h1>
        <button className="logout-button" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>Logout</button>
      </header>

      <div className="dashboard-content">
        <h2>Product List</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <div className="action-buttons">
                    <button className="delete-button" onClick={() => deleteProduct(product.id)}>🗑️</button>
                    <button className="update-button" onClick={() => updateProduct(product.id)}>✏️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-wrapper">
        <div className="pagination-controls">
          <label>Show:</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>

          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span> Page {page + 1} of {totalPages} </span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [storeName, setStoreName] = useState(""); // ✅ Stocke le nom du magasin
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
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

        console.log("Store:", storeResponse.data);
        setStoreName(storeResponse.data.name); // ✅ Mise à jour du nom du magasin

        // 🔹 Récupérer les produits du magasin avec pagination
        const response = await axios.get(`http://localhost:8080/api/store/products?page=${page}&size=${size}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Products:", response);
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };

    fetchStoreDetails();
  }, [page, size]); // ✅ Recharge lorsque la page ou la taille change

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="store-name">{storeName || "Loading..."}</h1> {/* ✅ Affiche le nom du store */}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
  
      <div className="dashboard-content">
        <h2>Product List</h2>
  
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{parseFloat(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* ✅ Pagination bien placée en bas */}
      <div className="pagination-wrapper">
        <div className="pagination-controls">
          <label>Show:</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
  
          <button disabled={page === 0} onClick={prevPage}>Previous</button>
          <span> Page {page + 1} of {totalPages} </span>
          <button disabled={page >= totalPages - 1} onClick={nextPage}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [storeName, setStoreName] = useState("");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 Recherche produit
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", initialQuantity: "", quantity: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
  
        const storeResponse = await axios.get("http://localhost:8080/api/store", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStoreName(storeResponse.data.name);
  
        const response = await axios.get(
          `http://localhost:8080/api/store/products?page=${page}&size=${size}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setInitDone(true);
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };
  
    fetchInitialProducts();
  }, [page, size]); // ✅ Appel initial (PAS DE RECHERCHE)
  
  
  useEffect(() => {
    if (!initDone || (search.length < 3 && search.length !== 0)) return; // ✅ Empêche la recherche inutile
  
    const fetchSearchedProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
  
        let url = `http://localhost:8080/api/store/products?page=${page}&size=${size}`;
        if (search.length >= 3) {
          url += `&search=${search}`; // ✅ Ajoute le filtre seulement si 3+ caractères
        }
  
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching searched products:", error);
      }
    };
  
    fetchSearchedProducts();
  }, [search]); // ✅ Recherche déclenchée uniquement quand `search` change  

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);

      if (updatedProducts.length === 0 && page > 0) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/products/${selectedProduct.id}`,
        selectedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(products.map((p) => (p.id === selectedProduct.id ? selectedProduct : p)));

      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    setNewProduct({ name: "", price: "", initialQuantity: "", quantity: "" });
  };

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/products",
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response);
      

      setProducts([...products, response.data]);

      closeCreateModal();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  const openCreateModal = () => {
    setNewProduct({ name: "", price: "", initialQuantity: ""});
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="store-name">{storeName}</h1>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <h2>Product List</h2>

        <div className="top-controls">
          <input
            type="text"
            placeholder="🔍 Search a product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="create-button" onClick={openCreateModal}>
            ➕ Create a product
          </button>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Initial Quantity</th>
              <th>Current Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.initialQuantity}</td>
                <td>{product.quantity}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="update-button"
                      onClick={() => handleEditProduct(product)}
                    >
                      ✏️
                    </button>
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
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>

          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            {" "}
            Page {page + 1} of {totalPages}{" "}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {selectedProduct ? "Save" : "Create"}
            </h2>

            <label>Name :</label>
            <input
              type="text"
              value={selectedProduct ? selectedProduct.name : newProduct.name}
              onChange={(e) => {
                selectedProduct
                  ? setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, name: e.target.value });
              }}
            />

            <label>Price :</label>
            <input
              type="number"
              value={selectedProduct ? selectedProduct.price : newProduct.price}
              onChange={(e) => {
                selectedProduct
                  ? setSelectedProduct({
                      ...selectedProduct,
                      price: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, price: e.target.value });
              }}
            />

            {/* 🔥 Afficher uniquement lors de la création */}
            {!selectedProduct && (
              <>
                <label>Initial Quantity :</label>
                <input
                  type="number"
                  value={newProduct.initialQuantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      initialQuantity: e.target.value,
                    })
                  }
                />
              </>
            )}

            {/* 🔥 Afficher uniquement lors de la modif */}
            {selectedProduct && (
              <>
                <label>Actual Quantity :</label>
                <input
                  type="number"
                  value={
                    selectedProduct
                      ? selectedProduct.quantity
                      : newProduct.quantity
                  }
                  onChange={(e) => {
                    selectedProduct
                      ? setSelectedProduct({
                          ...selectedProduct,
                          quantity: e.target.value,
                        })
                      : setNewProduct({
                          ...newProduct,
                          quantity: e.target.value,
                        });
                  }}
                />
              </>
            )}

            <button
              className="save-button"
              onClick={
                selectedProduct ? handleUpdateProduct : handleCreateProduct
              }
            >
              {selectedProduct ? "Save" : "Create"}
            </button>

            <button
              className="cancel-button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedProduct(null);
                setNewProduct({
                  name: "",
                  price: "",
                  initialQuantity: "",
                  quantity: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

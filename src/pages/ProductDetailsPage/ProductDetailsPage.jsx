import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetailsPage.module.css";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";
import { UserContext } from "../../components/UserContext";
import Header from "../../components/Header/Header";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const { user, isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await fetch(`${API_BASE_URL}/api/Fuji/product/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error("Failed to fetch product details.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBuyClick = async () => {
    if (!isLoggedIn) {
      alert("Please log in to buy the product.");
      return;
    }

    if (user.role !== "User") {
      alert("You don't have the required role to buy the product.");
      return;
    }

    try {
      setTransactionLoading(true);

      const authToken = Cookies.get("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/TransactionHistory/BuyTheProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            _idProduct: id,
            status: "paid",
          }),
        }
      );

      if (response.ok) {
        console.log("Transaction completed successfully");
        await updateProductStatus("Reserved");
      } else {
        console.error("Failed to complete transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const updateProductStatus = async (newStatus) => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/Fuji/product/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (response.ok) {
        console.log("Product status updated successfully");
        // Update the product state to reflect the new status
        setProduct((prevProduct) => ({
          ...prevProduct,
          status: newStatus,
        }));
      } else {
        console.error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.productDetails}>
        <div className={styles.productImage}>
          {product.imageFileName && (
            <img
              src={`${API_BASE_URL}/api/Fuji/getImage/${product.imageFileName}`}
              alt={product.name}
            />
          )}
        </div>
        <div className={styles.productInfo}>
          <h2>{product.name}</h2>
          <p>Цена: {product.price}</p>
          <p>Описание: {product.description}</p>
          <button
            className={styles.buyButton}
            onClick={handleBuyClick}
            disabled={transactionLoading}
          >
            {transactionLoading ? "Buying..." : "Купить"}
          </button>
        </div>
      </div>
    </>
  );
};

ProductDetailsPage.propTypes = {
  id: PropTypes.string,
};

export default ProductDetailsPage;

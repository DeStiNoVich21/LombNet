import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Импортируем useNavigate
import styles from "./ProductDetailsPage.module.css";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/Header/Header";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Используем useNavigate для программного перехода

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const userIdFromToken = decodedToken["UserId"];
        setUserId(userIdFromToken);
      } catch (error) {
        console.error("Ошибка декодирования токена:", error);
      }
    }
  }, []);

  const fetchProductDetails = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/Fuji/product/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
    if (!userId) {
      alert("Пожалуйста, войдите в систему, чтобы купить продукт.");
      return;
    }

    const accessToken = Cookies.get("accessToken");
    const decodedToken = jwtDecode(accessToken);
    const userRole =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    if (userRole !== "User") {
      alert("У вас нет прав на покупку этого продукта.");
      return;
    }

    try {
      setTransactionLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/TransactionHistory/BuyTheProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            _idProduct: id,
            _idUser: userId,
            status: "InQue",
          }),
        }
      );

      if (response.ok) {
        console.log("Transaction completed successfully");
        await fetchProductDetails();
        navigate("/purchase-history"); // Перенаправляем пользователя на страницу истории покупок
      } else {
        console.error("Failed to complete transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTransactionLoading(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
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
            <div>Бренд: {product.brand}</div>
            <div>Цена: {product.price}₸</div>
            <div>Описание: {product.description}</div>
            <button
              className={styles.buyButton}
              onClick={handleBuyClick}
              disabled={transactionLoading}
            >
              {transactionLoading ? "Buying..." : "Купить"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ProductDetailsPage.propTypes = {
  id: PropTypes.string,
};

export default ProductDetailsPage;

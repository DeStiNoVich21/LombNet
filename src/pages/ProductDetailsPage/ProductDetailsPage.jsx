import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetailsPage.module.css";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await fetch(
          `${API_BASE_URL}/api/Fuji/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

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

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Выводим загрузочное сообщение пока продукт загружается
  }

  return (
    <div className={styles.productDetails}>
      <h2>{product.name}</h2>
      <div className={styles.productImage}>
        {product.imageFileName && (
          <img
            src={`${API_BASE_URL}/api/Fuji/getImage/${product.imageFileName}`}
            alt={product.name}
          />
        )}
      </div>
      <div className={styles.productInfo}>
        <p>Category: {product.category}</p>
        <p>Price: {product.price}</p>
        <p>Description: {product.description}</p>
        {/* Другие детали продукта */}
      </div>
    </div>
  );
};

ProductDetailsPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProductDetailsPage;

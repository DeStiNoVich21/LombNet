import { useState, useEffect } from "react";
import AddProduct from "../../components/AddProduct/AddProduct";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import styles from "./Phone.module.css";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import REACT_APP_AUTH_TOKEN from "../../appToken";

const Phone = ({ addedProductName }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [filterParams, setFilterParams] = useState("");
  const [productAdded, setProductAdded] = useState(false); // Добавлен ли товар

  const handleProductAdded = (productName) => {
    // Устанавливаем флаг добавления товара в true
    setProductAdded(true);
  };

  const handleFilterChange = (newFilterParams) => {
    setFilterParams(newFilterParams);
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}:7211/api/Fuji/products`, {
        headers: {
          Authorization: `Bearer ${REACT_APP_AUTH_TOKEN} `,
        },
      });eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } else {
        console.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      if (filterParams.trim() === "") {
        // Если параметры фильтрации отсутствуют, отображаем все продукты
        setFilteredProducts(allProducts);
        return;
      }

      let apiUrl = `${API_BASE_URL}/api/Fuji/products`;

      if (filterParams.includes("keywords")) {
        apiUrl = `${API_BASE_URL}/api/Fuji/search?${filterParams}`;
      } else if (filterParams.includes("brands")) {
        apiUrl = `${API_BASE_URL}/api/Fuji/products/brand/${
          filterParams.split("=")[1]
        }`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFilteredProducts(data);
      } else {
        console.error("Failed to fetch filtered products.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [productAdded]); // Зависимость изменена на productAdded

  useEffect(() => {
    fetchFilteredProducts();
  }, [filterParams, token]);

  useEffect(() => {
    // При добавлении товара сбрасываем флаг обратно в false
    if (productAdded) {
      setProductAdded(false);
    }
  }, [productAdded]);

  return (
    <div className={styles.productPage}>
      <div className={styles.filterSection}>
        <h2>Фильтры:</h2>
        <br />
        <FilterComponent onFilterChange={handleFilterChange} />
      </div>
      <div className={styles.productsSection}>
        <h2>Товары:</h2>
        <div className={styles.product}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <div className={styles.productImage}>
                {product.imageFileName && (
                  <img
                    src={`${API_BASE_URL}/api/Fuji/getImage/${product.imageFileName}`}
                    alt={product.name}
                  />
                )}
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productInfoName}>{product.name}</div>
                <div className={styles.productInfoPrice}>
                  Цена: {product.price}
                </div>
              </div>
            </div>
          ))}
        </div>
        <AddProduct onProductAdded={handleProductAdded} />
        {addedProductName && (
          <div className={styles.addedProductMessage}>
            <p>{`Добавлен товар: ${addedProductName}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

Phone.propTypes = {
  addedProductName: PropTypes.string,
};

export default Phone;

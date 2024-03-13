import { useState, useEffect } from "react";
import AddProduct from "../../components/AddProduct/AddProduct";
import FilterComponent from "../../components/FilterComponent/FilterComponent"; // Импортируем компонент фильтра
import styles from "./Phone.module.css";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import REACT_APP_AUTH_TOKEN from "../../appToken";

const Phone = ({ addedProductName }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Создаем состояние для отфильтрованных товаров
  const [productAdded, setProductAdded] = useState(false); // Добавлен ли товар

  const handleProductAdded = (productName) => {
    // Устанавливаем флаг добавления товара в true
    setProductAdded(true);
  };

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Fuji/products`, {
        headers: {
          Authorization: `Bearer ${REACT_APP_AUTH_TOKEN} `,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data); // При загрузке устанавливаем отфильтрованные товары равными всем товарам
      } else {
        console.error("Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [productAdded]); // Зависимость изменена на productAdded

  useEffect(() => {
    // При добавлении товара сбрасываем флаг обратно в false
    if (productAdded) {
      setProductAdded(false);
    }
  }, [productAdded]);

  const handleFilterChange = (filterParams) => {
    // Функция для обработки изменений в фильтрах
    if (filterParams.trim() === "") {
      // Если параметры фильтрации отсутствуют, отображаем все продукты
      setFilteredProducts(allProducts);
      return;
    }

    // Выполнить фильтрацию на основе параметров
    const filtered = allProducts.filter((product) => {
      const params = new URLSearchParams(filterParams);

      if (params.has("brand")) {
        if (product.brand !== params.get("brand")) {
          return false;
        }
      }

      if (params.has("minPrice") && params.has("maxPrice")) {
        const minPrice = parseInt(params.get("minPrice"));
        const maxPrice = parseInt(params.get("maxPrice"));
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }
      }

      return true;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.filterSection}>
        <h2>Фильтры:</h2>
        <br />
        <FilterComponent onFilterChange={handleFilterChange} />{" "}
        {/* Передаем функцию обработки фильтра в компонент */}
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

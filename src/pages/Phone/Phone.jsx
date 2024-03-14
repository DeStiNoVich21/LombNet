import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import styles from "./Phone.module.css";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";

const Phone = ({ addedProductName }) => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await fetch(`${API_BASE_URL}/api/Fuji/products`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
          setFilteredProducts(data);
          const uniqueBrands = [
            ...new Set(data.map((product) => product.brand)),
          ];
          setBrands(uniqueBrands.filter(Boolean)); // Отфильтруем пустые значения
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filterParams) => {
    if (filterParams.trim() === "") {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter((product) => {
      const params = new URLSearchParams(filterParams);

      if (params.has("brands")) {
        if (!params.get("brands").split(",").includes(product.brand)) {
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

  const handleProductClick = (productId) => {
    navigate(`/phone/${productId}`); // Перенаправляем на страницу с деталями продукта с передачей идентификатора продукта через URL
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.filterSection}>
        <h2>Смартфоны: </h2>
        <br />
        <FilterComponent onFilterChange={handleFilterChange} brands={brands} />
      </div>
      <div className={styles.productsSection}>
        <div className={styles.product}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={styles.productItem}
              onClick={() => handleProductClick(product.id)}
            >
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
      </div>
    </div>
  );
};

Phone.propTypes = {
  addedProductName: PropTypes.string,
};

export default Phone;

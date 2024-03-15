import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.css";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";
import FilterComponent from "../../components/FilterComponent/FilterComponent";

const Product = () => {
  const { category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const authToken = Cookies.get("authToken");
        let url = `${API_BASE_URL}/api/Fuji/products/category/${category}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Фильтрация продуктов по isDeleted: false
          const filteredProducts = data.filter((item) => !item.isDeleted);

          setProduct(filteredProducts);

          // Получение списка уникальных брендов из полученных продуктов
          const uniqueBrands = [
            ...new Set(filteredProducts.map((item) => item.brand)),
          ];
          setBrands(uniqueBrands);
        } else {
          console.error("Failed to fetch product details:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category !== undefined) {
      fetchProductDetails();
    }
  }, [category]);

  const handleFilterChange = (filterParams) => {
    setFilters(filterParams);
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.filterSection}>
        <FilterComponent onFilterChange={handleFilterChange} brands={brands} />
      </div>
      <div className={styles.productDetails}>
        {product &&
          product.map((item, index) => (
            <div key={index} className={styles.productItem}>
              <div className={styles.productImage}>
                {item.imageFileName && (
                  <img
                    src={`${API_BASE_URL}/api/Fuji/getImage/${item.imageFileName}`}
                    alt={item.name}
                  />
                )}
              </div>
              <div className={styles.productText}>
                <h2>{item.name}</h2>
                <p className={styles.productPrice}>Цена: {item.price}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Product;

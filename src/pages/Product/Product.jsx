import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.css";
import Cookies from "js-cookie";
import API_BASE_URL from "../../apiConfig";
import FilterComponent from "../../components/FilterComponent/FilterComponent";

const Product = () => {
  const { category } = useParams(); // Получаем параметр category из URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await fetch(
          `${API_BASE_URL}/api/Fuji/products/category/${category}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Received product data:", data);
          setProduct(data);
        } else {
          console.error("Failed to fetch product details:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Проверяем, что category не undefined перед тем как выполнять запрос
    if (category !== undefined) {
      console.log("Category:", category); // Добавлен console.log для категории
      fetchProductDetails();
    }
  }, [category]);

  console.log("Loading:", loading); // Добавлен console.log для загрузки
  console.log("Product:", product);

  // Отображаем информацию о продукте
  return (
    <div className={styles.productPage}>
      <div className={styles.filterSection}>
        <FilterComponent onFilterChange={() => {}} brands={[]} />
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

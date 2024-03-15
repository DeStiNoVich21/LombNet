import { useState, useEffect } from "react";
import styles from "../Catalog/Catalog.module.css";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../apiConfig";

export default function Catalog() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Fuji/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.catalogContainer}>
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className={styles.catalog}>
          {categories.map((category) => (
            <Link to={`/${category.category}`} key={category.category}>
              <li className={styles.item}>
                <img
                  src={`${API_BASE_URL}/api/Fuji/getImage/${category.imageFileName}`}
                  alt={category.name}
                  className={styles.image}
                />
                {category.name}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

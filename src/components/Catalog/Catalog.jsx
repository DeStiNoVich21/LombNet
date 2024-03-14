import { useState, useEffect } from "react";
import styles from "../Catalog/Catalog.module.css";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7211/api/Fuji/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <ul className={styles.catalog}>
      {categories.map((category) => (
        <Link to={`/${category.category}`} key={category.category}>
          <li className={styles.item}>
            <img
              src={`https://localhost:7211/api/Fuji/getImage/${category.imageFileName}`}
              alt={category.name}
              className={styles.image}
            />
            {category.name}
          </li>
        </Link>
      ))}
    </ul>
  );
}

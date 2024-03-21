import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import API_BASE_URL from "../../apiConfig";
import Cookies from "js-cookie";
import styles from "./AddProduct.module.css";

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    status: "In_stock",
    brand: "",
  });

  const [categories, setCategories] = useState([]); // State to hold categories
  const [image, setImage] = useState(null);
  const [categoryError, setCategoryError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [token] = useState(Cookies.get("accessToken"));

  useEffect(() => {
    // Fetch categories on component mount
    async function fetchCategories() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Fuji/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      setCategoryError(true);
      return;
    }

    if (!image) {
      setImageError(true);
      return;
    }

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      formDataToSend.append("image", image);

      const response = await axios.post(
        `${API_BASE_URL}/api/Fuji/addProduct`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Product added successfully!");
        onProductAdded(formData.name);
        setFormData({
          name: "",
          category: "",
          description: "",
          price: 0,
          status: "In_stock",
          brand: "",
        });
        setImage(null);
      } else if (response.status === 401) {
        console.error("Unauthorized. Check if the token is valid.");
      } else {
        const errorText = await response.text();
        console.error(`Failed to add product. Server response: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Добавление товара</h2>
      <label className={styles.label}>
        Название:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Категория:
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`${styles.input} ${
            categoryError ? styles.selectError : ""
          }`}
        >
          <option value="" disabled>
            Выберите категорию
          </option>
          {categories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.name}
            </option>
          ))}
        </select>
        {categoryError && (
          <p className={styles.error}>Пожалуйста, выберите категорию.</p>
        )}
      </label>
      <label className={styles.label}>
        Бренд:
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Описание:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Цена:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={styles.input}
        />
      </label>
      <label className={styles.label}>
        Картинка:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.input}
          required
        />
        {imageError && (
          <p className={styles.error}>Пожалуйста, выберите изображение.</p>
        )}
      </label>
      <button type="submit" className={styles.button}>
        Добавить товар
      </button>
    </form>
  );
};

AddProduct.propTypes = {
  onProductAdded: PropTypes.func.isRequired,
};

export default AddProduct;

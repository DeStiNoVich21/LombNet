import { useState } from "react";
import AddCategoryForm from "../../components/AddCategoryForm/AddCategoryForm";
import AddProduct from "../../components/AddProduct/AddProduct";
import AddLombardForm from "../../components/AddLombard/AddLombard";
import styles from "../Admin/Admin.module.css";
import Header from "../../components/Header/Header";

export default function Admin() {
  const handleCategoryAdded = () => {
    console.log("Категория успешно добавлена.");
    // Логика для обновления информации после добавления категории
  };

  const handleProductAdded = (productName) => {
    console.log(`Товар "${productName}" успешно добавлен.`);
    // Логика для обновления информации после добавления товара
  };

  const handleLombardAdded = () => {
    console.log("Ломбард успешно добавлен.");
    // Логика для обновления информации после добавления ломбарда
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.heading}>Администрирование</h1>
        <div className={styles.addForm}>
          <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
          <AddProduct onProductAdded={handleProductAdded} />
          <AddLombardForm onLombardAdded={handleLombardAdded} />
        </div>
      </div>
    </>
  );
}

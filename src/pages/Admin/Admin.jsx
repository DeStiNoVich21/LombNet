import { useState } from "react";
import AddCategoryForm from "../../components/AddCategoryForm/AddCategoryForm";
import AddProduct from "../../components/AddProduct/AddProduct";
import AddLombardForm from "../../components/AddLombard/AddLombard";

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
    <div>
      <h1>Администрирование</h1>
      <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
      <AddProduct onProductAdded={handleProductAdded} />
      <AddLombardForm onLombardAdded={handleLombardAdded} />
    </div>
  );
}

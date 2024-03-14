import AddCategoryForm from "../../components/AddCategoryForm/AddCategoryForm";
import AddProduct from "../../components/AddProduct/AddProduct";

export default function Admin() {
  const handleProductAdded = (productName) => {
    console.log(`Товар "${productName}" успешно добавлен.`);
  };

  return (
    <div>
      <h1>Администрирование</h1>
      <AddCategoryForm />
      <AddProduct onProductAdded={handleProductAdded} />
    </div>
  );
}

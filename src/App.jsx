import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import Product from "./pages/Product/Product";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import { UserProvider } from "./components/UserContext";
import { useState, useEffect } from "react";

export default function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7211/api/Fuji/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:category" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />{" "}
          {/* Добавляем маршрут для ProductDetailsPage */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Phone from "./pages/Phone/Phone";
import Admin from "./pages/Admin/Admin";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import { UserProvider } from "./components/UserContext";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/phone" element={<Phone />} />
          <Route path="/phone/:id" element={<ProductDetailsPage />} />
          {/* Передаем параметр :id */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

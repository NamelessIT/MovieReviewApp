import { BrowserRouter } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoute.jsx';
import UserRoutes from './routes/UserRoute.jsx';
import AuthPage from './page/Login/authPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/admin/StyleAdmin.css';
import './styles/user/StyleUser.css';
import './styles/admin/ModalAdmin.css';
// Component để kiểm tra quyền và chọn Route
const RoleBasedRoutes = () => {
  const role = localStorage.getItem("role");
  if (role === "Admin" || role === "Moderator") {
    return <AdminRoutes />;
  }
  return <UserRoutes />;
};

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* 1. Tự động điều hướng từ / sang /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* 2. Định nghĩa các route đăng nhập/đăng ký */}
        <Route path="/login" element={<AuthPage />} />
        {/* 3. Sử dụng component RoleBasedRoutes cho tất cả các đường dẫn khác */}
        {/* AdminRoutes và UserRoutes sẽ xử lý các route lồng nhau (vd: /dashboard, /profile) */}
        <Route path="/*" element={<RoleBasedRoutes />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

import {Routes, Route, Navigate} from "react-router-dom";
import Homepage from '../page/admin/Homepage.jsx';
import FilmManagement from '../page/admin/FilmManagement.jsx';
import UserManagement from '../page/admin/UserManagement.jsx';
import ReviewManagement from '../page/admin/ReviewManagement.jsx';
const AdminRoutes = () => {
  return (
    
      <Routes>
        <Route index element={<Navigate to ="/admin/homepage" replace />} />
        <Route path="/admin/homepage" element={<HomepageAdmin />} />
        <Route path="/admin/films" element={<FilmManagement/>} />
        <Route path="/admin/users" element={<UserManagement/>} />
        <Route path="/admin/reviews" element={<ReviewManagement/>} />
      </Routes>
  );
}; export default AdminRoutes;
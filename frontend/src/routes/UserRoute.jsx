import {Routes, Route, Navigate} from "react-router-dom";
import Homepage from '../page/user/Homepage.jsx';
import HomepageAdmin from '../page/admin/Homepage.jsx';
import FilmAdmin from "../page/admin/Film.jsx";
import AccountAdmin from "../page/admin/Account.jsx";
import UserAdmin from "../page/admin/User.jsx";
import ReviewAdmin from "../page/admin/Review.jsx";
import FilmManagement from '../page/admin/FilmManagement.jsx';
import UserManagement from '../page/admin/UserManagement.jsx';
import ReviewManagement from '../page/admin/ReviewManagement.jsx';
const UserRoutes = () => {
  return (
    
      <Routes>
        <Route index element={<Navigate to ="/user/homepage" replace />} />
        <Route path="/user/homepage" element={<Homepage />} />
        {/* admin */}
        <Route path="/admin/homepage" element={<HomepageAdmin />} />
        <Route path="/admin/films" element={<FilmAdmin />} />
        <Route path="/admin/accounts" element={<AccountAdmin />} />
        <Route path="/admin/users" element={<UserAdmin />} />
        <Route path="/admin/Reviews" element={<ReviewAdmin />} />
        <Route path="/admin/films" element={<FilmManagement/>} />
        <Route path="/admin/users" element={<UserManagement/>} />
        <Route path="/admin/reviews" element={<ReviewManagement/>} />
      </Routes>
  );
}; export default UserRoutes;
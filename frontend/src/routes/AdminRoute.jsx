import {Routes, Route, Navigate} from "react-router-dom";
import HomepageAdmin from '../page/admin/Homepage.jsx';
import FilmAdmin from "../page/admin/Film.jsx";
import AccountAdmin from "../page/admin/Account.jsx";
import UserAdmin from "../page/admin/User.jsx";
import ReviewAdmin from "../page/admin/Review.jsx";
import FilmModal from "../components/modal/admin/FilmModal.jsx";
import AccountModal from "../components/modal/admin/AccountModal.jsx";
import UserModal from "../components/modal/admin/UserModal.jsx";
const AdminRoutes = () => {
  return (
    
      <Routes>
        {/* admin */}
        <Route path="/admin/homepage" element={<HomepageAdmin />} />
        <Route path="/admin/films" element={<FilmAdmin />} />
        <Route path="/admin/accounts" element={<AccountAdmin />} />
        <Route path="/admin/users" element={<UserAdmin />} />
        <Route path="/admin/Reviews" element={<ReviewAdmin />} />
        <Route path="/admin/films/add" element={<FilmModal onMode="add" />} />
        <Route path="/admin/films/edit/:filmId" element={<FilmModal onMode="edit" />} />
        <Route path="/admin/accounts/add" element={<AccountModal onMode="add" />} />
        <Route path="/admin/accounts/edit/:accountId" element={<AccountModal onMode="edit" />} />
        <Route path="/admin/users/add" element={<UserModal onMode="add" />} />
        <Route path="/admin/users/edit/:userId" element={<UserModal onMode="edit" />} />
      </Routes>
  );
}; export default AdminRoutes;
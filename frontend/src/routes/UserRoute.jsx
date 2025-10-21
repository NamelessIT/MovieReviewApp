import {Routes, Route, Navigate} from "react-router-dom";
import Homepage from '../page/user/Homepage.jsx';
import MovieListPage from '../page/user/MovieListPage.jsx';
import MovieDetailPage from '../page/user/MovieDetailPage.jsx';
import HomepageAdmin from '../page/admin/Homepage.jsx';
import FilmAdmin from "../page/admin/Film.jsx";
import AccountAdmin from "../page/admin/Account.jsx";
import UserAdmin from "../page/admin/User.jsx";
import ReviewAdmin from "../page/admin/Review.jsx";
import FilmModal from "../components/modal/admin/FilmModal.jsx";
const UserRoutes = () => {
  return (
    
      <Routes>
        <Route index element={<Navigate to ="/user/homepage" replace />} />
        <Route path="/user/homepage" element={<Homepage />} />
        <Route path="/user/movies" element={<MovieListPage />} />
        <Route path="/user/movie/:id" element={<MovieDetailPage />} />
        {/* admin */}
        <Route path="/admin/homepage" element={<HomepageAdmin />} />
        <Route path="/admin/films" element={<FilmAdmin />} />
        <Route path="/admin/accounts" element={<AccountAdmin />} />
        <Route path="/admin/users" element={<UserAdmin />} />
        <Route path="/admin/Reviews" element={<ReviewAdmin />} />
        <Route path="/admin/films/add" element={<FilmModal onMode="add" />} />
        <Route path="/admin/films/edit/:filmId" element={<FilmModal onMode="edit" />} />
      </Routes>
  );
}; export default UserRoutes;
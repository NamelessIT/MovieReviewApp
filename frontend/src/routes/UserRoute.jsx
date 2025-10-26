import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../page/user/Homepage.jsx";
import MovieListPage from "../page/user/MovieListPage.jsx";
import MovieDetailPage from "../page/user/MovieDetailPage.jsx";
import AuthPage from "../page/Login/authPage.jsx";
const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/user/homepage" element={<Homepage />} />
      <Route path="/user/movies" element={<MovieListPage />} />
      <Route path="/user/movie/:id" element={<MovieDetailPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};
export default UserRoutes;

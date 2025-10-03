import {Routes, Route, Navigate} from "react-router-dom";
import Homepage from '../page/user/Homepage.jsx';
import HomepageAdmin from '../page/admin/Homepage.jsx';
const UserRoutes = () => {
  return (
    
      <Routes>
        <Route index element={<Navigate to ="/user/homepage" replace />} />
        <Route path="/user/homepage" element={<Homepage />} />
        {/* admin */}
        <Route path="/admin/homepage" element={<HomepageAdmin />} />
      </Routes>
  );
}; export default UserRoutes;
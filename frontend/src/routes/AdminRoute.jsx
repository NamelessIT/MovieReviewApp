import {Routes, Route, Navigate} from "react-router-dom";
import Homepage from '../page/admin/Homepage.jsx';
const AdminRoutes = () => {
  return (
    
      <Routes>
        <Route index element={<Navigate to ="/admin/homepage" replace />} />
        <Route path="/admin/homepage" element={<Homepage />} />
      </Routes>
  );
}; export default AdminRoutes;
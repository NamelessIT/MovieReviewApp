import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from './routes/AdminRoute.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/admin/StyleAdmin.css';
function App() {
  return (
    <>
      <BrowserRouter>
      <AdminRoutes />  
    </BrowserRouter>
    </>
  )
}

export default App

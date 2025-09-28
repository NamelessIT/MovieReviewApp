import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from './routes/AdminRoute.jsx'
import UserRoutes from './routes/UserRoute.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/admin/StyleAdmin.css';
import './styles/user/StyleUser.css';
function App() {
  return (
    <>
      <BrowserRouter>
      <UserRoutes />  
    </BrowserRouter>
    </>
  )
}

export default App

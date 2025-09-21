import { useState } from "react";
import { NavLink} from "react-router-dom";

const menuItems = [
  {
    id: 1,
    title: "Trang chủ",
    icon: "bi-speedometer2",
    href: "/admin/homepage",
  },
  {
    id: 2,
    title: "Phim",
    icon: "bi bi-film",
    href: "/admin/films",
  },
  { 
    id: 3,
    title: "Người dùng",
    icon: "bi bi-people-fill",
    href: "/admin/users",
  },
  {
    id: 4,
    title: "Tài khoản",
    icon: "bi-person-gear",
    href: "/admin/accounts",
  },
  {
    id: 5,
    title: "Đánh giá phim",
    icon: "bi bi-chat-square-text-fill",
    href: "/admin/reviews",
  },
]


const Sidebar = () => {
 
  const [collapsed, setCollapsed] = useState(false)
  

  return (
    <div className={`sidebar d-flex flex-column flex-grow-1 flex-shrink-1 ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        {!collapsed && <h5 className=" text-light ">Admin Panel</h5>}
          <button className="btn btn-md ms-2 btn-outline-info border border-0" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
          </button>
      </div>
      <div className="border-top border-light border-1"></div>
       {/* Navigation */}
      <nav className="d-flex nav-custom flex-grow-1 flex-column mt-3" >
        {menuItems.map((item) => (
          <div key={item.id} className="d-flex align-items-center border boder-light border-0 mb-1 w-100" >
            <NavLink to = {item.href} 
              className={`w-100 d-flex align-items-center p-1 text-decoration-none rounded"
               ${collapsed ? "justify-content-center" : ""}`}
            >
              <i  className={`${item.icon} fs-5 ${collapsed ? "" : "ms-2"}`}></i>
              {!collapsed && <span className="ms-3 d-none d-md-block">{item.title}</span>}
            </NavLink>
          </div>
        ))}
      </nav>
      {/* Footer */}
      <div className="p-3 border-top">
        <div className={`d-flex align-items-center ${collapsed ? "justify-content-center" : ""}`}>
          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            <span className="text-white fw-medium">A</span>
          </div>
          {!collapsed && (
            <div className="ms-3 text-white">
              <p className="mb-0 fw-medium">Admin</p>
              <small className="text-mute">admin@example.com</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
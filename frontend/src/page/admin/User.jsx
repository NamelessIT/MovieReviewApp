import { useState, useEffect } from "react";
import UsersService from "../../service/admin/UserService";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";
import Pagination from "../../components/pagination/Pagination";
import { NavLink } from "react-router-dom";
import { confirmDelete } from "../../components/common/Alert";

const Users = () => {
  // phân trang
  const rowsPerPage = 6;
  const [filteredUsers, setFilteredUsers] = useState([]); // dữ liệu (giống Film: set = response.data)
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // trang bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setUsersLoading(true);
      const response = await UsersService.getAllUsersWithPagination(
        currentPage,
        rowsPerPage,
        searchTerm
      );
      setFilteredUsers(response.data || []);
      setUsersError(null);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsersError(error?.message || "Unknown error");
    } finally {
      setUsersLoading(false);
    }
  };

  const handlePageChange = (event) => {
    // react-paginate trả index (bắt đầu 0), mình +1 để khớp currentPage
    setCurrentPage(event.selected + 1);
  };

  const onDelete = async (userId) => {
    try {
      await UsersService.delete(userId);
      loadData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  return (
    <LayoutWrapper>
      <div className="container">
        {/* Filter/Search card */}
        <div className="card border-0 shadow-sm mb-4">
          <h1 className="fw-bold m-2">Quản lý người dùng</h1>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative" style={{ width: "300px" }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control ps-5"
                  placeholder="Tìm kiếm theo tên người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <NavLink to="/admin/users/add" className="btn btn-md btn-dark">
                  <i className="bi bi-plus me-2"></i>
                  Thêm người dùng
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* List card (table) */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Users List</h5>

            {usersLoading && (
              <div className="text-muted small">Loading users…</div>
            )}
            {usersError && (
              <div className="text-danger small">Error: {usersError}</div>
            )}

            {!usersLoading && !usersError && (
              <>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="text-muted">
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                        <th scope="col" className="text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filteredUsers?.data || []).map((u) => (
                        <tr key={u.id}>
                          <td className="text-break">{u.id}</td>
                          <td>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>
                            <span
                              className={
                                "badge rounded-pill " +
                                (u.isDeleted.toString() === "false"
                                  ? "text-bg-success"
                                  : "text-bg-danger")
                              }
                            >
                              {(u.isDeleted.toString() === "false"
                                  ? "Hoạt động"
                                  : "Ngừng hoạt động")}
                            </span>
                          </td>
                          <td>{u.createdAt?.substring?.(0, 10)}</td>
                          <td>{u.updatedAt?.substring?.(0, 10)}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-evenly">
                              <NavLink
                                to={`/admin/users/edit/${u.id}`}
                                className="btn btn-primary"
                              >
                                <i className="bi bi-pencil"></i>
                              </NavLink>
                              <div className="ps-2 border-secondary border-start ">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    confirmDelete("Tài khoản", u.id, () =>
                                      onDelete(u.id)
                                    )
                                  }
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Users;

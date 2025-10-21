import { useState, useEffect } from "react";
import AccountService from "../../service/admin/AccountService";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";
import Pagination from "../../components/pagination/Pagination";
import { confirmDelete } from "../../components/common/Alert";
import { NavLink } from "react-router-dom";
const Account = () => {
  //phân trang
  const rowsPerPage = 6; // Mặc định 5 hàng mỗi trang
  const [filteredAccounts, setFilteredAccounts] = useState([]); // Danh sách tài khoản
  const [accountsLoading, setAccountsLoading] = useState(false); // Trạng thái tải tài khoản
  const [accountsError, setAccountsError] = useState(null); // Lỗi khi tải tài khoản
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại, bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [searchTerm, setSearchTerm] = useState(""); // tìm kiếm
  //lấy danh sách tài khoản và phân trang
  const loadData = async () => {
    try {
      setAccountsLoading(true);
      const response = await AccountService.getAllAccountsWithPagination(currentPage,rowsPerPage,searchTerm);
      setFilteredAccounts(response.data || []);
      setAccountsError(null);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccountsError(error.message);
    }finally
    {
      setAccountsLoading(false);
    }
  };

  const handlePageChange = (event) => {
    // `event.selected` là index của trang (bắt đầu từ 0) do react-paginate cung cấp.
    // Chúng ta cần +1 để nó khớp với state `currentPage` (bắt đầu từ 1).
    setCurrentPage(event.selected + 1);
  };
  //Xóa film
  const onDelete = async (accountId) => {
    try {
      await AccountService.delete(accountId);
      loadData();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm]);
  return (
    <LayoutWrapper>
      <div className="container">
        {/* Filter/Search card */}
        <div className="card border-0 shadow-sm mb-4">
          <h1 className="fw-bold m-2">Quản lý danh tài khoản</h1>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative" style={{ width: "300px" }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control ps-5"
                  placeholder="Tìm kiếm theo tên tài khoản..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div>
                <NavLink to="/admin/accounts/add" className="btn btn-md btn-dark">
                  <i className="bi bi-plus me-2"></i>
                  Thêm tài khoản mới
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* List card (table) */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Accounts List</h5>
            {accountsLoading && (
              <div className="text-muted small">Loading accounts…</div>
            )}
            {accountsError && (
              <div className="text-danger small">Error: {accountsError}</div>
            )}
            {!accountsLoading && !accountsError && (
              <>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="text-muted">
                        <th scope="col">ID</th>
                        <th scope="col">UserID</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Role</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col" className="text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filteredAccounts?.data || []).map((account) => (
                        <tr key={account.id}>
                          <td className="text-break">{account.id}</td>
                          <td>{account.userId}</td>
                          <td>{account.userName}</td>
                          <td>{account.role}</td>
                          <td>
                            <span
                              className={
                                "badge rounded-pill " +
                                (account.isDeleted.toString() === "false"
                                  ? "text-bg-success"
                                  : "text-bg-danger")
                              }
                            >
                              {(account.isDeleted.toString() === "false"
                                  ? "Hoạt động"
                                  : "Ngừng hoạt động")}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-evenly">
                              <NavLink to={`/admin/accounts/edit/${account.id}`} className="btn btn-primary">
                                <i className="bi bi-pencil"></i>
                              </NavLink>

                              <div className="ps-2 border-secondary border-start ">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    confirmDelete("Tài khoản", account.id, () =>
                                      onDelete(account.id)
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

                {/* {filterFilms?.data.length === 0 && (
                  <div className="text-muted small">No films found.</div>
                )} */}
                {/* Pagination */}
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

export default Account;

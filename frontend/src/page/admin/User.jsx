import { useEffect, useMemo, useState } from "react";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/user/admin/count", { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
        const data = await res.json();

        const mapped = (Array.isArray(data) ? data : []).map((u) => ({
          id: u.Id,
          username: u.FullName,
          email: u.Email,
          status: u.isDeleted ? "Inactive" : "Active",
          createdAt: u.CreatedAt,
          updatedAt: u.UpdatedAt,
        }));

        setUsers(mapped);
        setCurrentPage(1);
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => ac.abort();
  }, []);

  // Filter + paginate
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.id?.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" ||
        user.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  return (
    <LayoutWrapper>
      <div className="container">
        <h1 className="display-6 fw-bold mb-4">Users</h1>

        {/* Filter/Search card */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6">
                <label className="form-label">Search</label>
                <div className="position-relative">
                  <i
                    className="bi bi-search position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: 10 }}
                  />
                  <input
                    className="form-control ps-4"
                    placeholder="Tìm kiếm theo tên, email, ID…"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Rows per page</label>
                <select
                  className="form-select"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* List card (table) */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Users List</h5>

            {loading && <div className="text-muted small">Loading users…</div>}
            {error && <div className="text-danger small">Error: {error}</div>}

            {!loading && !error && (
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
                      </tr>
                    </thead>
                    <tbody>
                      {pageUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="text-break">{u.id}</td>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td>
                            <span
                              className={
                                "badge rounded-pill " +
                                (u.status === "Active"
                                  ? "text-bg-success"
                                  : "text-bg-secondary")
                              }
                            >
                              {u.status}
                            </span>
                          </td>
                          <td>{u.createdAt}</td>
                          <td>{u.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pageUsers.length === 0 && (
                  <div className="text-muted small">No users found.</div>
                )}

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted small">
                    {filteredUsers.length === 0
                      ? "0-0 of 0"
                      : `${startIndex + 1}-${Math.min(
                          startIndex + rowsPerPage,
                          filteredUsers.length
                        )} of ${filteredUsers.length}`}
                  </span>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Users;

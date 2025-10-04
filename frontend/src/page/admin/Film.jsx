import { useEffect, useMemo, useState } from "react";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";

const Films = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Fetch all films
        const res = await fetch("/api/film/admin/all", { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to fetch films: ${res.status}`);
        const data = await res.json();

        // 2) Fetch directors (cache theo DirectorId)
        const directorCache = new Map();

        const getDirectorName = async (id) => {
          if (!id) return "";
          if (directorCache.has(id)) return directorCache.get(id);
          const dRes = await fetch(`/api/director/${encodeURIComponent(id)}`, { signal: ac.signal });
          if (!dRes.ok) {
            directorCache.set(id, "");
            return "";
          }
          const d = await dRes.json();
          const name = d?.Name ?? "";
          directorCache.set(id, name);
          return name;
        };

        // 3) Map sang UI rows + resolve director song song
        const rows = await Promise.all(
          (Array.isArray(data) ? data : []).map(async (f) => {
            const directorName = await getDirectorName(f.DirectorId);
            return {
              id: f.Id,
              title: f.Title,
              director: directorName,
              releaseDate: f.ReleaseDate,
              status: f.isDeleted ? "Inactive" : "Active",
              createdAt: f.CreatedAt,
              updatedAt: f.UpdatedAt,
            };
          })
        );

        setFilms(rows);
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

  // ===== Filter + paginate (giống tinh thần Homepage: logic rõ ràng, UI bootstrap) =====
  const filteredFilms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return films.filter((film) => {
      const matchesSearch =
        !term ||
        film.title?.toLowerCase().includes(term) ||
        film.director?.toLowerCase().includes(term) ||
        film.id?.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || film.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [films, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFilms.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageFilms = filteredFilms.slice(startIndex, startIndex + rowsPerPage);

  return (
    <LayoutWrapper>
      <div className="container">
        <h1 className="display-6 fw-bold mb-4">Films</h1>

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
                    placeholder="Tìm kiếm theo tên phim, đạo diễn, ID…"
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
            <h5 className="card-title fw-bold mb-3">Films List</h5>

            {loading && <div className="text-muted small">Loading films…</div>}
            {error && <div className="text-danger small">Error: {error}</div>}

            {!loading && !error && (
              <>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="text-muted">
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Director</th>
                        <th scope="col">Release Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageFilms.map((film) => (
                        <tr key={film.id}>
                          <td className="text-break">{film.id}</td>
                          <td>{film.title}</td>
                          <td>{film.director}</td>
                          <td>{film.releaseDate}</td>
                          <td>
                            <span
                              className={
                                "badge rounded-pill " +
                                (film.status === "Active"
                                  ? "text-bg-success"
                                  : "text-bg-secondary")
                              }
                            >
                              {film.status}
                            </span>
                          </td>
                          <td>{film.createdAt}</td>
                          <td>{film.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pageFilms.length === 0 && (
                  <div className="text-muted small">No films found.</div>
                )}

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted small">
                    {filteredFilms.length === 0
                      ? "0-0 of 0"
                      : `${startIndex + 1}-${Math.min(
                          startIndex + rowsPerPage,
                          filteredFilms.length
                        )} of ${filteredFilms.length}`}
                  </span>
                  <div className="btn-group">
                    <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}  // ← bớt 1 ')'
                    disabled={currentPage === 1}
                    >
                    Prev
                    </button>
                    <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}  // ← bớt 1 ')'
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

export default Films;

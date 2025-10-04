import { useEffect, useMemo, useState } from "react";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy id từ query string (?id=...)
  const [targetId, setTargetId] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("id");
      setTargetId(id);
    }
  }, []);

  useEffect(() => {
    if (!targetId) return;
    const ac = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Reviews
        const res = await fetch(`/api/Review/${encodeURIComponent(targetId)}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
        const data = await res.json();

        // 2) Caches để tránh gọi trùng
        const accountCache = new Map(); // AccountId -> UserID
        const userCache = new Map();    // UserID -> FullName
        const filmCache = new Map();    // MovieId -> Title

        const getAccountUserId = async (accountId) => {
          if (!accountId) return "";
          if (accountCache.has(accountId)) return accountCache.get(accountId);
          const r = await fetch(`/api/account/${encodeURIComponent(accountId)}`, { signal: ac.signal });
          if (!r.ok) { accountCache.set(accountId, ""); return ""; }
          const acc = await r.json();
          const uid = acc?.UserID ?? "";
          accountCache.set(accountId, uid);
          return uid;
        };

        const getUserFullName = async (userId) => {
          if (!userId) return "";
          if (userCache.has(userId)) return userCache.get(userId);
          const r = await fetch(`/api/user/${encodeURIComponent(userId)}`, { signal: ac.signal });
          if (!r.ok) { userCache.set(userId, ""); return ""; }
          const u = await r.json();
          const name = u?.FullName ?? "";
          userCache.set(userId, name);
          return name;
        };

        const getFilmTitle = async (filmId) => {
          if (!filmId) return "";
          if (filmCache.has(filmId)) return filmCache.get(filmId);
          const r = await fetch(`/api/film/${encodeURIComponent(filmId)}`, { signal: ac.signal });
          if (!r.ok) { filmCache.set(filmId, ""); return ""; }
          const f = await r.json();
          const title = f?.Title ?? "";
          filmCache.set(filmId, title);
          return title;
        };

        // 3) Resolve song song
        const rows = await Promise.all(
          (Array.isArray(data) ? data : []).map(async (rv) => {
            const userId = await getAccountUserId(rv.AccountId);
            const fullName = await getUserFullName(userId);
            const filmTitle = await getFilmTitle(rv.MovieId);
            return {
              id: rv.Id,
              film: filmTitle,
              reviewer: fullName,
              rating: rv.Rating,
              content: rv.Comment,
              createdAt: rv.CreatedAt,
              updatedAt: rv.UpdatedAt,
            };
          })
        );

        setReviews(rows);
        setCurrentPage(1);
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => ac.abort();
  }, [targetId]);

  // ---- Filter + paginate
  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchesSearch =
        !term ||
        review.film?.toLowerCase().includes(term) ||
        review.reviewer?.toLowerCase().includes(term) ||
        review.content?.toLowerCase().includes(term);
      const matchesRating = ratingFilter === "all" || String(review.rating) === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageReviews = filteredReviews.slice(startIndex, startIndex + rowsPerPage);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <LayoutWrapper>
      <div className="container">
        <h1 className="display-6 fw-bold mb-4">Reviews</h1>

        {!targetId && (
          <div className="alert alert-warning" role="alert">
            Không tìm thấy <code>?id=...</code> trên URL. Thêm tham số <b>id</b> để tải review, ví dụ: <code>/reviews?id=123</code>.
          </div>
        )}

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
                    placeholder="Tìm kiếm theo phim, người review, nội dung…"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={ratingFilter}
                  onChange={(e) => {
                    setRatingFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
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
            <h5 className="card-title fw-bold mb-3">Reviews List</h5>

            {loading && <div className="text-muted small">Loading reviews…</div>}
            {error && <div className="text-danger small">Error: {error}</div>}

            {!loading && !error && (
              <>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="text-muted">
                        <th scope="col">ID</th>
                        <th scope="col">Film</th>
                        <th scope="col">Reviewer</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Content</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageReviews.map((r) => (
                        <tr key={r.id}>
                          <td className="text-break">{r.id}</td>
                          <td>{r.film}</td>
                          <td>{r.reviewer}</td>
                          <td>{r.rating}</td>
                          <td className="text-wrap" style={{ maxWidth: 360 }}>{r.content}</td>
                          <td>{r.createdAt}</td>
                          <td>{r.updatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pageReviews.length === 0 && (
                  <div className="text-muted small">No reviews found.</div>
                )}

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted small">
                    {filteredReviews.length === 0
                      ? "0-0 of 0"
                      : `${startIndex + 1}-${Math.min(
                          startIndex + rowsPerPage,
                          filteredReviews.length
                        )} of ${filteredReviews.length}`}
                  </span>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={nextPage}
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

export default Reviews;

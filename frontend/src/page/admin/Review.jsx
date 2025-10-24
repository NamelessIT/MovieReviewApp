import { useEffect, useState } from "react";
import ReviewsService from "../../service/admin/ReviewService";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";
import Pagination from "../../components/pagination/Pagination";
import { NavLink } from "react-router-dom";

const Reviews = () => {
  // giống Film.jsx: state phân trang + tìm kiếm
  const rowsPerPage = 6;
  const [filteredReviews, setFilteredReviews] = useState([]); // set = response.data
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy filmId trên URL (?id=...) nếu có, để filter review theo phim y như logic cũ
  const [targetId, setTargetId] = useState(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    setTargetId(id || null);
  }, []);

  const loadData = async () => {
    try {
      setReviewsLoading(true);
      const response = await ReviewsService.getAllReviewsWithPagination(
        currentPage,
        rowsPerPage,
        searchTerm,
        targetId // optional: filter theo filmId nếu có
      );

      // Theo pattern Film.jsx: component giữ response.data
      setFilteredReviews(response || []);
      setReviewsError(null);

      // Tổng trang: lấy từ response.data.totalPages nếu có, mặc định 1
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewsError(error?.message || "Unknown error");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, targetId]);

  const handlePageChange = (event) => {
    // react-paginate trả index bắt đầu 0 → +1 để khớp currentPage
    setCurrentPage(event.selected + 1);
  };

  const onDelete = async (reviewId) => {
    try {
      await ReviewsService.delete(reviewId);
      loadData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <LayoutWrapper>
      <div className="container">
        {/* Filter/Search card */}
        <div className="card border-0 shadow-sm mb-4">
          <h1 className="fw-bold m-2">Quản lý đánh giá</h1>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative" style={{ width: "300px" }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control ps-5"
                  placeholder="Tìm kiếm theo phim, người review, nội dung…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <NavLink to="/admin/reviews/add" className="btn btn-md btn-dark">
                  <i className="bi bi-plus me-2"></i>
                  Thêm review
                </NavLink>
              </div>
            </div>
          </div>

          {targetId && (
            <div className="px-3 pb-3">
              <span className="badge text-bg-secondary">
                Đang lọc theo FilmId: {targetId}
              </span>
            </div>
          )}
        </div>

        {/* List card (table) */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Reviews List</h5>

            {reviewsLoading && <div className="text-muted small">Loading reviews…</div>}
            {reviewsError && <div className="text-danger small">Error: {reviewsError}</div>}

            {!reviewsLoading && !reviewsError && (
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
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filteredReviews?.data || []).map((r) => (
                        <tr key={r.id}>
                          <td className="text-break">{r.id}</td>
                          <td>{r.movieId}</td>
                          <td>{r.accountId}</td>
                          <td>{r.rating}</td>
                          <td className="text-wrap" style={{ maxWidth: 360 }}>{r.comment}</td>
                          <td>{r.createdAt?.substring?.(0, 10)}</td>
                          <td>{r.updatedAt?.substring?.(0, 10)}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-evenly">
                              <NavLink
                                to={`/admin/reviews/edit/${r.id}`}
                                className="btn btn-primary"
                              >
                                <i className="bi bi-pencil"></i>
                              </NavLink>
                              <div className="ps-2 border-secondary border-start ">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => onDelete(r.id)}
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

export default Reviews;

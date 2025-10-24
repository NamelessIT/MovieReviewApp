import { useEffect, useState } from "react";
import ReviewsService from "../../service/admin/ReviewService";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";
import Pagination from "../../components/pagination/Pagination";
import { NavLink } from "react-router-dom";
import { confirmDelete } from "../../components/common/Alert";

const Reviews = () => {
  // giống Film.jsx: state phân trang + tìm kiếm
  const rowsPerPage = 5;
  const [filteredReviews, setFilteredReviews] = useState([]); // set = response.data
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setReviewsLoading(true);
      const response = await ReviewsService.getAllReviewsWithPagination(
        currentPage,
        rowsPerPage,
        searchTerm
      );

      // Theo pattern Film.jsx: component giữ response.data
      setFilteredReviews(response.data || []);
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
  }, [currentPage, searchTerm]);

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
              <div className="position-relative" style={{ width: "350px" }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control ps-5"
                  placeholder="Tìm kiếm theo phim, người review..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* List card (table) */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Reviews List</h5>

            {reviewsLoading && (
              <div className="text-muted small">Loading reviews…</div>
            )}
            {reviewsError && (
              <div className="text-danger small">Error: {reviewsError}</div>
            )}

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
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                        <th scope="col" className="text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filteredReviews?.data || []).map((r) => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td style={{ maxWidth: 200 }}>
                            <div className="text-muted">ID: {r.movieId}</div>
                            <div>{r.movieTitle}</div>
                          </td>
                          <td>
                            <div className="text-muted">ID: {r.accountId}</div>
                            <div>{r.accountName}</div>
                          </td>
                          <td>
                            {r.rating}{" "}
                            <i className="bi bi-star-fill text-warning"></i>
                          </td>
                          <td className="text-wrap" style={{ maxWidth: 300 }}>
                            {r.comment}
                          </td>
                          <td>
                            <span
                              className={
                                "badge rounded-pill " +
                                (r.isDeleted.toString() === "false"
                                  ? "text-bg-success"
                                  : "text-bg-danger")
                              }
                            >
                              {r.isDeleted.toString() === "false"
                                ? "Hoạt động"
                                : "Ngừng hoạt động"}
                            </span>
                          </td>
                          <td>{r.createdAt?.substring?.(0, 10)}</td>
                          <td>{r.updatedAt?.substring?.(0, 10)}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-center align-items-center">
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    confirmDelete("Đánh giá", r.id, () =>
                                      onDelete(r.id)
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

export default Reviews;

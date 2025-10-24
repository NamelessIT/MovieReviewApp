import APIAdmin from "../../api/APIAdmin";

const ReviewService = {
  // Lấy danh sách review có phân trang (giống FilmService)
  // Hỗ trợ filter theo searchKeyword và (tuỳ chọn) filmId (param id trên URL)
  getAllReviewsWithPagination: async (page, size, searchKeyword, filmId) => {
    let endpoint = `/review/admin/pagination?pageNumber=${page}&pageSize=${size}`;
    if (searchKeyword) {
      endpoint += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }
    if (filmId) {
      endpoint += `&filmId=${encodeURIComponent(filmId)}`;
    }
    return APIAdmin(endpoint);
  },

  // Xoá review
  delete: async (reviewId) => {
    return APIAdmin(`/review/${reviewId}`, { method: "DELETE" });
  },

  // Cập nhật review
  update: async (reviewId, reviewData) => {
    return APIAdmin(`/review/${reviewId}`, {
      method: "PUT",
      body: reviewData,
    });
  },

  // Tạo review
  create: async (reviewData) => {
    return APIAdmin(`/review`, {
      method: "POST",
      body: reviewData,
    });
  },

  // Lấy chi tiết 1 review
  getReviewById: async (reviewId) => {
    return APIAdmin(`/review/admin/detail/${reviewId}`);
  },
};

export default ReviewService;

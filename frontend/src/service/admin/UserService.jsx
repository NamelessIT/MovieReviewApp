import APIAdmin from "../../api/APIAdmin";

const UserService = {
  // Lấy tất cả user với phân trang (giống FilmService)
  getAllUsersWithPagination: async (page, size, searchKeyword) => {
    let endpoint = `/user/admin/pagination?pageNumber=${page}&pageSize=${size}`;
    if (searchKeyword) {
      endpoint += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }
    return APIAdmin(endpoint);
  },

  // Xóa user
  delete: async (userId) => {
    return APIAdmin(`/user/${userId}`, { method: "DELETE" });
  },

  // Cập nhật user
  update: async (userId, userData) => {
    return APIAdmin(`/user/${userId}`, {
      method: "PUT",
      body: userData,
    });
  },

  // Tạo user
  create: async (userData) => {
    return APIAdmin(`/user`, {
      method: "POST",
      body: userData,
    });
  },

  // Lấy user theo id (chi tiết)
  getUserById: async (userId) => {
    return APIAdmin(`/user/${userId}`);
  },
};

export default UserService;

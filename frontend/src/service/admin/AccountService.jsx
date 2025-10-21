import APIAdmin from "../../api/APIAdmin";
// const API_BASE_URL = "http://localhost:5003/api";
const AccountService = {
  //Lấy tất cả tài khoản với phân trang
  getAllAccountsWithPagination: async (page, size, searchKeyword) => {
    let endpoint = `/account/admin/pagination?pageNumber=${page}&pageSize=${size}`;
    if (searchKeyword) {
      endpoint += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }
    return APIAdmin(endpoint);
  },
  //Xóa tài khoản
  delete: async (accountId) => {
    return APIAdmin(`/account/${accountId}`, { method: "DELETE" });
  },

  //Cập nhật tài khoản
  update: async (accountId, accountData) => {
    return APIAdmin(`/account/${accountId}`, {
      method: "PUT",
      body: accountData,
    });
  },
  create: async (accountData) => {
    return APIAdmin(`/account`, {
      method: "POST",
      body: accountData,
    });
  },
  // lấy dữ liệu tài khoản by id
  getAccountById: async (accountId) => {
    return APIAdmin(`/account/${accountId}`);
  },
  // lấy tất cả người dùng không phân trang
  getAllUsers: async () => {
    return APIAdmin(`/account/users`);
  },
  // lấy tất cả người dùng chưa có tài khoản
  getUsersWithoutAccount: async () => {
    return APIAdmin(`/account/users/without-accounts`);
  },
};
export default AccountService;

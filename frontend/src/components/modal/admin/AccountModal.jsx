import { useState, useEffect, use } from "react";
import { LayoutWrapper } from "../../admin/LayoutWrapper";
import { useNavigate, useParams } from "react-router-dom";
import AccountService from "../../../service/admin/AccountService.jsx";
import { AlertSuccess, AlertError } from "../../common/Alert.jsx";
const AccountModal = ({ onMode }) => {
  // Tên 'accountId' ở đây phải khớp với tên đặt trong Route path
  const { accountId } = useParams();
  const roles = [
    { id: "0", name: "Admin" },
    { id: "1", name: "User" },
  ];
  const status = [
    { id: "false", name: "Hoạt động" },
    { id: "true", name: "Ngừng hoạt động" },
  ];
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // List of users for dropdown
  const [loading, setLoadingData] = useState(true);
  // Form data
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    role: "",
    isDeleted: false,
  });

  // Fetch directors, genres, actors on mount
  const loadData = async () => {
    try {
      setLoadingData(true);
      const dataUsers = await AccountService.getUsersWithoutAccount();
      setUsers(dataUsers.data || []);
      if (onMode === "edit") {
        const accountData = await AccountService.getAccountById(accountId);
        setFormData(accountData.data);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoadingData(false);
    }
  };
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeAllWhitespace = (str) => {
    if (typeof str !== "string") {
      return str; // Trả về nguyên bản nếu không phải là chuỗi
    }
    return str.replace(/\s/g, "");
  };
  const handleUserNameChange = (e) => {
    // 1. Lấy ra userId vừa được chọn (đây là một chuỗi)
    const selectedUserId = e.target.value;
    // Tìm user tương ứng trong danh sách users
    const selectedUser = users.find((user) => user.userId == selectedUserId);
    // 2. Cập nhật formData.userId
    setFormData((prev) => ({
      ...prev,
      userId: selectedUserId,
      username: removeAllWhitespace(selectedUser.userName),
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      // Submit form data
      const payload = {
        userId: parseInt(formData.userId),
        username: formData.username,
        role: formData.role,
        isDeleted: formData.isDeleted === "true" ? true : false,
      };
      if (onMode === "edit") {
        await AccountService.update(accountId, payload);
        AlertSuccess("Cập nhật tài khoản thành công");
      } else {
        await AccountService.create(payload);
        AlertSuccess("Tạo tài khoản thành công");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      AlertError();
      // setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoadingData(false);
      navigate("/admin/accounts");
    }
  };

  
  useEffect(() => {
    loadData();
  }, []);

  return (
    <LayoutWrapper>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold">
            {onMode == "edit" ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
          </h1>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/accounts")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại
          </button>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Basic Information */}
                    <div className="col-12">
                      <h5 className="fw-bold text-primary mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Thông tin cơ bản
                      </h5>
                    </div>
                    {/* Loading State  */}
                    {loading && (
                      <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Đang tải dữ liệu...</div>
                      </div>
                    )}
                    {/* Chọn Người dùng cần tạo tài khoản */}
                    {onMode === "add" && (
                      <div className="col-md-6">
                        <label
                          htmlFor="UserName"
                          className="form-label fw-medium"
                        >
                          Chọn Người dùng <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="userId"
                          name="userId"
                          value={formData.userId}
                          onChange={handleUserNameChange}
                          required
                        >
                          <option value="">Chọn người dùng</option>
                          {users.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {user.userName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {/* Vai trò */}
                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Vai trò <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange(e)}
                        required
                      >
                        <option value="">Chọn vai trò</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Tên tài khoản */}
                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Tên tài khoản <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Nhập tên tài khoản"
                        required
                      />
                    </div>
                    {/* Trạng thái tài khoản */}
                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Trạng thái tài khoản{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="isDeleted"
                        name="isDeleted"
                        value={formData.isDeleted}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        {status.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Action Buttons */}
                    <div className="col-12">
                      <hr className="my-4" />
                      <div className="d-flex gap-3 justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-md btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              {onMode === "add" && (
                                <i className="bi bi-plus me-2"></i>
                              )}
                              {onMode === "edit"
                                ? "Cập nhật tài khoản"
                                : "Thêm tài khoản"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AccountModal;

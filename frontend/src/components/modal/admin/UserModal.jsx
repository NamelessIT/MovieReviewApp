import { useState, useEffect } from "react";
import { LayoutWrapper } from "../../admin/LayoutWrapper";
import { useNavigate, useParams } from "react-router-dom";
import AccountService from "../../../service/admin/AccountService.jsx";
import { AlertSuccess, AlertError } from "../../common/Alert.jsx";
import UserService from "../../../service/admin/UserService.jsx";
const UserModal = ({ onMode }) => {
  // Tên 'userId' ở đây phải khớp với tên đặt trong Route path
  const { userId } = useParams();
  const [loading, setLoadingData] = useState(true);
  const navigate = useNavigate();
  // trạng thái người dùng để chọn khi tạo tài khoản
  const status = [
    { id: "false", name: "Hoạt động" },
    { id: "true", name: "Ngừng hoạt động" },
  ];
  // Form data
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    fullName: "",
    isDeleted: false,
  });

  // Fetch danh sách người dùng để chọn khi tạo tài khoản
  const loadData = async () => {
    try {
      setLoadingData(true);
      if (onMode === "edit") {
        const userData = await UserService.getUserById(userId);
        setFormData(userData.data);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      // Submit form data
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        isDeleted: formData.isDeleted === "true" ? true : false,
      };
      if (onMode === "edit") {
        await UserService.update(userId, payload);
        AlertSuccess("Cập nhật người dùng thành công");
      } else {
        await UserService.create(payload);
        AlertSuccess("Tạo người dùng thành công");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      AlertError();
      // setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoadingData(false);
      navigate("/admin/users");
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
            {onMode == "edit" ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h1>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/users")}
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
                   
                    {/* Tên tài khoản */}
                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                      />
                    </div>
                    {/* Trạng thái tài khoản */}
                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-medium">
                        Trạng thái người dùng
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
                                ? "Cập nhật người dùng"
                                : "Thêm người dùng"}
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

export default UserModal;

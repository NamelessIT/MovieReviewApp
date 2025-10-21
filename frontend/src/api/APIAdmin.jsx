const API_BASE_URL = "http://localhost:5003/api";
const APIAdmin = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  //Kiểm tra xem body có phải là FormData 
  const isFormData = options.body instanceof FormData;
  const defaultHearder = {
    // Trình duyệt sẽ tự động set 'multipart/form-data' và 'boundary'
    ...(!isFormData && { "Content-Type": "application/json" }),
    // Lấy token từ local storage (ví dụ)
    // Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };
  const config = {
    ...options, // Phương thức, body, v.v. từ options ví dụ: { method: 'POST', body: JSON.stringify(data) }
    headers: {
      ...defaultHearder, // Thêm header mặc định ví dụ: 'Content-Type': 'application/json'
      ...options.headers, // Ghi đè header nếu có trong options ví dụ: { headers: { 'Content-Type': 'text/plain' } }
    },
    body: isFormData ? options.body : JSON.stringify(options.body),
  };
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      // Đọc lỗi từ phản hồi (thường là JSON) nếu có, nếu không thì ném lỗi chung
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      // Ném lỗi với thông tin chi tiết
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }
    // 2. Trả về dữ liệu JSON (hoặc null nếu không có nội dung)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }
    // Trả về response text nếu không phải JSON (ví dụ: phản hồi rỗng 204 No Content)
    return await response.text();
  } catch (error) {
    console.error("Lỗi API Client:", error.message);
    throw error;
  }
};
export default APIAdmin;

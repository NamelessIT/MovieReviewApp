import {useState,useEffect} from 'react'

// @param {function} serviceFunction - Hàm gọi API từ service (ví dụ: UserService.getAllUsers)
// @param {array} deps - Các dependency của useEffect

const useFetchData = (serviceFunction, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Gọi Service Function
                const result = await serviceFunction();
                setData(result);
            } catch (err) {
                // 2. Xử lý lỗi
                setError(err.message || 'Lỗi khi tải dữ liệu');
            } finally {
                // 3. Kết thúc loading
                setLoading(false);
            }
        };

        fetchData();
    }, deps); // Truyền dependencies để kiểm soát khi nào hook chạy lại

    // Trả về state để component sử dụng
    return { data, loading, error, setData };
};

export default useFetchData;
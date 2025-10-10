import APIAdmin from "../../api/APIAdmin";
// const API_BASE_URL = "http://localhost:5003/api";
const FilmService = {
    //Lấy tất cả film với phân trang
    getAllFilmsWithPagination: async (page, size) => {
        return APIAdmin(`/film/admin/pagination?pageNumber=${page}&pageSize=${size}`);
    },
    //Xóa film
    delete: async (filmId) => {
        return APIAdmin(`/film/${filmId}`,
        { method: 'DELETE' });
    },
    
};
export default FilmService;
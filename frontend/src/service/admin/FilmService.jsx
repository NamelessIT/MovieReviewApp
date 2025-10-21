import APIAdmin from "../../api/APIAdmin";
// const API_BASE_URL = "http://localhost:5003/api";
const FilmService = {
    //Lấy tất cả film với phân trang
    getAllFilmsWithPagination: async (page, size, searchKeyword) => {
        let endpoint = `/film/admin/pagination?pageNumber=${page}&pageSize=${size}`;
        if (searchKeyword) {
            endpoint += `&searchKeyword=${encodeURIComponent(searchKeyword)}`;
        }
        return APIAdmin(endpoint);
    },
    //Xóa film
    delete: async (filmId) => {
        return APIAdmin(`/film/${filmId}`,
        { method: 'DELETE' });
    },

    //Cập nhật film
    update: async (filmId, filmData) => {
        return APIAdmin(`/film/${filmId}`,
        { method: 'PUT', body: filmData });
    },
    //Lấy danh sách đạo diễn
    getAllDirectors: async () => {
        return APIAdmin(`/director`);
    },
    //Lấy danh sách thể loại
    getAllGenres: async () => {
        return APIAdmin(`/genre`);
    },
    // lấy danh sách diễn viên
    getAllActors: async () => {
        return APIAdmin(`/actor`);
    },
    create: async (filmData) => {
        return APIAdmin(`/film`, {
            method: 'POST',
            body: filmData,
        });
    },
    // lấy dữ liệu film by id
    getFilmById: async (filmId) => {
        return APIAdmin(`/film/admin/detail/${filmId}`);
    },

};
export default FilmService;
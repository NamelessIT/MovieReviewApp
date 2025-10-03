import APIAdmin from "../../api/APIAdmin";
const HomePageService = {
    //Lấy tất cả người dùng
    GetTotalUser: async () =>{
        return APIAdmin('/user/admin/count');
    },
    //Lấy tất cả Film
    GetTotalFilm: async() => {
        return APIAdmin('/film/admin/count');
    },
    //Lấy tất cả Review
    GetTotalReview: async() => {
        return APIAdmin('/review/admin/count');
    },
    //Lấy Top Rated Films
    GetTopRatedFilms: async() =>{
        return APIAdmin('/review/admin/GetAverageRatings');
    },
    //Lấy Top review Films
    GetTopReviewFilms: async() =>{
        return APIAdmin('/review/admin/GetFilmReviewCounts');
    }
}; export default HomePageService;
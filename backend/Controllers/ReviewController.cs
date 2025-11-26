using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs.Review;
namespace backend.Controllers

{
    // [Authorize]
    [ApiController]
    [Route("api/Review")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewRepository _reviewRepository;
        public ReviewController(ReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _reviewRepository.GetAllAsyncExceptDeleted();
            return Ok(new { message = "Get all reviews successfully", data = reviews ?? [], status = 200 });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get review successfully", data = review, status = 200 });
        }

        [HttpGet("film/{filmId}")]
        public async Task<IActionResult> GetReviewsByFilmId(int filmId)
        {
            var reviews = await _reviewRepository.GetReviewsByFilmIdAsync(filmId);
            return Ok(new { message = "Get reviews by film ID successfully", data = reviews ?? [], status = 200 });
        }

        // Endpoint phân trang cho reviews theo film (dùng cho trang chi tiết phim)
        [HttpGet("film/{filmId}/pagination")]
        public async Task<IActionResult> GetReviewsByFilmWithPagination(int filmId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { message = "Invalid pagination parameters.", status = 400 });
            }

            var paged = await _reviewRepository.GetReviewsByFilmWithPagination(filmId, pageNumber, pageSize);
            return Ok(new { message = "Get reviews by film with pagination successfully", data = paged ?? new PaginatedResponse<backend.DTOs.ReviewAdminDTO> { Data = new List<backend.DTOs.ReviewAdminDTO>(), CurrentPage = pageNumber, TotalPages = 0 }, status = 200 });
        }

        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetReviewsByAccountId(int accountId)
        {
            var reviews = await _reviewRepository.GetReviewsByAccountIdAsync(accountId);
            return Ok(new { message = "Get reviews by account ID successfully", data = reviews ?? [], status = 200 });
        }

        // ✅ Lấy review mới nhất theo account + film
        [HttpGet("account/{accountId}/film/{filmId}")]
        public async Task<IActionResult> GetReviewByAccountIdAndFilmId(int accountId, int filmId)
        {
            var review = await _reviewRepository.GetLatestReviewByAccountAndFilmAsync(accountId, filmId);
                if (review == null)
                {
                    // ✅ Trả về response mặc định thay vì 404
                    return Ok(new 
                    { 
                        message = "No review found, returning default value", 
                        data = new { favorites = false }, 
                        status = 200 
                    });
                }
            return Ok(new { message = "Get latest review successfully", data = review, status = 200 });
        }

        [HttpGet("admin/pagination")]
        public async Task<IActionResult> GetReviewWithPagination([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string? searchKeyword)
        {
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { message = "Invalid pagination parameters.", status = 400 });
            }

            var users = await _reviewRepository.GetReviewAdminWithPagination(pageNumber, pageSize, searchKeyword);
            return Ok(new { message = "Get accounts with pagination successfully", data = users ?? null, status = 200 });
        }

        // ✅ Lấy danh sách phim yêu thích của 1 tài khoản
        [HttpGet("favorites/{accountId}")]
        public async Task<IActionResult> GetAllFavoritesReviewsAsync(int accountId)
        {
            try
            {
                var favorites = await _reviewRepository.GetAllFavoritesReviewsAsync(accountId);
                if (favorites == null || !favorites.Any())
                {
                    return Ok(new { message = "Người dùng chưa có phim yêu thích.", data = new List<Review>(), status = 200 });
                }

                // Trả về danh sách review kèm thông tin phim
                return Ok(new
                {
                    message = "Lấy danh sách phim yêu thích thành công.",
                    data = favorites.Select(r => new
                    {
                        r.Id,
                        r.MovieId,
                        r.Favorites,
                        r.Rating,
                        r.CreatedAt,
                        r.UpdatedAt
                    }),
                    status = 200
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách phim yêu thích.", error = ex.Message });
            }
        }


        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] Review review)
        {
            if (review == null)
            {
                return BadRequest();
            }
            await _reviewRepository.AddAsync(review);
            return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, review);
        }

        // ✅ Rating
        [HttpPost("CreateRating")]
        public async Task<IActionResult> CreateRating([FromBody] RatingRequest request)
        {
            if (request == null) return BadRequest("Invalid data.");
            var review = await _reviewRepository.CreateOrUpdateRatingAsync(request.AccountId, request.FilmId, request.Rating);
            return Ok(new { message = "Rating saved successfully", data = review, status = 200 });
        }

        // ✅ Favorites
        [HttpPost("CreateFavorites")]
        public async Task<IActionResult> CreateFavorites([FromBody] FavoritesRequest request)
        {
            if (request == null) return BadRequest("Invalid data.");
            var review = await _reviewRepository.CreateOrUpdateFavoritesAsync(request.AccountId, request.FilmId, request.Favorites);
            return Ok(new { message = "Favorites updated successfully", data = review, status = 200 });
        }

        // ✅ Comment
        [HttpPost("CreateComment")]
        public async Task<IActionResult> CreateComment([FromBody] CommentRequest request)
        {
            if (request == null) return BadRequest("Invalid data.");
            var review = await _reviewRepository.CreateOrUpdateCommentAsync(request.AccountId, request.FilmId, request.Comment);
            return Ok(new { message = "Comment saved successfully", data = review, status = 200 });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] Review review)
        {
            try
            {
                if (review == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingReview = await _reviewRepository.GetByIdAsync(id);
                if (existingReview == null)
                {
                    return NotFound(new { message = "Review không tồn tại." });
                }
                await _reviewRepository.UpdateAsync(review);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật Review.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var existingReview = await _reviewRepository.GetByIdAsync(id);
            if (existingReview == null)
            {
                return NotFound(new { message = "Review không tồn tại." });
            }
            await _reviewRepository.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("admin/count")]
        public async Task<IActionResult> GetCountAllReview()
        {
            var total = await _reviewRepository.CountAllReview();
            return Ok(new { message = "Get total quantity review successfully", data = total, status = 200 });
        }

        [HttpGet("admin/GetAverageRatings")]
        public async Task<IActionResult> GetAverageRatings()
        {
            var reviews = await _reviewRepository.GetAverageRatings();
            return Ok(new { message = "Get Average Ratings successfully", data = reviews ?? [], status = 200 });
        }

        [HttpGet("admin/GetFilmReviewCounts")]
        public async Task<IActionResult> GetFilmReviewCounts()
        {
            var reviews = await _reviewRepository.GetFilmReviewCounts();
            return Ok(new { message = "Get Count Review Films successfully", data = reviews ?? [], status = 200 });
        }
    }
}
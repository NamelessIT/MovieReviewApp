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

        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetReviewsByAccountId(int accountId)
        {
            var reviews = await _reviewRepository.GetReviewsByAccountIdAsync(accountId);
            return Ok(new { message = "Get reviews by account ID successfully", data = reviews ?? [], status = 200 });
        }

        [HttpGet("account/{accountId}/film/{filmId}")]
        public async Task<IActionResult> GetReviewByAccountIdAndFilmId(int accountId, int filmId)
        {
            var review = await _reviewRepository.GetReviewByAccountIdAndFilmIdAsync(accountId, filmId);
            if (review == null)
            {
                return NotFound(new { message = "Review not found", status = 404 });
            }
            return Ok(new { message = "Get review successfully", data = review, status = 200 });
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

        // ✅ 1. API: Cập nhật hoặc tạo Rating
        [HttpPost("CreateRating")]
        public async Task<IActionResult> CreateRating([FromBody] RatingRequest request)
        {
            if (request == null) return BadRequest("Invalid data.");
            var review = await _reviewRepository.CreateReviewAsyncRating(request.AccountId, request.FilmId, request.Rating);
            return Ok(review);
        }

        // ✅ 2. API: Cập nhật hoặc tạo Favorites
        [HttpPost("CreateFavorites")]
        public async Task<IActionResult> CreateFavorites([FromBody] FavoritesRequest request)
        {
            if (request == null) return BadRequest("Invalid data.");
            var review = await _reviewRepository.CreateReviewAsyncFavorites(request.AccountId, request.FilmId, request.Favorites);
            return Ok(review);
        }

        // ✅ 3. API: Cập nhật hoặc tạo Comment
        [HttpPost("CreateComment")]
        public async Task<IActionResult> CreateComment([FromBody] CommentRequest request)
        {
            if (request == null) return BadRequest("Invalid data.");
            var review = await _reviewRepository.CreateReviewAsyncComment(request.AccountId, request.FilmId, request.Comment);
            return Ok(review);
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
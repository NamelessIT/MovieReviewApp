using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
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

    }
}
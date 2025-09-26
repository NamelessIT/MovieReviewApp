using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/genre")]
    public class GenreController : ControllerBase
    {
        private readonly GenreRepository _genreRepository;

        public GenreController(GenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _genreRepository.GetAllAsync();
            return Ok(new { message = "Get all genres successfully", data = genres ?? [], status = 200 });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _genreRepository.GetByIdAsync(id);
            if (genre == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get genre successfully", data = genre, status = 200 });
        }

        [HttpGet("search/{name}")]
        public async Task<IActionResult> GetGenresByName(string name)
        {
            var genres = await _genreRepository.GetByNameAsync(name);
            return Ok(new { message = "Get genres by name successfully", data = genres ?? [], status = 200 });
        }
        [Authorize(Roles = "admin")]
        [HttpGet("admin/search/{name}")]
        public async Task<IActionResult> GetAllGenresByName(string name)
        {
            var genres = await _genreRepository.GetAllByNameAsync(name);
            return Ok(new { message = "Get all genres by name successfully", data = genres ?? [], status = 200 });
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateGenre([FromBody] Genre genre)
        {
            if (genre == null)
            {
                return BadRequest();
            }
            await _genreRepository.AddAsync(genre);
            return CreatedAtAction(nameof(GetGenreById), new { id = genre.Id }, genre);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] Genre genre)
        {
            try
            {
                if (genre == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingGenre = await _genreRepository.GetByIdAsync(id);
                if (existingGenre == null)
                {
                    return NotFound(new { message = "Genre không tồn tại." });
                }
                genre.Id = id; // Đảm bảo ID của thể loại được cập nhật đúng
                await _genreRepository.UpdateAsync(genre);
                return Ok(new { message = "Genre updated successfully", data = genre, status = 200 });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the genre.", error = ex.Message });
            }
        }
    }
}
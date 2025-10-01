using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/film")]
    public class FilmController : ControllerBase
    {
        private readonly FilmRepository _filmRepository;

        public FilmController(FilmRepository filmRepository)
        {
            _filmRepository = filmRepository;
        }

        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllFilms()
        {
            var films = await _filmRepository.GetAllAsync();
            return Ok(new { message = "Get all film successfully", data = films ?? [], status = 200 });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFilmsUser()
        {
            var films = await _filmRepository.GetAllAsyncUser();
            return Ok(new { message = "Get all film user successfully", data = films ?? [], status = 200 });
        }
        [Authorize(Roles = "admin")]
        [HttpGet("search/admin/{keyword}")]
        public async Task<IActionResult> SearchFilmsAdmin(string keyword)
        {
            var films = await _filmRepository.SearchByNameAsync(keyword);
            return Ok(new { message = "Search films (admin) successfully", data = films ?? [], status = 200 });
        }

        // User: tìm kiếm film theo tên
        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> SearchFilmsUser(string keyword)
        {
            var films = await _filmRepository.SearchByNameUserAsync(keyword);
            return Ok(new { message = "Search films (user) successfully", data = films ?? [], status = 200 });
        }
        [Authorize(Roles = "admin")]
        [HttpGet("admin/{id}")]
        public async Task<IActionResult> GetFilmById(int id)
        {
            var film = await _filmRepository.GetByIdAsync(id);
            if (film == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get all film successfully", data = film, status = 200 });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFilmByIdByUser(int id)
        {
            var film = await _filmRepository.GetByIdAsyncUser(id);
            if (film == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get all film successfully", data = film, status = 200 });
        }

        [HttpPost]
        public async Task<IActionResult> CreateFilm([FromBody] Film film)
        {
            if (film == null)
            {
                return BadRequest();
            }
            await _filmRepository.AddAsync(film);
            return CreatedAtAction(nameof(GetFilmById), new { id = film.Id }, film);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFilm(int id, [FromBody] Film film)
        {
            try
            {
                if (film == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingFilm = await _filmRepository.GetByIdAsync(id);
                if (existingFilm == null)
                {
                    return NotFound(new { message = "Film không tồn tại." });
                }
                await _filmRepository.UpdateAsync(film);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật film.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilm(int id)
        {
            var existingFilm = await _filmRepository.GetByIdAsync(id);
            if (existingFilm == null)
            {
                return NotFound();
            }
            await _filmRepository.DeleteAsync(id);
            return NoContent();
        }
        
                // 🟢 API: Lấy danh sách film mới nhất
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewestFilms([FromQuery] int limit = 10)
        {
            var films = await _filmRepository.GetNewestFilmsAsync(limit);
            return Ok(new { message = "Get newest films successfully", data = films ?? [], status = 200 });
        }

        // 🟢 API: Lấy danh sách film có rating cao nhất, fallback nếu rỗng
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedFilms([FromQuery] int limit = 10)
        {
            var films = await _filmRepository.GetTopRatedFilmsAsync(limit);

            // Nếu không có film nào có review -> fallback sang newest
            if (films == null || !films.Any())
            {
                films = await _filmRepository.GetNewestFilmsAsync(limit);
                return Ok(new { 
                    message = "No top-rated films found. Returning newest films instead.", 
                    data = films ?? [], 
                    status = 200 
                });
            }

            return Ok(new { 
                message = "Get top rated films successfully", 
                data = films ?? [], 
                status = 200 
            });
        }


    }
}
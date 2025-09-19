using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/director")]
    public class DirectorController : ControllerBase
    {
        private readonly DirectorRepository _directorRepository;
        public DirectorController(DirectorRepository directorRepository)
        {
            _directorRepository = directorRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllDirectors()
        {
            var directors = await _directorRepository.GetAllAsync();
            return Ok(new { message = "Get all directors successfully", data = directors ?? [], status = 200 });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDirectorById(int id)
        {
            var director = await _directorRepository.GetByIdAsync(id);
            if (director == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get director successfully", data = director, status = 200 });
        }

        [HttpPost]
        public async Task<IActionResult> CreateDirector([FromBody] Director director)
        {
            if (director == null)
            {
                return BadRequest();
            }
            await _directorRepository.AddAsync(director);
            return CreatedAtAction(nameof(GetDirectorById), new { id = director.Id }, director);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDirector(int id, [FromBody] Director director)
        {
            try
            {
                if (director == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingDirector = await _directorRepository.GetByIdAsync(id);
                if (existingDirector == null)
                {
                    return NotFound(new { message = "Director không tồn tại." });
                }
                director.Id = id; // Đảm bảo ID của director được cập nhật đúng
                await _directorRepository.UpdateAsync(director);
                return Ok(new { message = "Director updated successfully", data = director, status = 200 });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the director.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDirector(int id)
        {
            var existingDirector = await _directorRepository.GetByIdAsync(id);
            if (existingDirector == null)
            {
                return NotFound(new { message = "Director không tồn tại." });
            }
            await _directorRepository.DeleteAsync(id);
            return Ok(new { message = "Director deleted successfully", status = 200 });
        }


        [HttpGet("search/{name}")]
        public async Task<IActionResult> GetDirectorsByName(string name)
        {
            var directors = await _directorRepository.GetByNameAsync(name);
            return Ok(new { message = "Get directors by name successfully", data = directors ?? [], status = 200 });
        }

        [HttpGet("admin/search/{name}")]
        public async Task<IActionResult> GetAllDirectorsByName(string name)
        {
            var directors = await _directorRepository.GetAllByNameAsync(name);
            return Ok(new { message = "Get all directors by name successfully", data = directors ?? [], status = 200 });
        }
    }
}
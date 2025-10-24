using Microsoft.AspNetCore.Mvc;
using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;

namespace MovieReviewApp.backend.Controllers
{
    [ApiController]
    [Route("api/FilmDirector")]
    public class FilmDirectorController : ControllerBase
    {
        private readonly FilmDirectorRepository _filmDirectorRepository;

        public FilmDirectorController(FilmDirectorRepository filmDirectoryRepository)
        {
            _filmDirectorRepository = filmDirectoryRepository;
        }

        [HttpGet("GetByFilmId/{filmId}")]
        public async Task<IActionResult> GetByFilmId(int filmId)
        {
            var data = await _filmDirectorRepository.GetByFilmIdAsync(filmId);
            return Ok(new { message = "Get FilmDirectory by FilmId successfully", data, status = 200 });
        }

        [HttpGet("GetByDirectorId/{directorId}")]
        public async Task<IActionResult> GetByDirectorId(int directorId)
        {
            var data = await _filmDirectorRepository.GetByDirectorIdAsync(directorId);
            return Ok(new { message = "Get FilmDirectory by DirectorId successfully", data, status = 200 });
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] FilmDirector dto)
        {
            var entity = await _filmDirectorRepository.CreateAsync(dto.FilmId, dto.DirectorId);
            if (entity == null)
                return BadRequest(new { message = "FilmDirectory already exists" });

            return Ok(new { message = "Create FilmDirectory successfully", data = entity, status = 201 });
        }

        [HttpDelete("DeleteByFilmId/{filmId}")]
        public async Task<IActionResult> DeleteByFilmId(int filmId)
        {
            var result = await _filmDirectorRepository.DeleteByFilmIdAsync(filmId);
            return result ? Ok(new { message = "Deleted successfully" }) : NotFound();
        }

        [HttpDelete("DeleteByDirectorId/{directorId}")]
        public async Task<IActionResult> DeleteByDirectorId(int directorId)
        {
            var result = await _filmDirectorRepository.DeleteByDirectorIdAsync(directorId);
            return result ? Ok(new { message = "Deleted successfully" }) : NotFound();
        }

        [HttpDelete("DeleteByFilmAndDirector/{filmId}/{directorId}")]
        public async Task<IActionResult> DeleteByFilmAndDirector(int filmId, int directorId)
        {
            var result = await _filmDirectorRepository.DeleteByFilmAndDirectorAsync(filmId, directorId);
            return result ? Ok(new { message = "Deleted successfully" }) : NotFound();
        }
    }
}

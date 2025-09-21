using Microsoft.AspNetCore.Mvc;
using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;

namespace MovieReviewApp.backend.Controllers
{
    [ApiController]
    [Route("api/FilmGenre")]
    public class FilmGenreController : ControllerBase
    {
        private readonly FilmGenreRepository _filmGenreRepository;

        public FilmGenreController(FilmGenreRepository filmGenreRepository)
        {
            _filmGenreRepository = filmGenreRepository;
        }

        [HttpGet("GetByFilmId/{filmId}")]
        public async Task<IActionResult> GetByFilmId(int filmId)
        {
            var data = await _filmGenreRepository.GetByFilmIdAsync(filmId);
            return Ok(new { message = "Get FilmGenre by FilmId successfully", data, status = 200 });
        }

        [HttpGet("GetByGenreId/{genreId}")]
        public async Task<IActionResult> GetByGenreId(int genreId)
        {
            var data = await _filmGenreRepository.GetByGenreIdAsync(genreId);
            return Ok(new { message = "Get FilmGenre by GenreId successfully", data, status = 200 });
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] FilmGenre dto)
        {
            var entity = await _filmGenreRepository.CreateAsync(dto.FilmId, dto.GenreId);
            if (entity == null)
                return BadRequest(new { message = "FilmGenre already exists" });

            return Ok(new { message = "Create FilmGenre successfully", data = entity, status = 201 });
        }

        [HttpDelete("DeleteByFilmId/{filmId}")]
        public async Task<IActionResult> DeleteByFilmId(int filmId)
        {
            var result = await _filmGenreRepository.DeleteByFilmIdAsync(filmId);
            return result ? Ok(new { message = "Deleted successfully" }) : NotFound();
        }

        [HttpDelete("DeleteByGenreId/{genreId}")]
        public async Task<IActionResult> DeleteByGenreId(int genreId)
        {
            var result = await _filmGenreRepository.DeleteByGenreIdAsync(genreId);
            return result ? Ok(new { message = "Deleted successfully" }) : NotFound();
        }

        [HttpDelete("DeleteByFilmAndGenre/{filmId}/{genreId}")]
        public async Task<IActionResult> DeleteByFilmAndGenre(int filmId, int genreId)
        {
            var result = await _filmGenreRepository.DeleteByFilmAndGenreAsync(filmId, genreId);
            return result ? Ok(new { message = "Deleted successfully" }) : NotFound();
        }
    }
}

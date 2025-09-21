using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace MovieReviewApp.backend.Controllers
{
    [ApiController]
    [Route("api/film-actor")]
    public class FilmActorController : ControllerBase
    {
        private readonly FilmActorRepository _filmActorRepository;

        public FilmActorController(FilmActorRepository filmActorRepository)
        {
            _filmActorRepository = filmActorRepository;
        }

        [HttpGet("film/{filmId}")]
        public async Task<IActionResult> GetByFilmId(int filmId)
        {
            var filmActors = await _filmActorRepository.GetByFilmIdAsync(filmId);
            return Ok(new { message = "Get FilmActors by FilmId successfully", data = filmActors ?? [], status = 200 });
        }

        [HttpGet("actor/{actorId}")]
        public async Task<IActionResult> GetByActorId(int actorId)
        {
            var filmActors = await _filmActorRepository.GetByActorIdAsync(actorId);
            return Ok(new { message = "Get FilmActors by ActorId successfully", data = filmActors ?? [], status = 200 });
        }

        [HttpGet("{filmId}/{actorId}")]
        public async Task<IActionResult> GetByFilmIdAndActorId(int filmId, int actorId)
        {
            var filmActor = await _filmActorRepository.GetByFilmIdAndActorIdAsync(filmId, actorId);
            if (filmActor == null) return NotFound(new { message = "FilmActor not found" });

            return Ok(new { message = "Get FilmActor successfully", data = filmActor, status = 200 });
        }

        [HttpPost]
        public async Task<IActionResult> CreateFilmActor([FromBody] FilmActor filmActor)
        {
            if (filmActor == null) return BadRequest(new { message = "Invalid data" });

            var created = await _filmActorRepository.CreateAsync(filmActor.FilmId, filmActor.ActorId);
            if (created == null)
                return Conflict(new { message = "FilmActor already exists" });

            return CreatedAtAction(nameof(GetByFilmIdAndActorId),
                new { filmId = created.FilmId, actorId = created.ActorId }, created);
        }

        [HttpDelete("film/{filmId}")]
        public async Task<IActionResult> DeleteByFilmId(int filmId)
        {
            await _filmActorRepository.DeleteByFilmIdAsync(filmId);
            return Ok(new { message = "Deleted FilmActors by FilmId successfully", status = 200 });
        }

        [HttpDelete("actor/{actorId}")]
        public async Task<IActionResult> DeleteByActorId(int actorId)
        {
            await _filmActorRepository.DeleteByActorIdAsync(actorId);
            return Ok(new { message = "Deleted FilmActors by ActorId successfully", status = 200 });
        }

        [HttpDelete("{filmId}/{actorId}")]
        public async Task<IActionResult> DeleteByFilmIdAndActorId(int filmId, int actorId)
        {
            var deleted = await _filmActorRepository.DeleteByFilmIdAndActorIdAsync(filmId, actorId);
            if (!deleted) return NotFound(new { message = "FilmActor not found" });

            return Ok(new { message = "Deleted FilmActor successfully", status = 200 });
        }
    }
}

using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/actor")]
    public class ActorController : ControllerBase
    {
        private readonly ActorRepository _actorRepository;

        public ActorController(ActorRepository actorRepository)
        {
            _actorRepository = actorRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllActors()
        {
            var actors = await _actorRepository.GetAllExceptDeletedAsync();
            return Ok(new { message = "Get all actors successfully", data = actors ?? [], status = 200 });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActorById(int id)
        {
            var actor = await _actorRepository.GetByIdAsync(id);
            if (actor == null || actor.isDeleted)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get actor successfully", data = actor, status = 200 });
        }

        [HttpPost]
        public async Task<IActionResult> CreateActor([FromBody] Actor actor)
        {
            if (actor == null)
            {
                return BadRequest();
            }
            await _actorRepository.AddAsync(actor);
            return CreatedAtAction(nameof(GetActorById), new { id = actor.Id }, actor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActor(int id, [FromBody] Actor actor)
        {
            try
            {
                if (actor == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingActor = await _actorRepository.GetByIdAsync(id);
                if (existingActor == null || existingActor.isDeleted)
                {
                    return NotFound(new { message = "Actor không tồn tại." });
                }
                actor.Id = id; // Đảm bảo ID của actor được cập nhật đúng
                await _actorRepository.UpdateAsync(actor);
                return Ok(new { message = "Cập nhật actor thành công.", data = actor, status = 200 });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi trong quá trình xử lý." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActor(int id)
        {
            var existingActor = await _actorRepository.GetByIdAsync(id);
            if (existingActor == null || existingActor.isDeleted)
            {
                return NotFound(new { message = "Actor không tồn tại." });
            }
            await _actorRepository.DeleteAsync(id);
            return Ok(new { message = "Xóa actor thành công.", status = 200 });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchActorsByName([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Tên tìm kiếm không được để trống." });
            }
            var actors = await _actorRepository.SearchByNameExceptDeletedAsync(name);
            return Ok(new { message = "Search actors successfully", data = actors ?? [], status = 200 });
        }

        [HttpGet("amin/search")]
        public async Task<IActionResult> SearchActorsByNameAll([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Tên tìm kiếm không được để trống." });
            }
            var actors = await _actorRepository.SearchByNameAsync(name);
            return Ok(new { message = "Search actors successfully", data = actors ?? [], status = 200 });
        }

    }        
}
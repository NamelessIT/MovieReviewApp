using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace backend.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;                      
        public UserController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var films = await _userRepository.GetAllAsync();
            return Ok(new { message = "Get all user successfully", data = films ?? [], status = 200 });
        }

        [HttpGet("admin/count")]
        public async Task<IActionResult> GetCountAllUser()
        {
            var total = await _userRepository.CountAllUsers();
            return Ok(new { message = "Get total quantity user successfully", data = total, status = 200 });
        }

        [HttpGet("admin/pagination")]
        public async Task<IActionResult> GetUserWithPagination([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string? searchKeyword)
        {
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { message = "Invalid pagination parameters.", status = 400 });
            }

            var users = await _userRepository.GetUserAdminWithPagination(pageNumber, pageSize, searchKeyword);
            return Ok(new { message = "Get accounts with pagination successfully", data = users ?? null, status = 200 });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return  Ok(new { message = "Get user successfully", data = user, status = 200 });
        }
        

        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> SearchUsersByName(string keyword)
        {
            var users = await _userRepository.SearchByNameAsync(keyword);
            return Ok(new { message = "Search users successfully", data = users, status = 200 });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            await _userRepository.AddAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingUser = await _userRepository.GetByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = "user không tồn tại." });
                }
                await _userRepository.UpdateAsync(user);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật user.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }
            await _userRepository.DeleteAsync(id);
            return NoContent();
        }

    }
}
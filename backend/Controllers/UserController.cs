using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;
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
        public async Task<IActionResult> CreateUser([FromBody] UserAdminDTO user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            var createdUser =await _userRepository.CreateUser(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserAdminDTO user)
        {
            try
            {
                if (user == null)
                {
                    Console.WriteLine("Received null user object in UpdateUser.");
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                var existingUser = await _userRepository.GetByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound(new { message = "User không tồn tại." });
                }
                await _userRepository.UpdateUser(id, user);
                return Ok(new { message = "User updated successfully", data = user, status = 200 });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Xử lý lỗi khác nếu cần
                return StatusCode(500, new { message = "An error occurred while updating the account.", error = ex.Message });
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
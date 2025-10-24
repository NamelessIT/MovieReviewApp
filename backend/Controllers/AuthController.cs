using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AccountRepository _accountRepository;

    public AuthController(AccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

        // 🟢 API kiểm tra đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                bool isValid = await _accountRepository.ValidateLoginAsync(loginDto.Username, loginDto.Password);
                if (!isValid)
                {
                    return BadRequest(new
                    {
                        message = "Sai tên đăng nhập hoặc mật khẩu."
                    });
                }

                // Nếu hợp lệ, lấy thông tin chi tiết user để gửi về
                var account = await _accountRepository.GetInfoLoginAsync(loginDto);

                return Ok(new
                {
                    message = "Đăng nhập thành công.",
                    data = new
                    {
                        account.Id,
                        account.Username,
                        account.Role,
                        UserFullName = account.User?.FullName
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi khi kiểm tra đăng nhập.",
                    error = ex.Message
                });
            }
        }
}

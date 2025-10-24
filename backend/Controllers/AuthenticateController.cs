// using backend.DTOs;
// using backend.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace backend.Controllers
// {
//     [ApiController]
//     [Route("api/auth")]
//     public class AuthenticationController : ControllerBase
//     {
//         private readonly AuthService _authService;
//         public AuthenticationController(AuthService authService)
//         {
//             _authService = authService;
//         }
//         [HttpPost("login")]
//         public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
//         {
//             // Xử lý đăng nhập (ví dụ: kiểm tra thông tin đăng nhập, tạo token, v.v.)
//             var response = await _authService.LoginAsync(loginDto);
//             if (response == null)
//             {
//                 return Unauthorized(new { message = "Invalid username or password" });
//             }
//             return Ok(new { message = "Login successful", data = response, status = 200 });
//         }

//         [HttpPost("refresh-token")]
//         public async Task<IActionResult> RefreshToken([FromBody] TokenDTO tokenDto)
//         {
//             var refreshToken = tokenDto.RefreshToken;
//             if (string.IsNullOrEmpty(refreshToken))
//             {
//                 return BadRequest(new { message = "Refresh token is required" });
//             }
//             var response = await _authService.RefreshTokenAsync(refreshToken);
//             if (response == null)
//             {
//                 return Unauthorized(new { message = "Invalid or expired refresh token" });
//             }
//             return Ok(new { message = "Token refreshed successfully", data = response, status = 200 });
//         }

//         [HttpPost("logout")]
//         public async Task<IActionResult> Logout([FromBody] TokenDTO tokenDto)
//         {
//             var result = await _authService.LogoutAsync(tokenDto.RefreshToken);
//             if (!result)
//             {
//                 return BadRequest(new { message = "Invalid refresh token" });
//             }
//             return Ok(new { message = "Logout successful", status = 200 });
//         }

//     }
// }
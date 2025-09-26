using backend.DTOs;
using backend.Repositories;
using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;

namespace backend.Services
{
    public class AuthService
    {
        private readonly TokenService _tokenService;
        private readonly AccountRepository _accountRepository;
        private readonly AuthRepository _authRepository;
        public AuthService(TokenService tokenService, AccountRepository accountRepository, AuthRepository authRepository)
        {
            _tokenService = tokenService;
            _accountRepository = accountRepository;
            _authRepository = authRepository;
        }

        public async Task<TokenDTO> LoginAsync(LoginDTO loginRequestDto)
        {
            // Xử lý đăng nhập (ví dụ: kiểm tra thông tin đăng nhập, tạo token, v.v.)
            var account = await _accountRepository.GetInfoLoginAsync(loginRequestDto);
            if (account == null)
            {
                throw new UnauthorizedAccessException("Invalid username or password");
            }
            // Giả sử đăng nhập thành công và trả về token
            var AccessTokentoken = _tokenService.GenerateAccessToken(account);
            var refreshToken = _tokenService.GenerateRefreshToken(account);
            await _authRepository.AddRefreshTokenAsync(refreshToken);
            return new TokenDTO
            {
                AccessToken = AccessTokentoken,
                RefreshToken = refreshToken.Token
            };
        }

        public async Task<TokenDTO> RefreshTokenAsync(string token)
        {
            var existingRefreshToken = await _authRepository.GetRefreshTokenAsync(token);
            if (existingRefreshToken == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token");
            }
            var account = existingRefreshToken.account;
            // Tạo access token mới
            var newAccessToken = _tokenService.GenerateAccessToken(account);
            // Tạo refresh token mới
            var newRefreshToken = _tokenService.GenerateRefreshToken(account);

            // // Thu hồi refresh token cũ
            // await _authRepository.RevokeRefreshTokenAsync(existingRefreshToken);
            // Cập nhật refresh token mới vào cơ sở dữ liệu
            await _authRepository.UpdateRefreshTokenAsync(token,newRefreshToken);

            return new TokenDTO
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task<bool> LogoutAsync(string reFreshToken)
        {
            return await _authRepository.LogoutAsync(reFreshToken);
        }
    }
}
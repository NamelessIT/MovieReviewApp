using backend.Models;
using Microsoft.EntityFrameworkCore;
using MovieReviewApp.backend.Data;

namespace backend.Repositories
{
    public class AuthRepository
    {
        private readonly AppDbContext _context;
        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<RefeshToken?> GetRefreshTokenAsync(string token)
        {
            // Lấy refresh token từ cơ sở dữ liệu
            var refreshToken = await _context.RefeshTokens
                .Include(rt => rt.account)
                .FirstOrDefaultAsync(rt => rt.Token == token);
            if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt <= DateTime.UtcNow)
            {
                Console.WriteLine("Invalid or expired refresh token");
                return null; // Token không hợp lệ hoặc đã hết hạn
            }
            if(refreshToken.account == null )
            {
                Console.WriteLine("Account not found");
                return null; // Tài khoản đã bị xóa
            }
            return refreshToken;
        }

        public async Task RevokeRefreshTokenAsync(RefeshToken refreshToken)
        {
            refreshToken.IsRevoked = true;
            _context.RefeshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> AddRefreshTokenAsync(RefeshToken refreshToken)
        {
            try
            {
                await _context.RefeshTokens.AddAsync(refreshToken);
                await _context.SaveChangesAsync();
                return true;
            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> UpdateRefreshTokenAsync(string oldRefeshtoken, RefeshToken newRefreshToken)
        {
            try
            {
                var existingRefreshToken = await _context.RefeshTokens
                .FirstOrDefaultAsync(rt => rt.Token == oldRefeshtoken);
                if (existingRefreshToken == null)
                {
                    return false; // Token không tồn tại
                }
                existingRefreshToken.Token = newRefreshToken.Token;
                existingRefreshToken.ExpiresAt = DateTime.Now.AddSeconds(60); // Cập nhật thời gian hết hạn
                _context.RefeshTokens.Update(existingRefreshToken);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> LogoutAsync(string token)
        {
            var refreshToken = await _context.RefeshTokens
                .FirstOrDefaultAsync(rt => rt.Token == token);
            if (refreshToken == null)
            {
                return false;
            }
            refreshToken.IsRevoked = true;
            _context.RefeshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using MovieReviewApp.backend.Models;
using backend.Models;
using System.Security.Cryptography;
using backend.DTOs;
namespace backend.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
            var jwtKey = _configuration["Jwt:Key"] ?? throw new ArgumentNullException("JWT Key is not configured.");
            _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            _issuer = _configuration["Jwt:Issuer"] ?? throw new ArgumentNullException("JWT Issuer is not configured.");
            _audience = _configuration["Jwt:Audience"] ?? throw new ArgumentNullException("JWT Audience is not configured.");
        }

        public string GenerateAccessToken(Account account)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, account.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, account.Role)
            };

            var creds = new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.Now.AddSeconds(60),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public RefeshToken GenerateRefreshToken(Account account)
        {
            if (account == null)
            {
                throw new ArgumentNullException("Account information is missing.");
            }
            return new RefeshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                // ExpiresAt = DateTime.UtcNow.AddDays(7), // Refresh token hợp lệ trong 7 ngày
                ExpiresAt = DateTime.Now.AddSeconds(120), // Refresh token hợp lệ trong 2 phút
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false,
                account = account
            };
        }

    }
}
using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;
namespace MovieReviewApp.backend.Repositories
{
    public class UserRepository : GenericRepository<User>
    {   
        public UserRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<List<User>> SearchByNameAsync(string keyword)
        {
            return await _context.Set<User>()
                .Where(f => f.FullName.Contains(keyword))
                .ToListAsync();
        }

        public override async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                entity.isDeleted = true;
                entity.UpdatedAt = DateTime.UtcNow;
                _context.Entry(entity).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        public override async Task UpdateAsync(User entity)
        {
            var existingUser = await GetByIdAsync(entity.Id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with id {entity.Id} not found");
            }
            existingUser.UpdatedAt = DateTime.UtcNow;
            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUser(int id, UserAdminDTO user)
        {
            var existingUser = await GetByIdAsync(id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with id {id} not found");
            }

            // Cập nhật các thuộc tính từ DTO vào entity
            existingUser.FullName = user.FullName;
            existingUser.Email = user.Email;
            existingUser.isDeleted = user.isDeleted;
            existingUser.UpdatedAt = DateTime.UtcNow;
            _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task CreateUser(UserAdminDTO user)
        {
            var newUser = new User
            {
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = DateTime.UtcNow,
                isDeleted = user.isDeleted
            };
            await _context.Set<User>().AddAsync(newUser);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountAllUsers()
        {
            return await _context.Set<User>().CountAsync();
        }

        public async Task<PaginatedResponse<UserAdminDTO>> GetUserAdminWithPagination(int pageNumber, int pageSize, string? searchKeyword)
        {
            // IQueryable không thực thi ngay, nó chỉ xây dựng câu lệnh SQL
            var query = _context.Set<User>()
                // Thêm kiểm tra an toàn cho Title = null
                .Where(f => string.IsNullOrEmpty(searchKeyword)
                            || (f.FullName != null && f.FullName.Contains(searchKeyword)));
            var totalRecords = await query.CountAsync();
            var UserAdminDTOs = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserAdminDTO
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    isDeleted = u.isDeleted
                }).ToListAsync();

            return new PaginatedResponse<UserAdminDTO>
            {
                Data = UserAdminDTOs,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                CurrentPage = pageNumber
            };
        }
    }
}
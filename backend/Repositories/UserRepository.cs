using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
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

        public async Task<int> CountAllUsers()
        {
            return await _context.Set<User>().CountAsync();
        }

        public async Task<List<User>> GetUserAdminWithPagination(int pageNumber, int pageSize, string? searchKeyword)
        {
            var query = _context.Set<User>().AsQueryable();

            if (!string.IsNullOrEmpty(searchKeyword))
            {
                query = query.Where(u => u.FullName.Contains(searchKeyword));
            }

            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}
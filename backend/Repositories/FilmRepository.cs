using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
namespace MovieReviewApp.backend.Repositories
{
    public class FilmRepository : GenericRepository<Film>
    {
        public FilmRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Film>> GetAllAsyncUser()
        {
            return await _context.Set<Film>()
            .Where(f => !f.isDeleted)
            .ToListAsync();
        }
        
        public async Task<List<Film>> SearchByNameAsync(string keyword)
        {
            return await _context.Set<Film>()
                .Where(f => f.Title.Contains(keyword)) // admin thấy tất cả (kể cả bị xóa)
                .ToListAsync();
        }

        public async Task<List<Film>> SearchByNameUserAsync(string keyword)
        {
            return await _context.Set<Film>()
                .Where(f => f.Title.Contains(keyword) && !f.isDeleted) // user chỉ thấy film chưa xóa
                .ToListAsync();
        }


        public async Task<Film> GetByIdAsyncUser(int id)
        {
            var film = await _context.Set<Film>()
            .Where(f => f.Id == id && !f.isDeleted)
            .FirstOrDefaultAsync();
            return film;
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

        public override async Task UpdateAsync(Film entity)
        {
            var existingFilm = await GetByIdAsync(entity.Id);
            if (existingFilm == null)
            {
                throw new KeyNotFoundException($"Film with id {entity.Id} not found");
            }
            existingFilm.UpdatedAt = DateTime.UtcNow;
             _context.Entry(existingFilm).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
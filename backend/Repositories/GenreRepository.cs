using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
namespace MovieReviewApp.backend.Repositories
{
    public class GenreRepository : GenericRepository<Genre>
    {
        public GenreRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Genre>> GetAllAsyncExceptDeleted()
        {
            return await _context.Set<Genre>()
                .Where(g => !g.isDeleted)
                .ToListAsync();
        }

        public async Task<Genre> GetByIdAsyncExceptDeleted(int id)
        {
            var genre = await _context.Set<Genre>()
            .Where(g => g.Id == id && !g.isDeleted)
            .FirstOrDefaultAsync();
            return genre;
        }

        public async Task<List<Genre>> GetByNameAsync(string name)
        {
            return await _context.Set<Genre>()
                .Where(g => g.Name.Contains(name) && !g.isDeleted)
                .ToListAsync();
        }

        public async Task<List<Genre>> GetAllByNameAsync(string name)
        {
            return await _context.Set<Genre>()
                .Where(g => g.Name.Contains(name))
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

        public override async Task UpdateAsync(Genre entity)
        {
            var existingGenre = await GetByIdAsync(entity.Id);
            if (existingGenre == null)
            {
                throw new KeyNotFoundException($"Genre with id {entity.Id} not found");
            }
            _context.Entry(existingGenre).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
    
}
using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
namespace MovieReviewApp.backend.Repositories
{
    public class DirectorRepository : GenericRepository<Director>
    {
        public DirectorRepository(AppDbContext context) : base(context)
        {
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

        public override async Task UpdateAsync(Director entity)
        {
            var existingDirector = await GetByIdAsync(entity.Id);
            if (existingDirector == null)
            {
                throw new KeyNotFoundException($"Director with id {entity.Id} not found");
            }
            _context.Entry(existingDirector).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<List<Director>> GetAllByNameAsync(string name)
        {
            return await _context.Set<Director>()
                .Where(d => d.Name.Contains(name))
                .ToListAsync();
        }

        public async Task<List<Director>> GetByNameAsync(string name)
        {
            return await _context.Set<Director>()
                .Where(d => d.Name.Contains(name) && !d.isDeleted)
                .ToListAsync();
        }


    }
}
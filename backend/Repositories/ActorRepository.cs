using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
namespace MovieReviewApp.backend.Repositories
{
    public class ActorRepository : GenericRepository<Actor>
    {
        public ActorRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Actor>> GetAllExceptDeletedAsync()
        {
            return await _context.Set<Actor>()
                .Where(a => !a.isDeleted)
                .ToListAsync();
        }
        

        public async Task<List<Actor>> SearchByNameAsync(string name)
        {
            return await _context.Set<Actor>()
                .Where(a => !a.isDeleted && a.Name.Contains(name))
                .ToListAsync();
        }

        public async Task<List<Actor>> SearchByNameExceptDeletedAsync(string name)
        {
            return await _context.Set<Actor>()
                .Where(a => !a.isDeleted && a.Name.Contains(name))
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

        public override async Task UpdateAsync(Actor entity)
        {
            var existingActor = await GetByIdAsync(entity.Id);
            if (existingActor == null)
            {
                throw new KeyNotFoundException($"Actor with id {entity.Id} not found");
            }
            _context.Entry(existingActor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }

}
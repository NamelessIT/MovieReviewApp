using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
namespace MovieReviewApp.backend.Repositories
{
    public class ReviewRepository : GenericRepository<Review>
    {
        public ReviewRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<List<Review>> GetAllAsyncExceptDeleted()
        {
            return await _context.Set<Review>()
                .Where(r => !r.isDeleted)
                .ToListAsync();
        }
        
        public async Task<List<Review>> GetReviewsByFilmIdAsync(int filmId)
        {
            return await _context.Set<Review>()
                .Where(r => r.Films.Id == filmId && !r.isDeleted)
                .ToListAsync();
        }

        public async Task<List<Review>> GetReviewsByAccountIdAsync(int accountId)
        {
            return await _context.Set<Review>()
                .Where(r => r.Accounts.Id == accountId && !r.isDeleted)
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

        
        public override async Task UpdateAsync(Review entity)
        {
            var existingReview = await GetByIdAsync(entity.Id);
            if (existingReview == null)
            {
                throw new KeyNotFoundException($"User with id {entity.Id} not found");
            }
             _context.Entry(existingReview).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }

}   
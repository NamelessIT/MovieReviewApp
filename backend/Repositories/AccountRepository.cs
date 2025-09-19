using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
namespace MovieReviewApp.backend.Repositories
{
    public class AccountRepository : GenericRepository<Account>
    {
        public AccountRepository(AppDbContext context) : base(context)
        {
        }

        public  async Task<Account> GetByIdAsyncExceptDeleted(int id)
        {
            var account = await _context.Set<Account>()
            .Where(a => a.Id == id && !a.isDeleted)
            .FirstOrDefaultAsync();
            return account;
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

        
        public override async Task UpdateAsync(Account entity)
        {
            var existingUser = await GetByIdAsync(entity.Id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with id {entity.Id} not found");
            }
             _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }

}
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

        public async Task<int> CountAllReview()
        {
            return await _context.Set<Review>().CountAsync();
        }

        public async Task<List<FilmRatingDTO>> GetAverageRatings()
        {
            // 1. LEFT JOIN: EF Core tự động xử lý JOIN khi sử dụng Navigation Property
            // 2. GROUP BY: Nhóm theo MovieId và Title
            var result = await _context.Set<Review>()
                .GroupBy(r => new { r.MovieId, r.Films.Title })
                .Select(g => new FilmRatingDTO
                {
                    // 3. SELECT & AVG: Tính điểm trung bình và ánh xạ
                    MovieId = g.Key.MovieId,
                    Title = g.Key.Title,
                    AverageRating = g.Average(r => r.Rating)
                })
                // 4. ORDER BY: Sắp xếp theo điểm trung bình giảm dần (desc)
                .OrderByDescending(dto => dto.AverageRating)
                // lấy 7 bản ghi
                .Take(7)
                // 5. TO LIST: Thực thi truy vấn và trả về List
                .ToListAsync();
            return result;
        }
        
        public async Task<List<FilmReviewCountDTO>> GetFilmReviewCounts()
        {
            // 1. LEFT JOIN: EF Core tự động xử lý JOIN khi sử dụng Navigation Property
            // 2. GROUP BY: Nhóm theo MovieId và Title
            var result = await _context.Set<Film>()
                .Select(f => new FilmReviewCountDTO
                {
                    // 3. SELECT & AVG: Tính điểm trung bình và ánh xạ
                    Title = f.Title,
                    TotalReview = f.Reviews.Count()
                })
                // 4. ORDER BY: Sắp xếp theo điểm trung bình giảm dần (desc)
                .OrderByDescending(dto => dto.TotalReview)
                // lấy 7 bản ghi
                .Take(7)
                // 5. TO LIST: Thực thi truy vấn và trả về List
                .ToListAsync();
            return result;
        }
    }
}   
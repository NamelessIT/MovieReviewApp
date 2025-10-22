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
                .Where(r => r.Film.Id == filmId && !r.isDeleted)
                .ToListAsync();
        }

        public async Task<List<Review>> GetReviewsByAccountIdAsync(int accountId)
        {
            return await _context.Set<Review>()
                .Where(r => r.Account.Id == accountId && !r.isDeleted)
                .ToListAsync();
        }

        public async Task<Review?> GetReviewByAccountIdAndFilmIdAsync(int accountId, int filmId)
        {
            return await _context.Set<Review>()
                .FirstOrDefaultAsync(r => r.Account.Id == accountId && r.Film.Id == filmId && !r.isDeleted);
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

        // ✅ 1. Hàm tạo hoặc cập nhật rating
        public async Task<Review> CreateReviewAsyncRating(int accountId, int filmId, int rating)
        {
            if (rating < 1 || rating > 10)
                throw new ArgumentException("Rating must be between 1 and 10.");

            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.AccountId == accountId && r.MovieId == filmId);

            if (review != null)
            {
                review.Rating = rating;
                review.UpdatedAt = DateTime.Now;
            }
            else
            {
                review = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = rating,
                    Favorites = false,
                    Comment = string.Empty,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    isDeleted = false
                };
                await _context.Reviews.AddAsync(review);
            }

            await _context.SaveChangesAsync();
            return review;
        }

        // ✅ 2. Hàm tạo hoặc cập nhật favorites
        public async Task<Review> CreateReviewAsyncFavorites(int accountId, int filmId, bool favorites)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.AccountId == accountId && r.MovieId == filmId);

            if (review != null)
            {
                review.Favorites = favorites;
                review.UpdatedAt = DateTime.Now;
            }
            else
            {
                review = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = 0,
                    Favorites = favorites,
                    Comment = string.Empty,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    isDeleted = false
                };
                await _context.Reviews.AddAsync(review);
            }

            await _context.SaveChangesAsync();
            return review;
        }

        // ✅ 3. Hàm tạo hoặc cập nhật comment
        public async Task<Review> CreateReviewAsyncComment(int accountId, int filmId, string comment)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.AccountId == accountId && r.MovieId == filmId);

            if (review != null)
            {
                review.Comment = comment;
                review.UpdatedAt = DateTime.Now;
            }
            else
            {
                review = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = 0,
                    Favorites = false,
                    Comment = comment,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    isDeleted = false
                };
                await _context.Reviews.AddAsync(review);
            }

            await _context.SaveChangesAsync();
            return review;
        }

        // ✅ 4. Hàm tính điểm trung bình (bỏ qua rating = 0)
        public async Task<List<FilmRatingDTO>> GetAverageRatings()
        {
            var result = await _context.Reviews
                .Where(r => r.Rating > 0 && !r.isDeleted) // loại bỏ review có rating = 0 hoặc bị xóa
                .GroupBy(r => new { r.MovieId, r.Film.Title })
                .Select(g => new FilmRatingDTO
                {
                    MovieId = g.Key.MovieId,
                    Title = g.Key.Title,
                    AverageRating = g.Average(r => r.Rating)
                })
                .OrderByDescending(dto => dto.AverageRating)
                .Take(7)
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
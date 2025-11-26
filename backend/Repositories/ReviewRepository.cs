using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using backend.DTOs;
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

        // ✅ Lấy Review mới nhất theo AccountId + FilmId
        private async Task<Review?> GetLatestReviewAsync(int accountId, int filmId)
        {
            return await _context.Reviews
                .Where(r => r.AccountId == accountId && r.MovieId == filmId && !r.isDeleted)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();
        }
                // ✅ 4. Lấy review mới nhất (cho API /account/{accountId}/film/{filmId})
        public async Task<Review?> GetLatestReviewByAccountAndFilmAsync(int accountId, int filmId)
        {
            return await GetLatestReviewAsync(accountId, filmId);
        }

        public async Task<PaginatedResponse<ReviewAdminDTO>> GetReviewAdminWithPagination(int pageNumber, int pageSize, string? searchKeyword)
        {
            // IQueryable không thực thi ngay, nó chỉ xây dựng câu lệnh SQL
            // 1) Build base query and include navigation properties when projecting
            var baseQuery = _context.Set<Review>()
                .Where(r => r.Comment != null);

            // 2) Apply search if provided (search across film title, account name or comment)
            if (!string.IsNullOrEmpty(searchKeyword))
            {
                baseQuery = baseQuery.Where(r =>
                    (r.Film != null && r.Film.Title != null && r.Film.Title.Contains(searchKeyword))
                    || (r.Account != null && r.Account.Username.Contains(searchKeyword))
                    || (r.Comment != null && r.Comment.Contains(searchKeyword))
                );
            }

            // 3) Count total records for pagination
            var totalRecords = await baseQuery.CountAsync();

            // 4) Project to DTO (EF Core will translate navigation property access to JOINs)
            var data = await baseQuery
                .OrderByDescending(r => r.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ReviewAdminDTO
                {
                    Id = r.Id,
                    MovieId = r.MovieId,
                    MovieTitle = r.Film != null ? r.Film.Title : null,
                    AccountId = r.AccountId,
                    AccountName = r.Account != null ? r.Account.Username : null,
                    Rating = r.Rating,
                    Favorites = r.Favorites,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    isDeleted = r.isDeleted
                })
                .ToListAsync();

            return new PaginatedResponse<ReviewAdminDTO>
            {
                Data = data,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                CurrentPage = pageNumber
            };
        }

        // Lấy review (có comment) theo filmId theo dạng phân trang cho UI người dùng
        public async Task<PaginatedResponse<ReviewAdminDTO>> GetReviewsByFilmWithPagination(int filmId, int pageNumber, int pageSize)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            var baseQuery = _context.Set<Review>()
                .Where(r => r.MovieId == filmId && !r.isDeleted && r.Comment != null);

            var totalRecords = await baseQuery.CountAsync();

            var data = await baseQuery
                .OrderByDescending(r => r.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ReviewAdminDTO
                {
                    Id = r.Id,
                    MovieId = r.MovieId,
                    MovieTitle = r.Film != null ? r.Film.Title : null,
                    AccountId = r.AccountId,
                    AccountName = r.Account != null ? r.Account.Username : null,
                    Rating = r.Rating,
                    Favorites = r.Favorites,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    isDeleted = r.isDeleted
                })
                .ToListAsync();

            return new PaginatedResponse<ReviewAdminDTO>
            {
                Data = data,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                CurrentPage = pageNumber
            };
        }

        public override async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                entity.UpdatedAt = DateTime.UtcNow;
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

        // ✅ 1. Rating — tạo hoặc cập nhật trên review mới nhất
        public async Task<Review> CreateOrUpdateRatingAsync(int accountId, int filmId, int rating)
        {
            if (rating < 1 || rating > 10)
                throw new ArgumentException("Rating must be between 1 and 10.");

            var latestReview = await GetLatestReviewAsync(accountId, filmId);

            if (latestReview == null)
            {
                // ➕ Chưa có review nào, tạo mới
                latestReview = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = rating,
                    Favorites = false,
                    Comment = string.Empty,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                await _context.Reviews.AddAsync(latestReview);
            }
            else if (string.IsNullOrEmpty(latestReview.Comment))
            {
                // 🔁 Nếu review mới nhất chưa có comment → chỉ update rating
                latestReview.Rating = rating;
                latestReview.UpdatedAt = DateTime.Now;
            }
            else
            {
                // 🆕 Nếu review mới nhất đã có comment → tạo review mới, copy dữ liệu cũ
                var newReview = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = rating,
                    Favorites = latestReview.Favorites,
                    Comment = string.Empty,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                await _context.Reviews.AddAsync(newReview);
            }

            await _context.SaveChangesAsync();
            return latestReview ?? throw new Exception("Unexpected error saving review.");
        }

        // ✅ 2. Favorites — tạo hoặc cập nhật trên review mới nhất
        public async Task<Review> CreateOrUpdateFavoritesAsync(int accountId, int filmId, bool favorites)
        {
            var latestReview = await GetLatestReviewAsync(accountId, filmId);

            if (latestReview == null)
            {
                latestReview = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = 0,
                    Favorites = favorites,
                    Comment = string.Empty,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                await _context.Reviews.AddAsync(latestReview);
            }
            else if (string.IsNullOrEmpty(latestReview.Comment))
            {
                latestReview.Favorites = favorites;
                latestReview.CreatedAt = DateTime.Now;
                latestReview.UpdatedAt = DateTime.Now;
            }
            else
            {
                var newReview = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = latestReview.Rating,
                    Favorites = favorites,
                    Comment = string.Empty,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };
                await _context.Reviews.AddAsync(newReview);
            }

            await _context.SaveChangesAsync();
            return latestReview;
        }
        // ✅ 5. Lấy danh sách phim yêu thích (chỉ lấy review mới nhất theo MovieId + AccountId)
        public async Task<List<Review>> GetAllFavoritesReviewsAsync(int accountId)
        {
            // 1️⃣ Lấy review mới nhất của mỗi MovieId cho user này
            var latestReviews = await _context.Reviews
                .Where(r => r.AccountId == accountId && !r.isDeleted)
                .GroupBy(r => r.MovieId)
                .Select(g => g.OrderByDescending(r => r.CreatedAt).First())
                .ToListAsync();

            // 2️⃣ Chỉ giữ review có Favorites = true
            var favorites = latestReviews
                .Where(r => r.Favorites == true)
                .ToList();

            return favorites;
        }


        // ✅ 3. Comment — tạo hoặc cập nhật, nếu có comment mới thì luôn tạo bản ghi mới
        public async Task<Review> CreateOrUpdateCommentAsync(int accountId, int filmId, string comment)
        {
            var latestReview = await GetLatestReviewAsync(accountId, filmId);

            if (latestReview == null)
            {
                // ➕ Tạo mới
                var newReview = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = 0,
                    Favorites = false,
                    Comment = comment,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                await _context.Reviews.AddAsync(newReview);
            }
            else
            {
                // 🆕 Luôn tạo mới khi có comment mới
                var newReview = new Review
                {
                    AccountId = accountId,
                    MovieId = filmId,
                    Rating = latestReview.Rating,
                    Favorites = latestReview.Favorites,
                    Comment = comment,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };
                await _context.Reviews.AddAsync(newReview);
            }

            await _context.SaveChangesAsync();
            return await GetLatestReviewAsync(accountId, filmId)
                ?? throw new Exception("Error saving review comment.");
        }


        // ✅ 5. Tính điểm trung bình (chỉ lấy rating của review mới nhất mỗi AccountId)
        public async Task<List<FilmRatingDTO>> GetAverageRatings()
        {
            // 1. LEFT JOIN: EF Core tự động xử lý JOIN khi sử dụng Navigation Property
            // 2. GROUP BY: Nhóm theo MovieId và Title
            var result = await _context.Set<Review>()
                .GroupBy(r => new { r.MovieId, r.Film.Title })
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
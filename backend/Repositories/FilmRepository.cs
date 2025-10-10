using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.DTOs;

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
                .Where(f => f.Title.Contains(keyword))
                .ToListAsync();
        }

        public async Task<List<Film>> SearchByNameUserAsync(string keyword)
        {
            return await _context.Set<Film>()
                .Where(f => f.Title.Contains(keyword) && !f.isDeleted)
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

        // 🟢 Lấy danh sách film mới nhất (CreatedAt giảm dần)
        public async Task<List<Film>> GetNewestFilmsAsync(int limit = 10)
        {
            return await _context.Set<Film>()
                .Where(f => !f.isDeleted)
                .OrderByDescending(f => f.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }

        // 🟢 Lấy danh sách film được xếp hạng cao nhất (nếu không có review thì trả về rỗng)
        public async Task<List<Film>> GetTopRatedFilmsAsync(int limit = 10)
        {
            return await _context.Set<Film>()
                .Where(f => !f.isDeleted && f.Reviews.Any()) // chỉ lấy film có review
                .OrderByDescending(f => f.Reviews.Average(r => r.Rating))
                .Take(limit)
                .ToListAsync();
        }

        public async Task<int> CountAllFilm()
        {
            return await _context.Set<Film>().CountAsync();
        }

        public async Task<PaginatedResponse<FilmAdminDTO>> GetFilmAdminWithPagination(int pageNumber, int pageSize)
        {
            var totalFilms = await CountAllFilm();
            var filmAdminDTO = await _context.Set<Film>()
            // 1. Join với bảng Director
                .Include(f => f.Director)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                // 2. Chuyển đổi sang DTO
                .Select(f => new FilmAdminDTO
                {
                    Id = f.Id,
                    Title = f.Title,
                    ReleaseDate = f.ReleaseDate,
                    DirectorId = f.DirectorId,
                    DirectorName = f.Director != null ? f.Director.Name : "Unknown",
                    Synopsis = f.Synopsis,
                    PosterUrl = f.PosterUrl,
                    TrailerUrl = f.TrailerUrl,
                    CreatedAt = f.CreatedAt,
                    UpdatedAt = f.UpdatedAt,
                    isDeleted = f.isDeleted
                })
                 .ToListAsync();
            return new PaginatedResponse<FilmAdminDTO>
            {
                Data = filmAdminDTO,
                TotalPages = (int)Math.Ceiling((double)totalFilms / pageSize),
                CurrentPage = pageNumber
            };
        }
    }
}

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
    // Lấy dữ liệu phim theo id bao gồm thể loại và diễn viên
        public async Task<Film?> GetFilmWithDetailsByIdAsync(int id)
        {
            var film = await _context.Set<Film>()
                .Include(f => f.FilmGenres)
                    .ThenInclude(fg => fg.Genre)
                .Include(f => f.FilmActors)
                    .ThenInclude(fa => fa.Actor)
                .FirstOrDefaultAsync(f => f.Id == id);

            return film;
        }
        public async Task UpdateDetailsFilmAsync(int id, FilmResponseDTO film, string? newPosterUrl)
        {
            var existingFilm = await GetFilmWithDetailsByIdAsync(id);
            if (existingFilm == null)
            {
                throw new KeyNotFoundException($"Film with id {film.Id} not found");
            }
            // Xóa các liên ket hiện tại trong FilmGenres và FilmActors
            existingFilm.FilmGenres.Clear();
            existingFilm.FilmActors.Clear();
            // Cập nhật các thuộc tính cơ bản
            if (film.Genres != null)
            {
                foreach (var genre in film.Genres)
                {
                    existingFilm.FilmGenres.Add(new FilmGenre { GenreId = genre.Id });
                }
            }
            if (film.Actors != null)
            {
                foreach (var actor in film.Actors)
                {
                    existingFilm.FilmActors.Add(new FilmActor { ActorId = actor.Id });
                }
            }
            // Cập nhật các thuộc tính cơ bản
            existingFilm.Title = film.Title;
            existingFilm.ReleaseDate = film.ReleaseDate;
            existingFilm.DirectorId = film.DirectorId;
            existingFilm.TrailerUrl = film.TrailerUrl;
            existingFilm.UpdatedAt = DateTime.UtcNow;
            // Cập nhật PosterUrl nếu có
            if (!string.IsNullOrEmpty(newPosterUrl))
            {
                existingFilm.PosterUrl = newPosterUrl;
            }
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
                .Where(f => !f.isDeleted 
                    && f.Reviews.Any() 
                    && f.Reviews.Average(r => r.Rating) > 0) // ✅ chỉ lấy film có rating trung bình > 0
                .OrderByDescending(f => f.Reviews.Average(r => r.Rating))
                .Take(limit)
                .ToListAsync();
        }

        public async Task<int> CountAllFilm()
        {
            return await _context.Set<Film>().CountAsync();
        }

        public async Task<PaginatedResponse<FilmAdminDTO>> GetFilmAdminWithPagination(int pageNumber, int pageSize, string? searchKeyword)
        {
            // var totalFilms = await CountAllFilm();
            // IQueryable không thực thi ngay, nó chỉ xây dựng câu lệnh SQL
            var query = _context.Set<Film>()
                // Thêm kiểm tra an toàn cho Title = null
                .Where(f => string.IsNullOrEmpty(searchKeyword)
                            || (f.Title != null && f.Title.Contains(searchKeyword)));
            var totalRecords = await query.CountAsync();
            // Thực thi truy vấn với phân trang và chuyển đổi sang DTO
            var filmAdminDTO = await query
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
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                CurrentPage = pageNumber
            };
        }
        // Thêm film kèm thể loại và diễn viên
        public async Task<Film> AddFilmWithDetailsAsync(FilmResponseDTO dto)
        {
            // 1. Tạo đối tượng Film chính từ DTO
            var newFilm = new Film
            {
                Title = dto.Title,
                ReleaseDate = dto.ReleaseDate,
                DirectorId = dto.DirectorId,
                Synopsis = dto.Synopsis,
                PosterUrl = dto.PosterUrl,
                TrailerUrl = dto.TrailerUrl,
                CreatedAt = DateTime.UtcNow,
                isDeleted = false
            };

            // 2. Thêm các FilmGenre vào navigation property
            if (dto.Genres != null)
            {
                foreach (var genreId in dto.Genres)
                {
                    newFilm.FilmGenres.Add(new FilmGenre { GenreId = genreId.Id });
                }
            }

            // 3. Thêm các FilmActor vào navigation property
            if (dto.Actors != null)
            {
                foreach (var actorId in dto.Actors)
                {
                    newFilm.FilmActors.Add(new FilmActor { ActorId = actorId.Id });
                }
            }

            // 4. Thêm vào context và lưu lại
            // EF Core sẽ tự động tạo bản ghi ở cả 3 bảng (films, film_genres, film_actors)
            await _context.Set<Film>().AddAsync(newFilm);
            await _context.SaveChangesAsync();

            return newFilm;
        }
    }
}

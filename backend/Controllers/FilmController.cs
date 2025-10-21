using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs;
using backend.Services;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/film")]
    public class FilmController : ControllerBase
    {
        private readonly FilmRepository _filmRepository;
        private readonly GenreRepository _GenreRepository;
        private readonly ActorRepository _ActorRepository;
        private readonly CloudinaryUploaderService _uploaderService;
        public FilmController(FilmRepository filmRepository, GenreRepository genreRepository, ActorRepository actorRepository, CloudinaryUploaderService uploaderService)
        {
            _filmRepository = filmRepository;
            _GenreRepository = genreRepository;
            _ActorRepository = actorRepository;
            _uploaderService = uploaderService;
        }

        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllFilms()
        {
            var films = await _filmRepository.GetAllAsync();
            return Ok(new { message = "Get all film successfully", data = films ?? [], status = 200 });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFilmsUser()
        {
            var films = await _filmRepository.GetAllAsyncUser();
            return Ok(new { message = "Get all film user successfully", data = films ?? [], status = 200 });
        }

        [HttpGet("admin/count")]
        public async Task<IActionResult> GetCountAllUsers()
        {
            var total = await _filmRepository.CountAllFilm();
            return Ok(new { message = "Get total quantity film successfully", data = total, status = 200 });
        }

        // [Authorize(Roles = "admin")]
        [HttpGet("search/admin/{keyword}")]
        public async Task<IActionResult> SearchFilmsAdmin(int pageNumber, int pageSize, string keyword)
        {
            var films = await _filmRepository.GetFilmAdminWithPagination(pageNumber, pageSize, keyword);
            return Ok(new { message = "Search films (admin) successfully", data = films ?? null, status = 200 });
        }

        // User: tìm kiếm film theo tên
        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> SearchFilmsUser(string keyword)
        {
            var films = await _filmRepository.SearchByNameUserAsync(keyword);
            return Ok(new { message = "Search films (user) successfully", data = films ?? [], status = 200 });
        }
        // [Authorize(Roles = "admin")]
        [HttpGet("admin/{id}")]
        public async Task<IActionResult> GetFilmById(int id)
        {
            var film = await _filmRepository.GetByIdAsync(id);
            if (film == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get all film successfully", data = film, status = 200 });
        }
        // có dữ liệu diễn viên và thể loại
        [HttpGet("admin/detail/{id}")]
        public async Task<IActionResult> GetFilmDetailsById(int id)
        {
            var response = await _filmRepository.GetFilmWithDetailsByIdAsync(id);
            var filmResponse = new FilmResponseDTO
            {
                Title = response.Title,
                ReleaseDate = response.ReleaseDate,
                DirectorId = response.DirectorId,
                Synopsis = response.Synopsis,
                PosterUrl = response.PosterUrl,
                TrailerUrl = response.TrailerUrl,
                Genres = response.FilmGenres.Select(fg => new GenreDTO { Id = fg.GenreId, Name = fg.Genre.Name }).ToList(),
                Actors = response.FilmActors.Select(fa => new ActorDTO { Id = fa.ActorId, Name = fa.Actor.Name }).ToList()
            };
            return Ok(new { message = "Get all film successfully", data = filmResponse, status = 200 });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFilmByIdByUser(int id)
        {
            var film = await _filmRepository.GetByIdAsyncUser(id);
            if (film == null)
            {
                var errorResponse = new { message = "Dữ liệu đầu vào không hợp lệ." };
                return NotFound(errorResponse);
            }
            return Ok(new { message = "Get all film successfully", data = film, status = 200 });
        }

        [HttpPost]
        public async Task<IActionResult> CreateFilm([FromForm] FilmResponseDTO film)
        {
            if (film == null)
            {
                return BadRequest();
            }
            string? newPosterUrl = null;
            // 1. Tải tệp lên Cloudinary nếu người dùng gửi lên
            if (film.PosterFile != null && film.PosterFile.Length > 0)
            {
                // Giả sử _uploaderService đã được inject vào controller
                newPosterUrl = await _uploaderService.UploadFileAsync(film.PosterFile, "film-posters");
                if (string.IsNullOrEmpty(newPosterUrl))
                {
                    return BadRequest(new { message = "Tải ảnh poster thất bại." });
                }
            }
            film.PosterUrl = newPosterUrl;
            // Lưu dữ liệu vào cơ sở dữ liệu
            var createdEntity = await _filmRepository.AddFilmWithDetailsAsync(film);
            // Chuẩn bị dữ liệu trả về
            var response = await _filmRepository.GetFilmWithDetailsByIdAsync(createdEntity.Id);
            if (response == null) {
            return StatusCode(500, new { message = "Không thể truy xuất phim vừa tạo." });
        }
            var FilmCreated = new FilmResponseDTO
            {
                Title = response.Title,
                ReleaseDate = response.ReleaseDate,
                DirectorId = response.DirectorId,
                Synopsis = response.Synopsis,
                PosterUrl = response.PosterUrl,
                TrailerUrl = response.TrailerUrl,
                // chỉ lấy các thuộc tính Id và Name không lấy toàn bộ đối tượng có thuộc tính điều hướng 
                Genres = response.FilmGenres.Select(fg => new GenreDTO { Id = fg.GenreId, Name = fg.Genre.Name }).ToList(),
                Actors = response.FilmActors.Select(fa => new ActorDTO { Id = fa.ActorId, Name = fa.Actor.Name }).ToList()
            };
            return CreatedAtAction(nameof(GetFilmById), new { id = FilmCreated.Id }, FilmCreated);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDetailsFilm(int id, [FromForm] FilmResponseDTO film)
        {
            try
            {
                if (film == null)
                {
                    return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
                }
                string? newPosterUrl = null;
                // 1. Tải tệp lên Cloudinary nếu người dùng gửi lên
                if (film.PosterFile != null && film.PosterFile.Length > 0)
                {
                    // Giả sử _uploaderService đã được inject vào controller
                    newPosterUrl = await _uploaderService.UploadFileAsync(film.PosterFile, "film-posters");
                    if (string.IsNullOrEmpty(newPosterUrl))
                    {
                        return BadRequest(new { message = "Tải ảnh poster thất bại." });
                    }
                }    
                await _filmRepository.UpdateDetailsFilmAsync(id, film, newPosterUrl);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi cập nhật film.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFilm(int id)
        {
            var existingFilm = await _filmRepository.GetByIdAsync(id);
            if (existingFilm == null)
            {
                return NotFound();
            }
            await _filmRepository.DeleteAsync(id);
            return NoContent();
        }

        // 🟢 API: Lấy danh sách film mới nhất
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewestFilms([FromQuery] int limit = 10)
        {
            var films = await _filmRepository.GetNewestFilmsAsync(limit);
            return Ok(new { message = "Get newest films successfully", data = films ?? [], status = 200 });
        }

        // 🟢 API: Lấy danh sách film có rating cao nhất, fallback nếu rỗng
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedFilms([FromQuery] int limit = 10)
        {
            var films = await _filmRepository.GetTopRatedFilmsAsync(limit);

            // Nếu không có film nào có review -> fallback sang newest
            if (films == null || !films.Any())
            {
                films = await _filmRepository.GetNewestFilmsAsync(limit);
                return Ok(new
                {
                    message = "No top-rated films found. Returning newest films instead.",
                    data = films ?? [],
                    status = 200
                });
            }

            return Ok(new
            {
                message = "Get top rated films successfully",
                data = films ?? [],
                status = 200
            });
        }
        [HttpGet("admin/pagination")]
        public async Task<IActionResult> GetFilmsWithPagination([FromQuery] int pageNumber, [FromQuery] int pageSize,[FromQuery] string? searchKeyword)
        {
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { message = "Invalid pagination parameters.", status = 400 });
            }

            var films = await _filmRepository.GetFilmAdminWithPagination(pageNumber, pageSize, searchKeyword);
            return Ok(new { message = "Get films with pagination successfully", data = films ?? null, status = 200 });
        }
    }
}
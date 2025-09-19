using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;

namespace MovieReviewApp.backend.Repositories
{
    public class FilmGenreRepository
    {
        private readonly AppDbContext _context;

        public FilmGenreRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<FilmGenre>> GetByFilmIdAsync(int filmId)
        {
            return await _context.Set<FilmGenre>()
                .Where(fg => fg.FilmId == filmId)
                .ToListAsync();
        }

        public async Task<List<FilmGenre>> GetByGenreIdAsync(int genreId)
        {
            return await _context.Set<FilmGenre>()
                .Where(fg => fg.GenreId == genreId)
                .ToListAsync();
        }

        public async Task<FilmGenre?> GetByFilmAndGenreAsync(int filmId, int genreId)
        {
            return await _context.Set<FilmGenre>()
                .FirstOrDefaultAsync(fg => fg.FilmId == filmId && fg.GenreId == genreId);
        }

        public async Task<bool> ExistsAsync(int filmId, int genreId)
        {
            return await _context.Set<FilmGenre>()
                .AnyAsync(fg => fg.FilmId == filmId && fg.GenreId == genreId);
        }

        public async Task<FilmGenre?> CreateAsync(int filmId, int genreId)
        {
            if (await ExistsAsync(filmId, genreId))
                return null;

            var entity = new FilmGenre
            {
                FilmId = filmId,
                GenreId = genreId,
                Film = await _context.Films.FindAsync(filmId) ?? throw new Exception("Film not found"),
                Genre = await _context.Genres.FindAsync(genreId) ?? throw new Exception("Genre not found")
            };

            _context.Set<FilmGenre>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteByFilmIdAsync(int filmId)
        {
            var entities = await _context.Set<FilmGenre>()
                .Where(fg => fg.FilmId == filmId)
                .ToListAsync();

            if (!entities.Any()) return false;

            _context.Set<FilmGenre>().RemoveRange(entities);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByGenreIdAsync(int genreId)
        {
            var entities = await _context.Set<FilmGenre>()
                .Where(fg => fg.GenreId == genreId)
                .ToListAsync();

            if (!entities.Any()) return false;

            _context.Set<FilmGenre>().RemoveRange(entities);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByFilmAndGenreAsync(int filmId, int genreId)
        {
            var entity = await GetByFilmAndGenreAsync(filmId, genreId);
            if (entity == null) return false;

            _context.Set<FilmGenre>().Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

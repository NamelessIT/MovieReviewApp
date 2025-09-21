using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;

namespace MovieReviewApp.backend.Repositories
{
    public class FilmDirectorRepository
    {
        private readonly AppDbContext _context;

        public FilmDirectorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<FilmDirector>> GetByFilmIdAsync(int filmId)
        {
            return await _context.Set<FilmDirector>()
                .Where(fd => fd.FilmId == filmId)
                .ToListAsync();
        }

        public async Task<List<FilmDirector>> GetByDirectorIdAsync(int directorId)
        {
            return await _context.Set<FilmDirector>()
                .Where(fd => fd.DirectorId == directorId)
                .ToListAsync();
        }

        public async Task<FilmDirector?> GetByFilmAndDirectorAsync(int filmId, int directorId)
        {
            return await _context.Set<FilmDirector>()
                .FirstOrDefaultAsync(fd => fd.FilmId == filmId && fd.DirectorId == directorId);
        }

        public async Task<bool> ExistsAsync(int filmId, int directorId)
        {
            return await _context.Set<FilmDirector>()
                .AnyAsync(fd => fd.FilmId == filmId && fd.DirectorId == directorId);
        }

        public async Task<FilmDirector?> CreateAsync(int filmId, int directorId)
        {
            if (await ExistsAsync(filmId, directorId))
                return null;

            var entity = new FilmDirector
            {
                FilmId = filmId,
                DirectorId = directorId,
                Film = await _context.Films.FindAsync(filmId) ?? throw new Exception("Film not found"),
                Director = await _context.Directors.FindAsync(directorId) ?? throw new Exception("Director not found")
            };

            _context.Set<FilmDirector>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteByFilmIdAsync(int filmId)
        {
            var entities = await _context.Set<FilmDirector>()
                .Where(fd => fd.FilmId == filmId)
                .ToListAsync();

            if (!entities.Any()) return false;

            _context.Set<FilmDirector>().RemoveRange(entities);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByDirectorIdAsync(int directorId)
        {
            var entities = await _context.Set<FilmDirector>()
                .Where(fd => fd.DirectorId == directorId)
                .ToListAsync();

            if (!entities.Any()) return false;

            _context.Set<FilmDirector>().RemoveRange(entities);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByFilmAndDirectorAsync(int filmId, int directorId)
        {
            var entity = await GetByFilmAndDirectorAsync(filmId, directorId);
            if (entity == null) return false;

            _context.Set<FilmDirector>().Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

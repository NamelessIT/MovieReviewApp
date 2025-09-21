using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieReviewApp.backend.Data;
using MovieReviewApp.backend.Models;

namespace MovieReviewApp.backend.Repositories
{
    public class FilmActorRepository : GenericRepository<FilmActor>
    {
        private readonly AppDbContext _context;

        public FilmActorRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        // Lấy tất cả bản ghi FilmActor theo FilmId
        public async Task<List<FilmActor>> GetByFilmIdAsync(int filmId)
        {
            return await _context.Set<FilmActor>()
                .Where(fa => fa.FilmId == filmId)
                .ToListAsync();
        }

        // Lấy tất cả bản ghi FilmActor theo ActorId
        public async Task<List<FilmActor>> GetByActorIdAsync(int actorId)
        {
            return await _context.Set<FilmActor>()
                .Where(fa => fa.ActorId == actorId)
                .ToListAsync();
        }

        // Kiểm tra tồn tại theo FilmId + ActorId
        public async Task<bool> ExistsAsync(int filmId, int actorId)
        {
            return await _context.Set<FilmActor>()
                .AnyAsync(fa => fa.FilmId == filmId && fa.ActorId == actorId);
        }

        // Tạo mới (nếu chưa tồn tại)
        // Trả về entity nếu tạo thành công, null nếu đã tồn tại
        public async Task<FilmActor?> CreateAsync(int filmId, int actorId)
        {
            if (await ExistsAsync(filmId, actorId))
                return null;

            var entity = new FilmActor
            {
            FilmId = filmId,
            ActorId = actorId,
            Film = await _context.Films.FindAsync(filmId) 
                ?? throw new Exception("Film not found"),
            Actor = await _context.Actors.FindAsync(actorId) 
                    ?? throw new Exception("Actor not found")
            };


            _context.Set<FilmActor>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // Lấy theo FilmId + ActorId (hoặc null nếu không tồn tại)
        public async Task<FilmActor?> GetByFilmIdAndActorIdAsync(int filmId, int actorId)
        {
            return await _context.Set<FilmActor>()
                .FirstOrDefaultAsync(fa => fa.FilmId == filmId && fa.ActorId == actorId);
        }

        // Xóa tất cả bản ghi theo FilmId (physical delete)
        public async Task DeleteByFilmIdAsync(int filmId)
        {
            var list = await _context.Set<FilmActor>()
                .Where(fa => fa.FilmId == filmId)
                .ToListAsync();

            if (list.Count == 0) return;

            _context.Set<FilmActor>().RemoveRange(list);
            await _context.SaveChangesAsync();
        }

        // Xóa tất cả bản ghi theo ActorId (physical delete)
        public async Task DeleteByActorIdAsync(int actorId)
        {
            var list = await _context.Set<FilmActor>()
                .Where(fa => fa.ActorId == actorId)
                .ToListAsync();

            if (list.Count == 0) return;

            _context.Set<FilmActor>().RemoveRange(list);
            await _context.SaveChangesAsync();
        }

        // Xóa theo FilmId + ActorId (physical delete). Trả về true nếu xóa thành công.
        public async Task<bool> DeleteByFilmIdAndActorIdAsync(int filmId, int actorId)
        {
            var entity = await GetByFilmIdAndActorIdAsync(filmId, actorId);
            if (entity == null) return false;

            _context.Set<FilmActor>().Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

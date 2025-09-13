using Microsoft.EntityFrameworkCore;
using MovieReviewApp.backend.Models;
// using MovieReviewApp.backend.Models;
namespace MovieReviewApp.Data
{
    public class AppDbContext : DbContext
    { 
    public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }
    // Thêm các DbSet cho mỗi class model
    public DbSet<User> Users { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<Film> Films { get; set; }
    public DbSet<Director> Directors { get; set; }
    public DbSet<Actor> Actors { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Review> Reviews { get; set; }

    // Các DbSet cho các bảng trung gian của mối quan hệ nhiều-nhiều
    public DbSet<FilmGenre> FilmGenres { get; set; }
    public DbSet<FilmActor> FilmActors { get; set; }
    public DbSet<FilmDirector> FilmDirectors { get; set; }

    // Phương thức OnModelCreating để cấu hình các mối quan hệ
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Cấu hình khóa chính kép cho các bảng trung gian
        modelBuilder.Entity<FilmGenre>()
            .HasKey(mg => new { mg.FilmId, mg.GenreId });

        modelBuilder.Entity<FilmActor>()
            .HasKey(ma => new { ma.FilmId, ma.ActorId });
            
        modelBuilder.Entity<FilmDirector>()
            .HasKey(md => new { md.FilmId, md.DirectorId });
            
        // Cấu hình các mối quan hệ nhiều-nhiều bằng cách sử dụng bảng trung gian
        modelBuilder.Entity<FilmGenre>()
            .HasOne(fg => fg.Film)
            .WithMany(f => f.FilmGenres)
            .HasForeignKey(fg => fg.FilmId);

        modelBuilder.Entity<FilmGenre>()
            .HasOne(fg => fg.Genre)
            .WithMany(g => g.FilmGenres)
            .HasForeignKey(mg => mg.GenreId);
            
        modelBuilder.Entity<FilmActor>()
            .HasOne(ma => ma.Film)
            .WithMany(m => m.FilmActors)
            .HasForeignKey(ma => ma.FilmId);

        modelBuilder.Entity<FilmActor>()
            .HasOne(ma => ma.Actor)
            .WithMany(a => a.FilmActors)
            .HasForeignKey(ma => ma.ActorId);
            
        modelBuilder.Entity<FilmDirector>()
            .HasOne(md => md.Film)
            .WithMany(m => m.FilmDirectors)
            .HasForeignKey(md => md.FilmId);

        modelBuilder.Entity<FilmDirector>()
            .HasOne(md => md.Director)
            .WithMany(m => m.FilmDirectors)
            .HasForeignKey(md => md.DirectorId);
            
        // Cấu hình mối quan hệ 1-1 giữa User và Account
        modelBuilder.Entity<Account>()
            .HasOne(a => a.User)
            .WithOne(u => u.Account)
            .HasForeignKey<Account>(a => a.UserId);

        base.OnModelCreating(modelBuilder);
    }

    } 
}

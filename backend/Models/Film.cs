using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MovieReviewApp.backend.Models
{
    [Table("films")]
    public class Film
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int? DirectorId { get; set; }
        public string? Synopsis { get; set; }
        public string? PosterUrl { get; set; }
        public string? TrailerUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public bool isDeleted { get; set; } = false;

        // Navigation property for the many-to-many relationships
        public List<FilmGenre> FilmGenres { get; set; } = [];
        public List<FilmActor> FilmActors { get; set; } = [];
        public List<FilmDirector> FilmDirectors { get; set; } = [];
        public List<Review> Reviews { get; set; } = [];

        // Navigation property for the one-to-many relationship with Director (optional)
        public Director? Director { get; set; }
    }
}
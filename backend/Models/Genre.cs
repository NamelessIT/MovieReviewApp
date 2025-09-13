using System.ComponentModel.DataAnnotations;

namespace MovieReviewApp.backend.Models
{
    public class Genre
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }

        // Navigation property for the many-to-many relationship
        public List<FilmGenre> FilmGenres { get; set; } = [];
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieReviewApp.backend.Models
{
    public class Actor
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Bio { get; set; }
        public bool isDeleted { get; set; } = false;

        // Navigation property for the many-to-many relationship
        public List<FilmActor> FilmActors { get; set; } = [];
    }
}
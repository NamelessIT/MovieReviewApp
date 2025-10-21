using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MovieReviewApp.backend.Models
{
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Khóa ngoại tới Account
        [ForeignKey(nameof(Account))]
        public int AccountId { get; set; }

        // Khóa ngoại tới Film
        [ForeignKey(nameof(Film))]
        public int MovieId { get; set; }

        public int Rating { get; set; }
        public bool? Favorites { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool isDeleted { get; set; } = false;

        // Navigation properties
        public virtual Account Account { get; set; } = null!;
        public virtual Film Film { get; set; } = null!;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace MovieReviewApp.backend.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Email { get; set; }
        public required string FullName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool isDeleted { get; set; } = false;

        // Navigation property for the one-to-one relationship with Account
        public Account? Account { get; set; }

       
    }
}
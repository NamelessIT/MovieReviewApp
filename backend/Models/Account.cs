using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace MovieReviewApp.backend.Models
{
    [Table("account")]
    public class Account
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required int UserId { get; set; }
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; }
        public bool isDeleted { get; set; } = false;

        // Navigation property for the one-to-one relationship with User
        public User? User { get; set; }

        // Navigation property for the one-to-many relationship with Reviews
        public List<Review>? Review { get; set; }
         // Navigation property for the one-to-many relationship with RefeshToken
        public List<RefeshToken>? RefeshTokens { get; set; } = new List<RefeshToken>();
    }
}
using System.ComponentModel.DataAnnotations;
namespace backend.DTOs
{
    public class Register
    {
        [Required]
        public required string Fullname { get; set; }
        [EmailAddress]
        public required string? Email { get; set; }
        public required string? Password { get; set; }
    }
}
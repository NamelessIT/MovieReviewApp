using System.ComponentModel.DataAnnotations;
namespace backend.DTOs
{
    public class RegisterDTO
    {
        public int UserId { get; set; }
        [Required]
        public required string UserName { get; set; }
        public required string? Password { get; set; }
    }
}
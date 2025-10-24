using MovieReviewApp.backend.Models;

namespace backend.DTOs
{
    public class AccountAdminDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string UserName { get; set; }
        public required string Role { get; set; }
        public bool isDeleted { get; set; }
    }
}
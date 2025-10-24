namespace backend.DTOs
{
    public class UserAdminDTO
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public required string FullName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}
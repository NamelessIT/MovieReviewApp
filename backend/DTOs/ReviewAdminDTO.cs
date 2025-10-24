namespace backend.DTOs
{
    public class ReviewAdminDTO
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string? MovieTitle { get; set; }
        public int AccountId { get; set; }
        public string? AccountName { get; set; }
        public int Rating { get; set; }
        public bool? Favorites { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}
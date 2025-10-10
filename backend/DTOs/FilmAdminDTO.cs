namespace backend.DTOs
{
    public class FilmAdminDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int? DirectorId { get; set; }
        public string? DirectorName { get; set; }
        public string? Synopsis { get; set; }
        public string? PosterUrl { get; set; }
        public string? TrailerUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}
namespace backend.DTOs
{
    public class FilmResponseDTO
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int? DirectorId { get; set; }
        public string? Synopsis { get; set; }
        public string? PosterUrl { get; set; }
        public IFormFile? PosterFile { get; set; }
        public string? TrailerUrl { get; set; }

        // Mảng chứa các ID
        public List<GenreDTO> Genres { get; set; } = new();
        public List<ActorDTO> Actors { get; set; } = new();
    }
}
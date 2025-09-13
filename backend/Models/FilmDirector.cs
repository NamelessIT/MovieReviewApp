namespace MovieReviewApp.backend.Models
{
    public class FilmDirector
    {
        public int FilmId { get; set; }
        public int DirectorId { get; set; }

        public required Film Film { get; set; }
        public required Director Director { get; set; }
    }
}
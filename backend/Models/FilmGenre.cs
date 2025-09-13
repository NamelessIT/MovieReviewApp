namespace MovieReviewApp.backend.Models
{
    public class FilmGenre
    {
        public int FilmId { get; set; }
        public int GenreId { get; set; }

        public required Film Film { get; set; }
        public required Genre Genre { get; set; }
    }
}
namespace backend.DTOs.Review
{
    public class RatingRequest
    {
        public int AccountId { get; set; }
        public int FilmId { get; set; }
        public int Rating { get; set; }
    }

    public class FavoritesRequest
    {
        public int AccountId { get; set; }
        public int FilmId { get; set; }
        public bool Favorites { get; set; }
    }

    public class CommentRequest
    {
        public int AccountId { get; set; }
        public int FilmId { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}

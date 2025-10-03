public class FilmRatingDTO
{
    public required string Title { get; set; }
    public int MovieId { get; set; }
    public double AverageRating { get; set; } // Alias 'a' trong truy vấn SQL của bạn
}

namespace MovieReviewApp.backend.Models
{
    public class FilmActor
    {
        public int FilmId { get; set; }
        public int ActorId { get; set; }

        public required Film Film { get; set; }
        public required Actor Actor { get; set; }
    }
}
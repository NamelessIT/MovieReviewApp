import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Header } from "../../components/user/header"
import { Footer } from "../../components/user/footer"
import { Star, Calendar, Play, Heart, User, MessageCircle } from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState([])
  const [showTrailer, setShowTrailer] = useState(false)

  // For demo - replace with actual auth
  const currentAccountId = 1 // Replace with actual logged-in user ID

  useEffect(() => {
    fetchMovieDetails()
    fetchReviews()
  }, [id])

  const fetchMovieDetails = async () => {
    setLoading(true)
    try {
      // Get film details
      const filmRes = await axios.get(`http://localhost:5003/api/Film/${id}`)
      const film = filmRes.data.data

      // Get genres
      const genreRes = await axios.get(`http://localhost:5003/api/FilmGenre/GetByFilmId/${id}`)
      const filmGenres = genreRes.data.data || []
      
      const allGenresRes = await axios.get("http://localhost:5003/api/genre/all-exist")
      const allGenres = allGenresRes.data.data || []
      
      const genres = filmGenres
        .map((fg) => {
          const g = allGenres.find((gg) => gg.id === fg.genreId)
          return g ? g.name : null
        })
        .filter(Boolean)

      // Get actors
      const actorRes = await axios.get(`http://localhost:5003/api/FilmActor/GetByFilmId/${id}`)
      const filmActors = actorRes.data.data || []
      
      const actors = await Promise.all(
        filmActors.map(async (fa) => {
          const actorDetail = await axios.get(`http://localhost:5003/api/Actor/${fa.actorId}`)
          return actorDetail.data.data
        })
      )

      // Get directors
      const directorRes = await axios.get(`http://localhost:5003/api/FilmDirector/GetByFilmId/${id}`)
      const filmDirectors = directorRes.data.data || []
      
      const directors = await Promise.all(
        filmDirectors.map(async (fd) => {
          const directorDetail = await axios.get(`http://localhost:5003/api/Director/${fd.directorId}`)
          return directorDetail.data.data
        })
      )

      // Get average rating
      const ratingRes = await axios.get("http://localhost:5003/api/Review/admin/GetAverageRatings")
      const ratingData = ratingRes?.data?.data || []
      const filmRatingObj = ratingData.find((r) => r.movieId === parseInt(id))
      const averageRating = filmRatingObj ? filmRatingObj.averageRating : 0

      // Get review count
      const reviewCountRes = await axios.get("http://localhost:5003/api/Review/admin/GetFilmReviewCounts")
      const reviewCountData = reviewCountRes?.data?.data || []
      const filmReviewObj = reviewCountData.find((r) => r.movieId === parseInt(id))
      const reviewCount = filmReviewObj ? filmReviewObj.reviewCount : 0

      setMovie({
        id: film.id,
        title: film.title,
        image: film.posterUrl,
        synopsis: film.synopsis,
        releaseDate: film.releaseDate,
        year: film.releaseDate ? new Date(film.releaseDate).getFullYear() : new Date(film.createdAt).getFullYear(),
        genres,
        actors,
        directors,
        rating: averageRating,
        reviewCount,
        trailerUrl: film.trailerUrl || "",
      })

      // Check user's existing review
      try {
        const userReviewRes = await axios.get(`http://localhost:5003/api/Review/account/${currentAccountId}`)
        const userReviews = userReviewRes.data.data || []
        const existingReview = userReviews.find(r => r.filmId === parseInt(id))
        
        if (existingReview) {
          if (existingReview.rating) setUserRating(existingReview.rating)
          if (existingReview.favorites) setIsFavorite(existingReview.favorites)
          if (existingReview.comment) setComment(existingReview.comment)
        }
      } catch (err) {
        console.log("No existing review found")
      }

    } catch (err) {
      console.error("❌ Error fetching movie details:", err)
      Swal.fire("Lỗi", "Không thể tải thông tin phim", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5003/api/Review/film/${id}`)
      const reviewsData = res.data.data || []
      
      // Get account details for each review
      const reviewsWithAccounts = await Promise.all(
        reviewsData
          .filter(r => r.comment && r.comment.trim() !== "")
          .map(async (review) => {
            try {
              const accountRes = await axios.get(`http://localhost:5003/api/Account/${review.accountId}`)
              const account = accountRes.data.data
              return {
                ...review,
                accountName: account.userName || "Người dùng",
              }
            } catch (err) {
              return {
                ...review,
                accountName: "Người dùng",
              }
            }
          })
      )
      
      setReviews(reviewsWithAccounts)
    } catch (err) {
      console.error("❌ Error fetching reviews:", err)
    }
  }

  const handleRatingClick = async (rating) => {
    setUserRating(rating)
    
    try {
      await axios.post("http://localhost:5003/api/Review/CreateRating", {
        accountId: currentAccountId,
        filmId: parseInt(id),
        rating: rating,
      })
      
      Swal.fire("Thành công", "Đánh giá của bạn đã được lưu", "success")
      fetchMovieDetails() // Refresh to update average rating
    } catch (err) {
      console.error("❌ Error rating movie:", err)
      Swal.fire("Lỗi", "Không thể lưu đánh giá", "error")
    }
  }

  const handleFavoriteToggle = async () => {
    const newFavoriteStatus = !isFavorite
    setIsFavorite(newFavoriteStatus)
    
    try {
      await axios.post("http://localhost:5003/api/Review/CreateFavorites", {
        accountId: currentAccountId,
        filmId: parseInt(id),
        favorites: newFavoriteStatus,
      })
      
      Swal.fire(
        "Thành công",
        newFavoriteStatus ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích",
        "success"
      )
    } catch (err) {
      console.error("❌ Error toggling favorite:", err)
      setIsFavorite(!newFavoriteStatus) // Revert on error
      Swal.fire("Lỗi", "Không thể cập nhật danh sách yêu thích", "error")
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      Swal.fire("Cảnh báo", "Vui lòng nhập bình luận", "warning")
      return
    }
    
    try {
      await axios.post("http://localhost:5003/api/Review/CreateComment", {
        accountId: currentAccountId,
        filmId: parseInt(id),
        comment: comment.trim(),
      })
      
      Swal.fire("Thành công", "Bình luận của bạn đã được đăng", "success")
      setComment("")
      fetchReviews() // Refresh reviews
    } catch (err) {
      console.error("❌ Error submitting comment:", err)
      Swal.fire("Lỗi", "Không thể đăng bình luận", "error")
    }
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ""
    
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtube\.com\/embed\/([^?]+)/,
      /youtu\.be\/([^?]+)/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`
      }
    }
    
    return url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Không tìm thấy phim</p>
          <button
            onClick={() => navigate("/user/movies")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Quay lại danh sách phim
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Backdrop */}
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.image})`,
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="flex gap-8 w-full">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={movie.image || "/placeholder.svg"}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{movie.rating.toFixed(1)}</span>
                  <span className="text-gray-300">/ 10</span>
                </div>
                <span className="text-gray-300">({movie.reviewCount} đánh giá)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5" />
                <span>{movie.year}</span>
              </div>

              <div className="flex gap-4">
                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                  >
                    <Play className="h-5 w-5" />
                    Xem trailer
                  </button>
                )}
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                    isFavorite
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
                  {isFavorite ? "Đã thêm" : "Yêu thích"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailerUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              ✕ Đóng
            </button>
            <iframe
              src={getYouTubeEmbedUrl(movie.trailerUrl)}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title="Movie Trailer"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Tóm tắt</h2>
              <p className="text-gray-700 leading-relaxed">{movie.synopsis || "Chưa có tóm tắt"}</p>
            </div>

            {/* Cast */}
            {movie.actors && movie.actors.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Diễn viên</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.actors.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-2">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="font-medium text-sm">{actor.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Bình luận ({reviews.length})
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="4"
                  placeholder="Chia sẻ suy nghĩ của bạn về bộ phim..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Đăng bình luận
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.accountName}</span>
                            {review.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{review.rating}/10</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Rating & Info */}
          <div className="space-y-6">
            {/* Your Rating */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Đánh giá của bạn</h3>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= (hoveredRating || userRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-600">
                {userRating > 0 ? `Bạn đã đánh giá: ${userRating}/10` : "Chọn số sao để đánh giá"}
              </p>
            </div>

            {/* Directors */}
            {movie.directors && movie.directors.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3">Đạo diễn</h3>
                <div className="space-y-2">
                  {movie.directors.map((director) => (
                    <div key={director.id} className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>{director.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Release Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-3">Thông tin</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Năm phát hành:</span> {movie.year}
                </div>
                {movie.releaseDate && (
                  <div>
                    <span className="font-semibold">Ngày công chiếu:</span>{" "}
                    {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Thể loại:</span> {movie.genres.join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Header } from "../../components/user/header"
import { Footer } from "../../components/user/footer"
import { Star, Search, Filter } from "lucide-react"
import axios from "axios"
import ReactPaginate from "react-paginate"

export default function MovieListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 12

  // Fetch movies and genres
  useEffect(() => {
    fetchMovies()
    fetchGenres()
  }, [])

  // Filter and sort movies whenever filters change
  useEffect(() => {
    filterAndSortMovies()
  }, [movies, searchTerm, selectedGenre, sortBy])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const filmRes = await axios.get("http://localhost:5003/api/Film")
      const films = filmRes.data.data || []

      // Fetch rating for each film
      const ratingRes = await axios.get("http://localhost:5003/api/Review/admin/GetAverageRatings")
      const ratingData = ratingRes?.data?.data || []

      // Fetch genres for each film
      const genreRes = await axios.get("http://localhost:5003/api/genre/all-exist")
      const allGenres = genreRes.data.data || []

      const filmsWithDetails = await Promise.all(
        films.map(async (film) => {
          const fgRes = await axios.get(`http://localhost:5003/api/FilmGenre/GetByFilmId/${film.id}`)
          const filmGenres = fgRes.data.data || []

          const genreNames = filmGenres
            .map((fg) => {
              const g = allGenres.find((gg) => gg.id === fg.genreId && !gg.isDeleted)
              return g ? g.name : null
            })
            .filter(Boolean)

          const filmRatingObj = ratingData.find((r) => r.movieId === film.id)
          const averageRating = filmRatingObj ? filmRatingObj.averageRating : 0

          return {
            id: film.id,
            title: film.title,
            image: film.posterUrl,
            synopsis: film.synopsis,
            releaseDate: film.releaseDate,
            year: film.releaseDate ? new Date(film.releaseDate).getFullYear() : new Date(film.createdAt).getFullYear(),
            genres: genreNames,
            genreIds: filmGenres.map(fg => fg.genreId),
            rating: averageRating,
            trailerUrl: film.trailerUrl || "",
          }
        })
      )

      setMovies(filmsWithDetails)
    } catch (err) {
      console.error("❌ Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/genre/all-exist")
      setGenres(res.data.data || [])
    } catch (err) {
      console.error("❌ Error fetching genres:", err)
    }
  }

  const filterAndSortMovies = () => {
    let filtered = [...movies]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Genre filter
    if (selectedGenre !== "all") {
      filtered = filtered.filter(movie =>
        movie.genreIds.includes(parseInt(selectedGenre))
      )
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "oldest":
        filtered.sort((a, b) => a.year - b.year)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredMovies(filtered)
    setCurrentPage(0) // Reset to first page when filters change
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateURLParams()
  }

  const updateURLParams = () => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (selectedGenre !== "all") params.genre = selectedGenre
    if (sortBy !== "newest") params.sort = sortBy
    setSearchParams(params)
  }

  // Pagination
  const pageCount = Math.ceil(filteredMovies.length / itemsPerPage)
  const offset = currentPage * itemsPerPage
  const currentMovies = filteredMovies.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleMovieClick = (movieId) => {
    navigate(`/user/movie/${movieId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Khám phá phim</h1>
          <p className="text-lg opacity-90">Tìm kiếm và khám phá hàng ngàn bộ phim tuyệt vời</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4">
            {/* Genre Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Thể loại
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value)
                  updateURLParams()
                }}
              >
                <option value="all">Tất cả thể loại</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  updateURLParams()
                }}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="title">Tên (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Tìm thấy <strong>{filteredMovies.length}</strong> bộ phim
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : currentMovies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Không tìm thấy phim nào phù hợp</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {currentMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group cursor-pointer"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white font-bold">{movie.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-white text-xs line-clamp-2">{movie.synopsis}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-purple-600 transition">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{movie.year}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.slice(0, 2).map((genre, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-8 flex justify-center">
                <ReactPaginate
                  previousLabel={"← Trước"}
                  nextLabel={"Sau →"}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  forcePage={currentPage}
                  containerClassName={"flex items-center gap-2"}
                  pageClassName={"px-3 py-2 border rounded hover:bg-purple-50 cursor-pointer"}
                  activeClassName={"bg-purple-600 text-white hover:bg-purple-700"}
                  previousClassName={"px-3 py-2 border rounded hover:bg-gray-50 cursor-pointer"}
                  nextClassName={"px-3 py-2 border rounded hover:bg-gray-50 cursor-pointer"}
                  disabledClassName={"opacity-50 cursor-not-allowed"}
                  breakLabel={"..."}
                  breakClassName={"px-3 py-2"}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent } from "../../components/ui/card"
import { Home, Users, Film, CreditCard, Star, Search, Trash2, ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Home", active: false },
  { icon: Users, label: "Users", active: false },
  { icon: Film, label: "Movies", active: false },
  { icon: CreditCard, label: "Accounts", active: false },
  { icon: Star, label: "Movies Reviews", active: true },
]

export function ReviewsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lấy id từ query string (?id=...)
  const [targetId, setTargetId] = useState(null)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("id")
      setTargetId(id)
    }
  }, [])

  useEffect(() => {
    if (!targetId) return // chưa có id thì không gọi
    const ac = new AbortController()

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1) Reviews
        const res = await fetch(`/api/Review/${encodeURIComponent(targetId)}`, { signal: ac.signal })
        if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`)
        const data = await res.json()

        // 2) Caches để tránh gọi trùng
        const accountCache = new Map() // AccountId -> UserID
        const userCache = new Map()    // UserID -> FullName
        const filmCache = new Map()    // MovieId -> Title

        const getAccountUserId = async (accountId) => {
          if (!accountId) return ""
          if (accountCache.has(accountId)) return accountCache.get(accountId)
          const r = await fetch(`/api/account/${encodeURIComponent(accountId)}`, { signal: ac.signal })
          if (!r.ok) {
            accountCache.set(accountId, "")
            return ""
          }
          const acc = await r.json()
          const uid = acc?.UserID ?? ""
          accountCache.set(accountId, uid)
          return uid
        }

        const getUserFullName = async (userId) => {
          if (!userId) return ""
          if (userCache.has(userId)) return userCache.get(userId)
          const r = await fetch(`/api/user/${encodeURIComponent(userId)}`, { signal: ac.signal })
          if (!r.ok) {
            userCache.set(userId, "")
            return ""
          }
          const u = await r.json()
          const name = u?.FullName ?? ""
          userCache.set(userId, name)
          return name
        }

        const getFilmTitle = async (filmId) => {
          if (!filmId) return ""
          if (filmCache.has(filmId)) return filmCache.get(filmId)
          const r = await fetch(`/api/film/${encodeURIComponent(filmId)}`, { signal: ac.signal })
          if (!r.ok) {
            filmCache.set(filmId, "")
            return ""
          }
          const f = await r.json()
          const title = f?.Title ?? ""
          filmCache.set(filmId, title)
          return title
        }

        // 3) Resolve song song
        const rows = await Promise.all(
          (Array.isArray(data) ? data : []).map(async (rv) => {
            const userId = await getAccountUserId(rv.AccountId)
            const fullName = await getUserFullName(userId)
            const filmTitle = await getFilmTitle(rv.MovieId)
            return {
              id: rv.Id,
              film: filmTitle,
              reviewer: fullName,
              rating: rv.Rating,
              content: rv.Comment,
              createdAt: rv.CreatedAt,
              updatedAt: rv.UpdatedAt,
            }
          })
        )

        setReviews(rows)
        setCurrentPage(1)
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => ac.abort()
  }, [targetId])

  // ---- Filter + paginate trên reviews từ API
  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return reviews.filter((review) => {
      const matchesSearch =
        !term ||
        review.film?.toLowerCase().includes(term) ||
        review.reviewer?.toLowerCase().includes(term) ||
        review.content?.toLowerCase().includes(term)
      const matchesRating = ratingFilter === "all" || String(review.rating) === ratingFilter
      return matchesSearch && matchesRating
    })
  }, [reviews, searchTerm, ratingFilter])

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + rowsPerPage)

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{rating}</span>
        <Star className="w-4 h-4 fill-current text-yellow-400" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r relative">
        <div className="p-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  item.active ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Admin2</div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-900">Reviews</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Apr 17, 2023</span>
          </div>
        </div>

        {/* Hint khi thiếu id */}
        {!targetId && (
          <Card className="mb-4">
            <CardContent className="p-4 text-sm text-gray-600">
              Không tìm thấy <code>?id=...</code> trên URL. Thêm tham số <b>id</b> vào query string để tải review, ví dụ:{" "}
              <code>/reviews?id=123</code>.
            </CardContent>
          </Card>
        )}

        {/* Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <Select className="" value={ratingFilter} onValueChange={(value) => setRatingFilter(value)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Reviews Management Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Reviews Management</h3>
            </div>

            {/* Loading / Error */}
            {loading && <div className="p-4 text-sm text-gray-500">Loading reviews…</div>}
            {error && !loading && <div className="p-4 text-sm text-red-600">Error: {error}</div>}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Film
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reviewer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{review.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{review.film}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{review.reviewer}</td>
                        <td className="px-4 py-4">{renderStars(review.rating)}</td>
                        <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">{review.content}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{review.createdAt}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{review.updatedAt}</td>
                        <td className="px-4 py-4">
                          <Button size="sm" variant="outline" className="p-1 bg-transparent">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {paginatedReviews.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                          {targetId ? "No reviews found." : "Provide ?id=... to load reviews."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <Select
                  className="w-16"
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue placeholder="Select rows" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {filteredReviews.length === 0
                    ? "0-0 of 0"
                    : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredReviews.length)} of ${filteredReviews.length}`}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};
export default ReviewsManagement;


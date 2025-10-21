# 🎬 Hướng dẫn sử dụng giao diện User - MovieReviewApp

## ✨ Tính năng đã hoàn thiện

### 1. **Trang chủ (Homepage)** - `/user/homepage`
- Hero section với featured movie
- Grid hiển thị phim "What to watch" (top-rated)
- Grid hiển thị phim "Newest" (mới nhất)
- Celebrities section
- Header với search bar và navigation

### 2. **Trang danh sách phim (Movie List)** - `/user/movies`
- ✅ Hiển thị tất cả phim dạng grid (12 phim/trang)
- ✅ **Tìm kiếm phim** theo tên
- ✅ **Lọc theo thể loại** (Genre filter)
- ✅ **Sắp xếp** theo:
  - Mới nhất
  - Cũ nhất
  - Đánh giá cao nhất
  - Tên (A-Z)
- ✅ **Phân trang** với ReactPaginate
- ✅ Hiển thị rating và thể loại
- ✅ Hover effect với thông tin chi tiết
- ✅ Click vào phim để xem chi tiết

### 3. **Trang chi tiết phim (Movie Detail)** - `/user/movie/:id`
- ✅ **Hero section** với backdrop blur
- ✅ **Thông tin phim đầy đủ**:
  - Poster, tên phim, năm phát hành
  - Tóm tắt nội dung
  - Thể loại (genres)
  - Đạo diễn (directors)
  - Diễn viên (actors)
  - Rating trung bình và số lượng đánh giá
  
- ✅ **Xem trailer YouTube** trong modal popup

- ✅ **Tính năng tương tác**:
  - Đánh giá phim (1-10 sao) với hover effect
  - Thêm/xóa khỏi danh sách yêu thích (Favorite)
  - Viết và đăng bình luận (Comment)
  
- ✅ **Danh sách bình luận**:
  - Hiển thị tên người dùng
  - Rating của người dùng (nếu có)
  - Nội dung bình luận
  - Thời gian đăng

### 4. **Header Navigation**
- ✅ Logo (click để về trang chủ)
- ✅ Nút "Danh sách phim" chuyển đến `/user/movies`
- ✅ Search bar với dropdown kết quả (autocomplete)
- ✅ Click vào kết quả search chuyển đến chi tiết phim

### 5. **Movie Grid Component**
- ✅ Click vào poster → chi tiết phim
- ✅ Nút Play → chi tiết phim
- ✅ Nút Add to List → thêm vào favorites
- ✅ Nút "View All" → danh sách phim

---

## 📁 Cấu trúc file mới

```
frontend/src/
├── page/user/
│   ├── Homepage.jsx           # Trang chủ (có sẵn)
│   ├── MovieListPage.jsx      # ✨ MỚI - Danh sách phim
│   └── MovieDetailPage.jsx    # ✨ MỚI - Chi tiết phim
├── routes/
│   └── UserRoute.jsx          # ✏️ Đã cập nhật routes
└── components/user/
    ├── header.jsx             # ✏️ Đã thêm navigation
    └── movie-grid.jsx         # ✏️ Đã thêm click handlers
```

---

## 🔗 API Endpoints sử dụng

### **Film APIs**
- `GET /api/Film` - Lấy tất cả phim (user)
- `GET /api/Film/{id}` - Chi tiết phim theo ID
- `GET /api/Film/newest` - Phim mới nhất
- `GET /api/Film/top-rated` - Phim rating cao nhất
- `GET /api/Film/search/{keyword}` - Tìm kiếm phim

### **Review APIs**
- `GET /api/Review/film/{filmId}` - Lấy reviews theo filmId
- `GET /api/Review/account/{accountId}` - Lấy reviews theo accountId
- `GET /api/Review/admin/GetAverageRatings` - Rating trung bình tất cả phim
- `GET /api/Review/admin/GetFilmReviewCounts` - Số lượng review của phim
- `POST /api/Review/CreateRating` - Đánh giá phim
- `POST /api/Review/CreateFavorites` - Thêm/xóa favorite
- `POST /api/Review/CreateComment` - Đăng bình luận

### **Genre & Metadata APIs**
- `GET /api/genre/all-exist` - Tất cả thể loại
- `GET /api/FilmGenre/GetByFilmId/{id}` - Thể loại của phim
- `GET /api/FilmActor/GetByFilmId/{id}` - Diễn viên của phim
- `GET /api/FilmDirector/GetByFilmId/{id}` - Đạo diễn của phim
- `GET /api/Actor/{id}` - Chi tiết diễn viên
- `GET /api/Director/{id}` - Chi tiết đạo diễn

---

## 🚀 Cách chạy

### Backend
```bash
cd backend
dotnet restore
dotnet run
```
Backend chạy tại: `http://localhost:5003`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

---

## 🎯 Routes có sẵn

| Route | Mô tả |
|-------|-------|
| `/` | Redirect to `/user/homepage` |
| `/user/homepage` | Trang chủ |
| `/user/movies` | Danh sách phim (có filter, search, sort) |
| `/user/movie/:id` | Chi tiết phim (xem thông tin, trailer, đánh giá) |

---

## 🔧 Tính năng cần lưu ý

### 1. **Authentication (chưa hoàn chỉnh)**
Hiện tại đang hardcode `currentAccountId = 1` cho demo.

**TODO:** Tích hợp JWT authentication:
```javascript
// Lấy từ localStorage hoặc context
const token = localStorage.getItem('authToken')
const currentAccountId = getCurrentUserId() // từ decoded token
```

### 2. **Trailer YouTube**
- Hỗ trợ các format URL:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`

### 3. **Rating System**
- Rating từ 1-10 sao (scale 10 điểm)
- Hover effect khi chọn rating
- Tự động lưu vào database khi click

### 4. **Favorites**
- Toggle on/off khi click nút Heart
- Icon đổi màu đỏ khi đã favorite
- Tự động lưu vào database

### 5. **Comments**
- Chỉ hiển thị comments có nội dung
- Hiển thị tên user, rating, và thời gian
- Tự động reload sau khi đăng comment

---

## 🎨 UI/UX Features

### Responsive Design
- ✅ Mobile-friendly (grid 2 cols trên mobile)
- ✅ Tablet (3-4 cols)
- ✅ Desktop (6 cols)

### Animations
- ✅ Hover scale effect trên movie cards
- ✅ Smooth transitions
- ✅ Loading spinners
- ✅ Modal animations

### Color Scheme
- Primary: Purple (`#9333ea`)
- Accent: Pink/Red (favorites)
- Rating: Yellow (`#fbbf24`)

---

## 📊 Data Flow

```
User clicks movie
    ↓
MovieDetailPage loads
    ↓
Fetch film data (id, title, poster...)
    ↓
Fetch related data:
    - Genres (FilmGenre API)
    - Actors (FilmActor API)
    - Directors (FilmDirector API)
    - Reviews (Review API)
    - Average Rating
    ↓
Render complete page
    ↓
User interactions:
    - Rate → POST CreateRating
    - Favorite → POST CreateFavorites
    - Comment → POST CreateComment
```

---

## 🐛 Known Issues & Improvements

### Cần cải thiện:
1. ❌ **Authentication**: Chưa có JWT integration
2. ❌ **Error handling**: Cần thêm error boundaries
3. ❌ **Loading states**: Một số phần chưa có skeleton loading
4. ❌ **Image optimization**: Chưa lazy load images
5. ❌ **Cache**: Chưa cache API responses

### Đề xuất tính năng thêm:
- 📌 Pagination server-side cho performance
- 📌 Infinite scroll thay vì pagination
- 📌 Filter multiple genres
- 📌 Advanced search (theo năm, đạo diễn, diễn viên)
- 📌 User profile page với favorites list
- 📌 Related movies section
- 📌 Share movie on social media

---

## 💡 Tips cho Developer

### Debug API calls:
```javascript
// Thêm vào component để log API calls
useEffect(() => {
  console.log('Movie data:', movie)
}, [movie])
```

### Test với Mock Data:
```javascript
// Thay API call bằng mock data
const mockMovie = {
  id: 1,
  title: "Test Movie",
  rating: 8.5,
  // ...
}
setMovie(mockMovie)
```

### Performance:
- Use React.memo() cho components nặng
- Debounce search input (đã implement)
- Lazy load images với react-lazyload

---

## 📞 Support

Nếu gặp lỗi hoặc cần hỗ trợ:
1. Check console.log để xem API errors
2. Verify backend đang chạy ở port 5003
3. Check database có dữ liệu test
4. Xem Network tab trong DevTools

---

## 🎉 Tóm tắt

Giao diện user đã **hoàn thiện** với đầy đủ tính năng:
- ✅ Xem danh sách phim (filter, search, sort)
- ✅ Xem chi tiết phim theo ID
- ✅ Đánh giá phim (rating)
- ✅ Thêm vào yêu thích (favorites)
- ✅ Bình luận (comments)
- ✅ Xem trailer YouTube
- ✅ Responsive design
- ✅ Navigation hoàn chỉnh

**Ready for testing!** 🚀

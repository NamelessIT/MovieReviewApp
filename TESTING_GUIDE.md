# 🧪 Test Guide - Movie Review App User Interface

## 📋 Checklist kiểm tra tính năng

### ✅ 1. Trang chủ (Homepage) - `/user/homepage`

**Test cases:**
- [ ] Load trang thành công
- [ ] Hero section hiển thị
- [ ] Grid "What to watch" hiển thị phim top-rated
- [ ] Grid "Newest" hiển thị phim mới nhất
- [ ] Celebrities section hiển thị
- [ ] Header navigation hoạt động
- [ ] Footer hiển thị

**Cách test:**
1. Mở browser: `http://localhost:5173/user/homepage`
2. Kiểm tra tất cả sections có load đầy đủ
3. Hover vào các movie cards → xem overlay effect
4. Click nút "View All" → chuyển đến `/user/movies`

---

### ✅ 2. Search trong Header

**Test cases:**
- [ ] Gõ keyword → hiển thị dropdown kết quả
- [ ] Debounce 400ms hoạt động (không call API liên tục)
- [ ] Kết quả hiển thị đúng (title, poster, synopsis)
- [ ] Click vào kết quả → chuyển đến chi tiết phim
- [ ] Click ra ngoài → dropdown đóng
- [ ] Không có kết quả → hiển thị "No results found"

**Cách test:**
1. Click vào search bar
2. Gõ từ khóa (VD: "avatar")
3. Đợi 400ms → dropdown xuất hiện
4. Click vào một kết quả → check URL chuyển đến `/user/movie/{id}`

---

### ✅ 3. Danh sách phim (Movie List) - `/user/movies`

**Test cases:**

#### A. Hiển thị cơ bản
- [ ] Grid hiển thị 12 phim/trang
- [ ] Responsive: mobile (2 cols), tablet (3-4 cols), desktop (6 cols)
- [ ] Poster, title, year, genres, rating hiển thị đúng
- [ ] Hover effect hoạt động

#### B. Search
- [ ] Input search field hoạt động
- [ ] Submit form → filter movies theo keyword
- [ ] URL params cập nhật: `?search=keyword`
- [ ] Reload page → giữ search keyword

#### C. Filter theo Genre
- [ ] Dropdown hiển thị tất cả genres
- [ ] Chọn genre → filter movies
- [ ] URL params cập nhật: `?genre=5`
- [ ] "Tất cả thể loại" → hiển thị tất cả

#### D. Sort
- [ ] "Mới nhất" → sort by year DESC
- [ ] "Cũ nhất" → sort by year ASC
- [ ] "Đánh giá cao nhất" → sort by rating DESC
- [ ] "Tên (A-Z)" → sort alphabetically
- [ ] URL params cập nhật: `?sort=rating`

#### E. Pagination
- [ ] Nút "Trước" disabled khi ở page 1
- [ ] Nút "Sau" disabled khi ở page cuối
- [ ] Click page number → chuyển trang
- [ ] Pagination scroll to top
- [ ] Active page highlight màu purple

#### F. Navigation
- [ ] Click vào movie card → chuyển đến `/user/movie/{id}`

**Cách test:**
```bash
# Test case 1: Search
1. Navigate to /user/movies
2. Search "matrix" → verify filtered results
3. Check URL: ?search=matrix

# Test case 2: Genre filter
1. Select "Action" from genre dropdown
2. Verify only action movies shown
3. Check URL: ?genre=1 (genre ID)

# Test case 3: Sort
1. Select "Đánh giá cao nhất"
2. Verify movies sorted by rating DESC
3. Check URL: ?sort=rating

# Test case 4: Combined filters
1. Search "the" + Genre "Drama" + Sort "newest"
2. Check URL: ?search=the&genre=2&sort=newest
3. Reload page → filters persist
```

---

### ✅ 4. Chi tiết phim (Movie Detail) - `/user/movie/:id`

**Test cases:**

#### A. Hiển thị thông tin
- [ ] Hero section với backdrop blur
- [ ] Poster, title, year hiển thị
- [ ] Rating trung bình và số lượng đánh giá
- [ ] Genres (badges)
- [ ] Synopsis
- [ ] Danh sách diễn viên
- [ ] Danh sách đạo diễn

#### B. Trailer
- [ ] Nút "Xem trailer" hiển thị khi có trailerUrl
- [ ] Click nút → modal mở
- [ ] YouTube iframe embed chính xác
- [ ] Click "Đóng" hoặc outside → modal đóng
- [ ] Video không autoplay nếu không mong muốn

#### C. Rating (Đánh giá)
- [ ] 10 sao hiển thị
- [ ] Hover → sao highlight (màu vàng)
- [ ] Click sao → gọi API CreateRating
- [ ] SweetAlert hiển thị "Thành công"
- [ ] Rating của user hiển thị (nếu đã đánh giá trước đó)
- [ ] Average rating cập nhật sau khi rate

#### D. Favorites
- [ ] Nút "Yêu thích" hiển thị
- [ ] Click → toggle favorite status
- [ ] Icon Heart đổi màu đỏ khi favorite = true
- [ ] SweetAlert confirm
- [ ] Gọi API CreateFavorites

#### E. Comments (Bình luận)
- [ ] Textarea nhập bình luận
- [ ] Submit form → gọi API CreateComment
- [ ] SweetAlert "Thành công"
- [ ] Bình luận mới xuất hiện trong danh sách
- [ ] Hiển thị: username, rating, comment, date
- [ ] Chỉ hiển thị comments có nội dung

#### F. Loading & Error
- [ ] Loading spinner khi fetch data
- [ ] "Không tìm thấy phim" nếu ID invalid
- [ ] Console log errors nếu API fail

**Cách test:**

```bash
# Test case 1: View movie detail
1. Navigate to /user/movie/1
2. Verify all info displayed correctly
3. Check console for API calls

# Test case 2: Rate movie
1. Click on star 8/10
2. Verify API call: POST /api/Review/CreateRating
   Body: { accountId: 1, filmId: 1, rating: 8 }
3. Check SweetAlert success
4. Reload page → rating persists

# Test case 3: Add to favorites
1. Click "Yêu thích" button
2. Verify icon changes to red heart
3. Check API call: POST /api/Review/CreateFavorites
   Body: { accountId: 1, filmId: 1, favorites: true }
4. Click again → toggle off

# Test case 4: Post comment
1. Type "Great movie!" in textarea
2. Click "Đăng bình luận"
3. Verify API call: POST /api/Review/CreateComment
   Body: { accountId: 1, filmId: 1, comment: "Great movie!" }
4. Check comment appears in list

# Test case 5: Watch trailer
1. Click "Xem trailer"
2. Verify YouTube embed opens
3. Close modal → check video stops
```

---

## 🔧 Backend API Testing

### Test với Swagger UI:
1. Navigate to: `http://localhost:5003/swagger`
2. Test các endpoints:

```
GET /api/Film → Lấy tất cả phim
GET /api/Film/1 → Chi tiết phim ID=1
GET /api/Review/film/1 → Reviews của phim ID=1
POST /api/Review/CreateRating → Test rating
POST /api/Review/CreateComment → Test comment
```

### Test với Postman:

```json
// POST /api/Review/CreateRating
{
  "accountId": 1,
  "filmId": 1,
  "rating": 9
}

// POST /api/Review/CreateFavorites
{
  "accountId": 1,
  "filmId": 1,
  "favorites": true
}

// POST /api/Review/CreateComment
{
  "accountId": 1,
  "filmId": 1,
  "comment": "This is a test comment"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: API 404 Not Found
**Solution:**
- Check backend đang chạy: `http://localhost:5003`
- Verify database có dữ liệu
- Check console.log errors

### Issue 2: CORS Error
**Solution:**
- Backend `Program.cs` có config CORS cho `http://localhost:5173`
- Restart backend nếu thay đổi config

### Issue 3: Rating không save
**Solution:**
- Check `accountId` không null
- Verify API response trong Network tab
- Check database `Reviews` table có row mới

### Issue 4: Images không load
**Solution:**
- Check `posterUrl` có valid URL
- Cloudinary credentials đúng trong `appsettings.json`
- Fallback to `/placeholder.svg`

### Issue 5: Trailer không play
**Solution:**
- Check `trailerUrl` format:
  - ✅ `https://www.youtube.com/watch?v=VIDEO_ID`
  - ❌ Invalid URL
- Verify YouTube embed allowed (not restricted)

---

## 📊 Test Data Requirements

### Minimum test data:
```
- 20+ Films (có posterUrl, synopsis, trailerUrl)
- 5+ Genres
- 10+ Actors
- 5+ Directors
- FilmGenre relationships
- FilmActor relationships
- FilmDirector relationships
- 1 Account (ID=1 for testing)
```

### Sample SQL insert:
```sql
-- Test film
INSERT INTO films (Title, Synopsis, PosterUrl, TrailerUrl, ReleaseDate, CreatedAt)
VALUES ('Test Movie', 'This is a test', 'https://example.com/poster.jpg', 
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '2024-01-01', NOW());

-- Test account
INSERT INTO accounts (UserName, Email, Password, CreatedAt)
VALUES ('testuser', 'test@example.com', 'hashedpassword', NOW());
```

---

## ✅ Final Checklist

Before deployment:
- [ ] Tất cả pages load không lỗi
- [ ] Search, filter, sort hoạt động
- [ ] Rating, favorites, comments hoạt động
- [ ] Responsive design OK trên mobile/tablet/desktop
- [ ] Console không có errors
- [ ] Backend API trả về data đúng format
- [ ] Images load (hoặc fallback)
- [ ] Pagination hoạt động
- [ ] Navigation giữa các pages smooth

---

## 📞 Debug Tips

### Chrome DevTools:
```javascript
// Check movie data
console.log('Movie:', movie)

// Check API response
fetch('http://localhost:5003/api/Film/1')
  .then(r => r.json())
  .then(d => console.log(d))

// Check localStorage (for future auth)
console.log(localStorage.getItem('authToken'))
```

### Network Tab:
- Filter by XHR để xem API calls
- Check Status Code (200 OK, 404 Not Found)
- Check Response JSON format

### React DevTools:
- Inspect component props
- Check useState values
- Monitor re-renders

---

## 🎉 Success Criteria

✅ User có thể:
1. Xem danh sách phim với filter/search/sort
2. Xem chi tiết phim với đầy đủ thông tin
3. Đánh giá phim (rating 1-10)
4. Thêm phim vào favorites
5. Viết và đăng bình luận
6. Xem trailer YouTube
7. Navigation giữa các trang mượt mà

**All features working = Ready for production!** 🚀

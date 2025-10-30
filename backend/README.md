## MovieReviewApp - Backend (ASP.NET Core)

Hướng dẫn này mô tả cách chuẩn bị môi trường và chạy phần backend của dự án MovieReviewApp (thư mục gốc chứa `backend.csproj`).

## Tổng quan nhanh

- Công nghệ: ASP.NET Core (.NET 9 / net9.0)
- ORM: Entity Framework Core (Pomelo MySQL provider)
- CSDL mẫu: MySQL
- API docs (Swagger) có trong môi trường Development

## Yêu cầu (Prerequisites)

- .NET SDK 9.x: https://dotnet.microsoft.com
- MySQL Server (hoặc MariaDB) - chạy local hoặc remote
- (Tùy chọn) MySQL client (mysql) để chạy SQL script
- (Tùy chọn) Cloudinary account nếu bạn muốn dùng upload ảnh
- (Nếu cần) dotnet-ef tool để chạy migrations: `dotnet tool install --global dotnet-ef`

## Các file cấu hình quan trọng

- `appsettings.json` - chứa cấu hình mặc định (ConnectionStrings, Jwt, CloudinarySettings)
- `appsettings.Development.json` - (nếu có) ghi đè cho môi trường Development
- `Properties/launchSettings.json` - cấu hình profile chạy (URL mặc định: `http://localhost:5003` và `https://localhost:7177`).

## Kết nối với MySQL qua XAMPP (khuyến nghị)

Project này dùng MySQL (Pomelo provider). Nếu bạn muốn dùng XAMPP (cài đặt MySQL/MariaDB + phpMyAdmin) làm môi trường local, làm theo các bước sau:

1. Cài và mở XAMPP Control Panel: https://www.apachefriends.org/
2. Start `Apache` và `MySQL` (hoặc `MariaDB`).
3. Mở phpMyAdmin: http://localhost/phpmyadmin
4. Tạo database mới tên `movierv`.

## Chuẩn bị và chạy (Terminal trong VS Code)

Mở Integrated Terminal trong Visual Studio Code (View → Terminal hoặc nhấn Ctrl+`) và chạy các lệnh sau trong thư mục dự án.

1. Khôi phục packages và build:

```bash
dotnet restore
dotnet build
```

2. Cài đặt `dotnet-ef` nếu chưa có (chỉ cần làm 1 lần trên máy dev):

```bash
dotnet tool install --global dotnet-ef
# hoặc cập nhật nếu đã cài
dotnet tool update --global dotnet-ef
```

3. Thiết lập cơ sở dữ liệu

```bash
dotnet ef database update
```
- Import dữ liệu mẫu (nếu cần): trong phpMyAdmin chọn database `movierv` -> tab `Import` -> chọn file `Data.sql` từ thư mục dự án và import.
4. Chạy ứng dụng:

```bash
dotnet run
# hoặc 
dotnet watch run 
```

Ứng dụng theo mặc định lắng nghe trên `http://localhost:5003` (xem `launchSettings.json`). Khi chạy ở môi trường Development, Swagger UI sẽ khả dụng tại `http://localhost:5003/swagger`.

## Thông tin đặc biệt trong dự án

- CORS: frontend mặc định được phép là `http://localhost:5173` (cấu hình trong `Program.cs`). Nếu frontend của bạn chạy ở URL khác, cập nhật policy CORS trong `Program.cs`.
- JWT: `Jwt` config dùng `Issuer`, `Audience`, `Key` — nếu thay đổi port hoặc URL ứng dụng, cập nhật `Issuer`/`Audience` cho đúng.
- CloudinaryUploaderService: service upload ảnh; bạn cần cung cấp `CloudinarySettings` hợp lệ để upload ảnh hoạt động.

## Troubleshooting (Lỗi thường gặp)

- Lỗi kết nối MySQL: kiểm tra MySQL đang chạy và `ConnectionStrings__DefaultConnection` đúng.
- Lỗi `dotnet-ef` không tìm thấy: cài `dotnet tool install --global dotnet-ef` và đảm bảo đường dẫn `~/.dotnet/tools` có trong PATH.
- Lỗi migrations: nếu migrations đã tồn tại nhưng DB không khớp, bạn có thể xóa DB và tạo lại, sau đó `dotnet ef database update`.

## Tóm tắt thay đổi / kiểm tra nhanh

1. Cài đặt .NET 9, MySQL
2. Khôi phục và build: `dotnet restore` + `dotnet build`
3. Áp migrations: `dotnet ef database update` (hoặc import `Data.sql`)
4. Chạy: `dotnet run` và kiểm tra Swagger: `http://localhost:5003/swagger`

---
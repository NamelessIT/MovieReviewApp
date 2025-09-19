# 🎬 MovieReviewApp

Website đánh giá phim gồm **Frontend (React + Vite)** và **Backend (.NET Web API)**.

## 🚀 Công nghệ sử dụng
- Frontend: React + Vite, React Router, Axios
- Backend: .NET 8 Web API, Entity Framework Core, SQL Server
- Quản lý code: GitHub

## 📂 Cấu trúc thư mục
MovieReviewApp/
├── frontend/ # React + Vite
├── backend/ # .NET Web API


## 🛠 Hướng dẫn setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Backend
```bash
cd backend/MovieReviewAPI
dotnet restore
dotnet run
```
#### Package(Entity Framework Core + MySQL)
```bash
dotnet add package MySql.EntityFrameworkCore --version 9.0.6
dotnet add package System.Data.SqlClient
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.Extensions.DependencyInjection
dotnet add package Microsoft.Extensions.Logging
dotnet add package Microsoft.Extensions.Logging.Console
dotnet add package Pomelo.EntityFrameworkCore.MySql
```
#### Entity Framework(chỉ chạy 1 lần trên máy)
```bash
dotnet tool install --global dotnet-ef
```
#### Tạo migration và cập nhật database
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

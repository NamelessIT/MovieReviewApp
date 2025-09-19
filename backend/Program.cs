
using Microsoft.EntityFrameworkCore;
using MovieReviewApp.backend.Data;
using MovieReviewApp.backend.Helper;
var builder = WebApplication.CreateBuilder(args);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// CSDL
// dùng Pomelo
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
    
// Add services to the container.
builder.Services.AddControllersWithViews();
// Đăng ký dịch vụ Controllers
builder.Services.AddControllers();

builder.Services.AddRepositories(); // Đăng ký tất cả các repository
var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();

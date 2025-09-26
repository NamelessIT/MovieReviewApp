// Located in your Data Access Layer project
using backend.Repositories;
using backend.Services;
using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Repositories;
namespace MovieReviewApp.backend.Helper
{
  public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // Logic đăng ký chi tiết
            services.AddScoped<FilmRepository>();
            services.AddScoped<UserRepository>();
            services.AddScoped<ReviewRepository>();
            services.AddScoped<GenreRepository>();
            services.AddScoped<ActorRepository>();
            services.AddScoped<DirectorRepository>();
            services.AddScoped<AccountRepository>();
            services.AddScoped<FilmActorRepository>();
            services.AddScoped<FilmDirectorRepository>();
            services.AddScoped<FilmGenreRepository>();
            services.AddScoped<AuthRepository>();
            services.AddScoped<TokenService>();
            services.AddScoped<AuthService>();    

            return services;
        }
    }
}
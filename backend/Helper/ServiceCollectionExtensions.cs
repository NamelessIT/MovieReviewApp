// Located in your Data Access Layer project
using MovieReviewApp.backend.Repositories;
namespace MovieReviewApp.backend.Helper
{
  public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            // Logic đăng ký chi tiết
            services.AddScoped<FilmRepository>();
                

            return services;
        }
    }
}
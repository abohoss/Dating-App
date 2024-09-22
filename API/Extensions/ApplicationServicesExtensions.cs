using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration config) {
            services.AddControllers();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();
            services.AddScoped<IServiceToken, ServiceToken>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            return services;
        }

    }
}

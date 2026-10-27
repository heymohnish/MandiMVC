
using Mandi.Services.Interfaces;
using Mandi.Services;
using Mandi.Extensions;
using Mandi.Repository.Interfaces;
using Mandi.Repository;
using Microsoft.Extensions.Configuration;

namespace Mandi.API
{
    public static class ServiceExtensions
    {
        public static void RegisterSignApp(this IServiceCollection service)
        {
            service.AddMemoryCache();
            
            service.AddScoped<IUnitOfWork, UnitOfWork>();
            service.AddScoped<ITokenService, TokenService>();

            service.AddHttpClient<IHttpService, HttpService>();
            service.AddScoped<ITokenRepository>(provider =>
            {
                var configuration = provider.GetRequiredService<IConfiguration>();
                return new TokenRepository(configuration.GetConnectionString("MandiPatientSQLConnectionString"), configuration);
            });
            service.AddSingleton<JWTService>();
            //service.AddSingleton<RepositoryExceptionFilterAttribute>();
            service.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            service.AddScoped<IError, ErrorMessageService>();
            
        }
    }
}
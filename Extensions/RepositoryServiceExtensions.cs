using Microsoft.Extensions.DependencyInjection;
using Mandi.Repository;
using Mandi.Repository.Interfaces;

namespace Mandi.Extensions
{
    public static class RepositoryServiceExtensions
    {
        //public static IServiceCollection AddRepositories(this IServiceCollection services)
        //{
        //    // Register all repositories as scoped
        //    services.AddScoped<ISignRepository, SignRepository>();
        //    services.AddScoped<ISignFormRepository, SignFormRepository>();
        //    services.AddScoped<ITemplateRepository, TemplateRepository>();
        //    services.AddScoped<IDocumentRepository, DocumentRepository>();
        //    services.AddScoped<IUsersRepository, UsersRepository>();
        //    services.AddScoped<IApiTemplatesRepository, ApiTemplatesRepository>();
        //    services.AddScoped<IApiSignatureRequestRepository, ApiSignatureRequestRepository>();
        //    services.AddScoped<IWebHooksRepository, WebHooksRepository>();

        //    return services;
        //}
    }
}

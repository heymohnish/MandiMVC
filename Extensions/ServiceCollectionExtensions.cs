using Mandi.Extensions;

namespace Mandi.Extensions
{
	public static class ServiceCollectionExtensions
	{
		public static IServiceCollection RegisterRepositories(this IServiceCollection services)
		{
			services.AddSingleton<RepositoryExceptionFilterAttribute>();
            services.AddHttpContextAccessor();
            return services;
		}
	}
}

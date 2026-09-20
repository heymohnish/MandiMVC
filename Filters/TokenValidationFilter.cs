using Mandi.Models.Response.Elation;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Mandi.Services.Interfaces;

namespace Mandi.Filters
{
    public class TokenValidationFilter : IAsyncActionFilter
    {
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public TokenValidationFilter(
            IMemoryCache cache,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ITokenService tokenService)
        {
            _cache = cache;
            _configuration = configuration;
            _tokenService = tokenService;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!_cache.TryGetValue("ElationAccessToken", out ElationTokenResponse cachedToken) ||
                cachedToken == null ||
                cachedToken.ExpirationTime <= DateTime.UtcNow)
            {

                try
                {
                    await _tokenService.GenerateAccessTokenElation();

                }
                catch (Exception ex)
                {
                    context.Result = new ObjectResult("Failed to obtain access token")
                    {
                        StatusCode = StatusCodes.Status500InternalServerError
                    };
                    return;
                }
            }

            await next();
        }

    }
}

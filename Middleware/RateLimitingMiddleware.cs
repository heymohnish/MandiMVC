using System.Collections.Concurrent;

namespace Mandi.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, (DateTime WindowStart, int Count)> _tokenCounts = new();
        private TimeSpan window;

        public RateLimitingMiddleware(RequestDelegate next)
        {
            _next = next;

        }
        public async Task InvokeAsync(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            if (endpoint != null) {
                
                var token = GetRateLimitKey(context);
                if (!string.IsNullOrEmpty(token))
                {
                    var path = context.Request.Path.Value?.ToLowerInvariant();
                    string actionType = path switch
                    {
                        var p when p?.StartsWith("/api/access/generateotp") == true => "generateotp",
                        var p when p?.StartsWith("/api/access/validateotp") == true => "validateotp",
                        _ => "default"
                    };
                    var (isRateLimited, remaining, limit, remainingSeconds) = CheckRateLimit(token, actionType);
                        if (isRateLimited)
                        {
                            await HandleRateLimitedResponse(context, limit, remainingSeconds);
                            return;
                        }

                        context.Response.OnStarting(() =>
                        {
                            context.Response.Headers["X-RateLimit-Limit"] = limit.ToString();
                            context.Response.Headers["X-RateLimit-Remaining"] = remaining.ToString();
                            context.Response.Headers["X-RateLimit-Reset"] = remainingSeconds.ToString();
                            return Task.CompletedTask;
                        });
                    
                }
            } 
            await _next(context);
        }
        private string GetRateLimitKey(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return authHeader.Substring("Bearer ".Length).Trim();
            }

            var ip = context.Connection.RemoteIpAddress?.ToString();
            return string.IsNullOrEmpty(ip) ? "anonymous" : ip;
        }
 
        private (bool isRateLimited, int remaining, int limit, int remainingSeconds) CheckRateLimit(string token, string actionType)
        {
            int limit;

            switch (actionType?.ToLowerInvariant())
            {
                case "generateotp":
                    window = TimeSpan.FromMinutes(1);
                    limit = 5;
                    break;
                case "validateotp":
                    window = TimeSpan.FromSeconds(30);
                    limit = 1;
                    break;
                default:
                    window = TimeSpan.FromMinutes(1);
                    limit = 25;
                    break;
            }
            var now = DateTime.UtcNow;
            var key = $"{token}:{actionType}";
            var entry = _tokenCounts.AddOrUpdate(key, _ => (now, 1),
                (_, existing) =>
                {
                    var (windowStart, count) = existing;

                    if (now - windowStart >= window)
                    {
                        return (now, 1);
                    }

                    return (windowStart, count + 1);
                });

            var remaining = Math.Max(0, limit - entry.Count);
            var isRateLimited = entry.Count > limit;
            var remainingSeconds =(int)(entry.WindowStart + window - now).TotalSeconds;

            return (isRateLimited, remaining, limit, remainingSeconds);
        }

        private async Task HandleRateLimitedResponse(HttpContext context, int? limit, int? remainingSeconds)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers["Retry-After"] = remainingSeconds.ToString();

            await context.Response.WriteAsJsonAsync(new
            {
                Status = 429,
                Error = "Too Many Requests",
                Message =$"Rate limit exceeded. Maximum allowed: {limit} requests per {(int)window.TotalSeconds} seconds.",
                RetryAfterSeconds = remainingSeconds
            });
        }

    }

}

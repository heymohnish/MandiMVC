using Mandi.Modals.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

public class ApiKeyAttribute : Attribute, IAsyncActionFilter
{
    private const string APIKEYNAME = "x-api-key";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
        {
            var error = new Error
            {
                code = 100,
                message = "Unauthorized"
            };

            var errorResponse = new ErrorResponse
            {
                statusCode = 401,
                message = "Failure",
                error = error
            };

            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;

            await HandleJwtErrorAsync(context, errorResponse);
            return;
        }

        var appSettings = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var apiKey = appSettings.GetValue<string>("AppSettings:ApiKey");

        if (!apiKey.Equals(extractedApiKey))
        {
            throw new AuthorizationException("401", "Unauthorized access. Invalid API key.");
        }

        await next();
    }

    private Task HandleJwtErrorAsync(ActionExecutingContext context, ErrorResponse errorResponse)
    {
        return context.HttpContext.Response.WriteAsync(JsonConvert.SerializeObject(errorResponse));
    }

    public class ErrorResponse
    {
        public int statusCode { get; set; }
        public Error error { get; set; }
        public string message { get; set; }
    }

    public class Error
    {
        public int code { get; set; }
        public string message { get; set; }
    }
}

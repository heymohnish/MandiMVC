using Mandi.Services.Interfaces;
using System.Diagnostics;

namespace Mandi.Services
{
    public class ErrorMessageService : IError
    {
        private readonly ILogger<ErrorMessageService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ErrorMessageService(ILogger<ErrorMessageService> logger,IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task LogErrorWithMethodNameAndClassName(Exception ex)
        {
            string location = _httpContextAccessor.HttpContext?.Request.Path;
            string message = string.Empty;
            string errorMessage = string.Empty;
            string errorType = string.Empty;
            string errorLocation = string.Empty;
            string newLine = string.Empty;
            errorType = ex.GetType().Name.ToString();
            errorMessage = ex.Message;
            message = location + " and" + " Error Message showing " + "" +
                      " " + errorMessage + "," + " Error Type:" + " " + errorType;
            await Task.Run(() => _logger.LogError(ex, $"An error occurred in {message}"));
        }
    }
}

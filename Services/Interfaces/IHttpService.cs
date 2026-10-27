using Mandi.Models.Exceptions;

namespace Mandi.Services.Interfaces
{
    public interface IHttpService
    {
        Task<HttpResponseResult> SendRequestAsync(
            HttpMethod method,
            string url,
            object? body = null,
            Dictionary<string, string>? headers = null,
            Type? responseType = null,
            string? contentType = null);

    }

}

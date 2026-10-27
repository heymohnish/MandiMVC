using System.Net.Http;
using System.Text;
using System.Text.Json;
using Mandi.Extensions;
using Mandi.Models.Exceptions;
using Mandi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using JsonException = System.Text.Json.JsonException;
using JsonSerializer = System.Text.Json.JsonSerializer;
namespace Mandi.Services
{
    
    [ServiceFilter(typeof(RepositoryExceptionFilterAttribute))]
    public class HttpService : IHttpService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HttpService> _logger;

        public HttpService(HttpClient httpClient, ILogger<HttpService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<HttpResponseResult> SendRequestAsync(
                HttpMethod method,
                string url,
                object? body = null,
                Dictionary<string, string>? headers = null,
                Type? responseType = null,
                string? contentType = null)
        {
            var request = new HttpRequestMessage(method, url);

            if (headers != null)
            {
                foreach (var header in headers)
                    request.Headers.TryAddWithoutValidation(header.Key, header.Value);
            }

            if (body != null)
            {
                if (contentType == "application/x-www-form-urlencoded" && body is Dictionary<string, string> formData)
                {
                    request.Content = new FormUrlEncodedContent(formData);
                }
                else
                {
                    string jsonBody = JsonSerializer.Serialize(body);
                    request.Content = new StringContent(jsonBody, Encoding.UTF8, contentType ?? "application/json");
                }
            }

            var response = await _httpClient.SendAsync(request);
            var contentTypeHeader = response.Content.Headers.ContentType?.MediaType;
            if(contentTypeHeader?.Contains("application/pdf") == true)
            {
                var pdfBytes = await response.Content.ReadAsByteArrayAsync();

                return new HttpResponseResult
                {
                    StatusCode = (int)response.StatusCode,
                    File = pdfBytes,
                    IsSuccess = response.IsSuccessStatusCode
                };
            }
            var rawContent = await response.Content.ReadAsStringAsync();
            var result = new HttpResponseResult
            {
                StatusCode = (int)response.StatusCode,
                Content = rawContent,
                IsSuccess = response.IsSuccessStatusCode
            };
            if (!string.IsNullOrWhiteSpace(rawContent) && contentTypeHeader?.Contains("application/json") == true)
            {
                try
                {
                    var parsedJson = JsonSerializer.Deserialize<object>(rawContent);
                    result.ParsedObject = parsedJson;
                    if (response.IsSuccessStatusCode && responseType != null)
                    {
                        try
                        {
                            var typedObject = JsonSerializer.Deserialize(rawContent, responseType, new JsonSerializerOptions
                            {
                                PropertyNameCaseInsensitive = true
                            });
                            result.ParsedObject = typedObject;
                            result.Content = null;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "JSON deserialization failed.");
                            throw new HttpResponseException(result.StatusCode.ToString(), result.Content);
                        }

                    }
                    else
                    {
                        throw new HttpResponseException(result.StatusCode.ToString(), result.Content);
                    }
                }
                catch (JsonException ex)
                {
                    _logger.LogWarning(ex, "JSON deserialization failed.");
                }
            }

            return result;


        }
    }


}

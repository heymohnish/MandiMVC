using System.Net;
using System.Text.Json.Serialization;

namespace Mandi.DTOs
{
    public class ResponseDTO<T> where T : class
    {
        [JsonPropertyName("isSuccess")]
        public bool IsSuccess { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("statusCode")]
        public string StatusCode { get; set; }

        [JsonPropertyName("data")]
        public T? Data { get; set; }

        public ResponseDTO()
        {
            IsSuccess = false;
            Message = "Not available";
            StatusCode = "Not available";
            Data = null;
        }

        public void Response(bool status, T data, string message = "", string statusCode = "")
        {
            IsSuccess = status;
            Message = message;
            StatusCode = statusCode;
            Data = data;
        }

        public void Success(T data)
        {
            IsSuccess = true;
            Message = "Success";
            StatusCode = HttpStatusCode.OK.ToString();
            Data = data;
        }

        public void Error(string message = "An error occured.", string statusCode = "500")
        {
            IsSuccess = false;
            Message = message;
            StatusCode = statusCode;
            Data = null;
        }

        public void BadRequest()
        {
            IsSuccess = false;
            Message = "Bad Request";
            StatusCode = HttpStatusCode.BadRequest.ToString();
            Data = null;
        }

        public void RemoteServerError(string statusCode = "", string message = "The remote server returned an error")
        {
            IsSuccess = false;
            Message = $"{message} {statusCode}";
            StatusCode = HttpStatusCode.InternalServerError.ToString();
            Data = null;
        }
    }
}

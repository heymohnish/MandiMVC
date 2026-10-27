namespace Mandi.Extensions
{
    public class HttpResponseException : Exception
    {
        public string StatusCode { get; }

        public HttpResponseException(string statusCode, string message)
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
}

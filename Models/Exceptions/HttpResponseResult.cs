namespace Mandi.Models.Exceptions
{
    public class HttpResponseResult
    {
        public int StatusCode { get; set; }
        public string? Content { get; set; }
        public bool IsSuccess { get; set; }
        public object? ParsedObject { get; set; }
        public object? Data { get; set; }
        public byte[]? File { get; set; }
    }
}

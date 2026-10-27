using System.Text.Json.Serialization;

namespace Mandi.Models.Exceptions.response
{
    public class LoginErrorResponse:Exception
    {
        public string error { get; }
        public string error_description { get; }
        public int StatusCode { get; }


        public LoginErrorResponse(int statusCode, string error, string error_description) : base(error_description)
        {
            StatusCode = statusCode;
            this.error = error;
            this.error_description = error_description;
        }
    }
}

namespace Mandi.DTOs
{
    public class ExceptionDTO
    {
        public ExceptionDTO(string errorMessage, int statusCode)
        {
            StatusCode = statusCode;

            ErrorMessage = errorMessage;
        }

        public ExceptionDTO(string errorMessage)
        {
            StatusCode = 500;

            ErrorMessage = errorMessage;
        }

        public ExceptionDTO(Exception exception, int statusCode = 500)
        {
            StatusCode = statusCode;

            ErrorMessage = exception.Message;
        }

        public int StatusCode { get; private set; }
        public string ErrorMessage { get; private set; }
    }
}

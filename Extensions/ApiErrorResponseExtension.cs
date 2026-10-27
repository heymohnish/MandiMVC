using Mandi.Modals.Exceptions;
using System.Net;

namespace Mandi.Extensions
{
    public static class ApiErrorResponseExtension
    {
		public static ApiErrorResponse CreateErrorResponse(this Exception ex, int errorCode)
		{
			int statusCode = (int)HttpStatusCode.BadRequest;
			string message = "Failure";
			string error = ex.Message;

			if (ex is CustomException genieException)
			{
				error = genieException.ErrorCode;
			}

			if (ex.GetBaseException() is AuthorizationException authorizationException1)
			{
				statusCode = (int)HttpStatusCode.Unauthorized;
				error = authorizationException1.Message;
			}

			return new ApiErrorResponse(statusCode, ex.Message, message, errorCode);
		}
	}


	public class ApiErrorResponse : ApiResponse
	{
		public string Message { get; set; }
		public ErrorDetails Error { get; set; }
		public string Data { get; set; }
		public ApiErrorResponse(int statusCode, string error, string message,int errorCode)
			: base(statusCode)
		{
			Error = new ErrorDetails
			{
				Code = errorCode,
				Message = error
			};
			Message = message;
			Data = null;
		}
	}

	public class ErrorDetails
	{
		public int Code { get; set; }
		public string Message { get; set; }
	}
	public class ApiResponse
	{
		public int StatusCode { get; }

		public ApiResponse(int statusCode)
		{
			StatusCode = statusCode;
		}

	}
	public class ApiOkResponse<T> : ApiResponse
	{
		public int StatusCode { get; }
		public string Message { get; }
		public T Data { get; }
		public string? Error { get; }

		public ApiOkResponse(int statusCode, string message, T data, string error) : base((int)HttpStatusCode.OK)
		{
			StatusCode = (int)HttpStatusCode.OK;
			Message = message;
			Data = data;
			Error = error;
		}
	}


	public class ApiInsertResponse<T> : ApiResponse where T : IInsertData
	{
		public int StatusCode { get; }
		public string Message { get; }
		public InsertData Data { get; }
		public string? Error { get; }

		public ApiInsertResponse(int statusCode, string message, T data, string error) : base((int)HttpStatusCode.OK)
		{
			StatusCode = (int)HttpStatusCode.OK;
			Message = message;
			Data = new InsertData
			{
				id = data.id,
				message = data.message
			};
			Error = error;
		}
	}
	public interface IInsertData
	{
		int id { get; set; }
		string message { get; set; }
	}

	public class InsertData : IInsertData
	{
		public int id { get; set; }
		public string message { get; set; }
	}
}

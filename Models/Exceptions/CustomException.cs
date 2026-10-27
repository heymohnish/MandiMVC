using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Modals.Exceptions
{
	public class CustomException : Exception
	{

		public CustomException(string errorCode, string message, Exception exception) : base(message, exception)
		{
			ErrorCode = errorCode;
		}
		public CustomException(string errorCode, string message) : base(message)
		{
			ErrorCode = errorCode;
		}
		public CustomException(string errorCode) : this(errorCode, errorCode)
		{

		}

		public CustomException(Exception ex) : this("111", ex.Message, ex)
		{
		}

		public override IDictionary Data => GetData();
		public string ErrorCode { get; }
        public int StatusCode { get; internal set; }

        protected virtual Dictionary<string, object> GetData()
		{
			Dictionary<string, object> data = new Dictionary<string, object>
			{
				{ "ErrorCode", ErrorCode }
			};
			return data;
		}

	}

	public static class GenieExceptionExtension
	{

		public static ExceptionData GetExceptionData(this Exception ex)
		{
			var data = new ExceptionData()
			{
				Data = ex.Data,
				Message = ex.Message,
				Source = ex.Source,
				Type = ex.GetType().Name,
				StackTrace = ex.StackTrace,
				DateTime = DateTime.UtcNow
			};
			return data;
		}
	}
	public enum ErrorCode
	{
		ConverterNotFound = 100,
		PropertyInValidType,
		NotVaildObjectType,
		ValueConvertion,
		ValueNotFound,
		CannotConvertObject,
		ExpressionNotDefined,
		ApiError,
		ProcessNotFound,
		DesktopNotInitialize,
		WorkFlowContextInitialize,
		Unknown,
		ValueTypeNotDefined,
		TransactionNotCompleted,
		NotConnectToBMT,
		ServiceNotAvailable,
		InValidServiceUri,
		AutoRegisterCredentialMissing,
		LibraryProjectNotFound,
		SessionEnded,
		SessionLocked,
		ActivityPropertyInValidType,
		ServerMaintenanceNotActive
	}
	public enum SerializationErrorCode
	{
		JSTypeNotDefined = 4000,
		JSTypeNotFound,
		JSTypeNotRegister
	}
	public enum ProjectErrorCode
	{
		PE_AppSettings = 1500,
		PE_SessionVariable,
		PE_ProcessContextNotFound,
		PE_ArgumentType,
		PE_LocationType,
		PE_ActivityNotFound,
		PE_ProjectNotFound,
		PE_ProcessNotFound
	}

	public enum RepositoryErrorCode
	{
		RE_NotFound = 5000,
		RE_DuplicateValue = 5001,
		RE_PackageItem
	}

	public enum UIExplorerErrorCodes
	{
		Operation_Cancelled,
		Exception
	}
}

using Mandi.Extensions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Controllers.Base
{
	public class ApiControllerBase : ControllerBase
	{

        protected IActionResult ApiResponse(ApiResponse response)
        {
            return response.GetActionResult();
        }

        protected IActionResult ApiOkResponse<TResult>(TResult data)
        {
            return ApiResponse(new ApiOkResponse<TResult>((int)HttpStatusCode.OK, "Success", data, null));
        }

        protected IActionResult ApiInsertResponse(int id, string message)
        {
            var responseData = new InsertData
            {
                id = id,
                message = message
            };
            return ApiResponse(new ApiInsertResponse<InsertData>((int)HttpStatusCode.OK, "Success", responseData, null));
        }
        protected void ModalValidation()
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e =>
                        (e.ErrorMessage.Contains("could not be converted", StringComparison.OrdinalIgnoreCase)
                        || e.ErrorMessage.Contains("is an invalid JSON literal", StringComparison.OrdinalIgnoreCase))
                            ? "Invalid request data. Please check your input and try again."
                            : e.ErrorMessage
                    )
                    .Where(msg => !msg.Contains("The request field is required.", StringComparison.OrdinalIgnoreCase))
                    .Distinct()
                    .ToList();

                var finalErrorMessage = string.Join("; ", errorMessages);

                throw new ArgumentException(finalErrorMessage);
            }
        }

        //protected IActionResult ApiErrorResponse(Exception ex)
        //{
        //    var errorResponse = ex.CreateErrorResponse();
        //    return ApiResponse(new ApiResponse(errorResponse.StatusCode, errorResponse.Message, null, errorResponse.Error));
        //}

        //protected IActionResult ApiResponse(ApiResponse response)
        //{
        //	return response.GetActionResult();
        //}

        //protected IActionResult ApiOkResponse()
        //{
        //	return ApiResponse(new ApiResponse((int)HttpStatusCode.OK));
        //}

        //      protected IActionResult ApiOkResponse<TResult>(TResult response)
        //{
        //	return ApiResponse(new ApiOkResponse<TResult>(response));
        //}



        //protected IActionResult ApiInsertResponse(int id)
        //{
        //	return ApiResponse(new ApiInsertResponse(id));
        //}
    }
}

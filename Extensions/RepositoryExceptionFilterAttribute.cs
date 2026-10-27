using Mandi.Modals.Exceptions;
using Mandi.Models.Exceptions.response;
using Mandi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Mandi.Extensions
{
	public class RepositoryExceptionFilterAttribute : ExceptionFilterAttribute
	{
		private ILogger<RepositoryExceptionFilterAttribute> logger;
		private readonly IConfiguration _configuration;
		public RepositoryExceptionFilterAttribute(ILogger<RepositoryExceptionFilterAttribute> logger, IConfiguration configuration)
		{
			this.logger = logger;
            _configuration = configuration;
		}

        public override void OnException(ExceptionContext context)
        {
            logger.LogWarning(context.Exception, $"Error while processing request '{context.HttpContext.Request.Path}'");

            Exception ex = context.Exception;

            if (ex is SqlException sqlException)
            {
                ex = new CustomException(sqlException);
            }
            else if (ex is HttpResponseException httpEx)
            {
                ex = new CustomException(httpEx.StatusCode, httpEx.Message);
            }
            else if (ex is LoginErrorResponse customEx)
            {
                var selected = new
                {
                    customEx.error,
                    customEx.error_description,
                };

                string errorDetails = JsonConvert.SerializeObject(selected);
                ex = new CustomException(customEx.StatusCode.ToString(),errorDetails);
            }


            string controllerName = context.ActionDescriptor.RouteValues["controller"];
            int errorCode = GetErrorCodeForController(controllerName);

            context.Result = ex.CreateErrorResponse(errorCode).GetActionResult();
            context.HttpContext.Response.Headers.Add("g-e-handled", "true");
        }
        private int GetErrorCodeForController(string controllerName)
        {
            return controllerName switch
            {
                "Token" => 100,
                _ => 101 // Default error code
            };
        }
    }

    //[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)] // Allows it to be used on both classes and methods
    //public class RequiresApiKeyAttribute : Attribute
    //{
    //    // Optionally, you can include some logic or properties if needed
    //}

    //[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)] // Allows it to be used on both classes and methods
    //public class RequiresJwtAttribute : Attribute
    //{
    //    // Optionally, you can include some logic or properties if needed
    //}

}

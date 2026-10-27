using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Extensions
{
	public static class ApiResponseExtension
	{
        public static IActionResult GetActionResult(this ApiErrorResponse response)
        {
            return new ObjectResult(response)
            {
                StatusCode = response.StatusCode
            };
        }
		public static IActionResult GetActionResult(this ApiResponse response)
		{
			return new ObjectResult(response)
			{
				StatusCode = response.StatusCode
			};
		}

	}
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Modals.Exceptions
{
	public class AuthorizationException : CustomException
	{
		public AuthorizationException(string errorCode, string message) : base(errorCode, message)
		{
		}
	}
}

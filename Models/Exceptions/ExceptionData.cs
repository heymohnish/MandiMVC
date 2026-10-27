using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Modals.Exceptions
{
	public class ExceptionData
	{
		public string Type { get; set; }
		public string Message { get; set; }
		public string Source { get; set; }
		public IDictionary Data { get; set; }
		public string StackTrace { get; set; }
		public DateTime DateTime { get; set; }

	}
}

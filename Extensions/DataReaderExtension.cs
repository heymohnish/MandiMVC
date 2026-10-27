using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Extensions
{
	public static class DataReaderExtension
	{
		public static T GetValueOrDefault<T>(this IDataParameter sqlParameter)
		{
			if (sqlParameter.Value == DBNull.Value
				|| sqlParameter.Value == null)
			{
				if (typeof(T).IsValueType)
					return (T)Activator.CreateInstance(typeof(T));

				return (default(T));
			}

			return (T)sqlParameter.Value;
		}
		public static T GetValue<T>(this IDataReader reader, string fieldName)
		{
			return GetValue(reader, fieldName, default(T));
		}

		public static T GetValue<T>(this IDataReader reader, string fieldName, T defaultVal)
		{
			object o;
			for (int i = 0; i < reader.FieldCount; i++)
			{
				if (reader.GetName(i).Equals(fieldName, StringComparison.OrdinalIgnoreCase))
				{
					o = reader[i];
					if (o != null && o != DBNull.Value)
					{
						return ChangeType<T>(o);
					}
					else
						return defaultVal;
				}
			}
			return defaultVal;
		}
		public static T ChangeType<T>(object value)
		{
			var t = typeof(T);

			if (t.IsGenericType && t.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
			{
				if (value == null)
				{
					return default(T);
				}

				t = Nullable.GetUnderlyingType(t);
			}

			return (T)Convert.ChangeType(value, t);
		}
	}
}

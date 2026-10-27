using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Repository.Interface
{
	public interface IMapper
	{
		void Map(IDataReader reader);
	}

	public interface IDataMapper
	{
		Task Map(SqlDataReader reader);
	}

	public class IDataMapper<T> : IDataMapper where T : IMapper, new()
	{
		private readonly Func<IDataReader, T> createInstance;

		public IDataMapper()
		{
		}
		public IDataMapper(Func<IDataReader, T> createInstance)
		{
			this.createInstance = createInstance;
		}

		private T data;
		public T Data
		{
			get
			{
				return data;
			}
		}
		public async Task Map(SqlDataReader reader)
		{
			while (await reader.ReadAsync())
			{
				data = CreateInstance(reader);
				data.Map(reader);
				break;
			}
		}

		protected virtual T CreateInstance(IDataReader reader)
		{
			return createInstance == null ? new T() : createInstance(reader);
		}

	}

	public class TupleDataMapper<T1, T2> : IDataMapper where T1 : IMapper, new() where T2 : IMapper, new()
	{
		public TupleDataMapper()
		{

		}

		private Tuple<T1, T2> data;

		public Tuple<T1, T2> Data
		{
			get
			{
				return data;
			}
		}

		public async Task Map(SqlDataReader reader)
		{
			while (await reader.ReadAsync())
			{
				T1 t1 = new T1();
				T2 t2 = new T2();
				t1.Map(reader);
				t2.Map(reader);
				data = new Tuple<T1, T2>(t1, t2);
				break;
			}
		}
	}

	public class TupleCollectionDataMapper<T1, T2> : IDataMapper where T1 : IMapper, new() where T2 : IMapper, new()
	{
		public TupleCollectionDataMapper()
		{

		}
		private List<Tuple<T1, T2>> data;
		public List<Tuple<T1, T2>> Data
		{
			get
			{
				if (data == null)
					throw new ArgumentNullException("Data");
				return data;
			}
		}
		public async Task Map(SqlDataReader reader)
		{
			data = new List<Tuple<T1, T2>>();
			while (await reader.ReadAsync())
			{
				T1 t1 = new T1();
				T2 t2 = new T2();
				t1.Map(reader);
				t2.Map(reader);
				Tuple<T1, T2> item = new Tuple<T1, T2>(t1, t2);
				data.Add(item);
			}
		}
	}

	public class CollectionDataMapper<T> : IDataMapper where T : IMapper, new()
	{
		private readonly Func<IDataReader, T> createInstance;
		public CollectionDataMapper()
		{

		}
		public CollectionDataMapper(Func<IDataReader, T> createInstance)
		{
			this.createInstance = createInstance;
		}
		private List<T> data;
		public List<T> Data
		{
			get
			{
				if (data == null)
					throw new ArgumentNullException("Data");
				return data;
			}
		}
		public async Task Map(SqlDataReader reader)
		{
			data = new List<T>();
			while (await reader.ReadAsync())
			{
				T item = CreateInstance(reader);
				item.Map(reader);
				data.Add(item);

			}
		}

		protected virtual T CreateInstance(IDataReader reader)
		{
			return createInstance == null ? new T() : createInstance(reader);
		}
	}

	public class ActionDataMapper<T> : IDataMapper
	{
		private Func<IDataReader, T> createValue;
		public ActionDataMapper(Func<IDataReader, T> createValue)
		{
			this.createValue = createValue;
		}

		private List<T> data;
		public List<T> Data
		{
			get
			{
				if (data == null)
					throw new ArgumentNullException("Data");
				return data;
			}
		}
		public async Task Map(SqlDataReader reader)
		{
			data = new List<T>();
			while (await reader.ReadAsync())
			{
				T item = CreateInstance(reader);
				data.Add(item);

			}
		}

		protected virtual T CreateInstance(IDataReader reader)
		{
			return createValue.Invoke(reader);
		}
	}

	public class CollectionDataMapper<T1, T2> : IDataMapper where T1 : IMapper, new()
		where T2 : IMapper, new()
	{
		public CollectionDataMapper()
		{

		}
		private List<T1> data1;
		public List<T1> Data1
		{
			get
			{
				if (data1 == null)
					throw new ArgumentNullException("Data");
				return data1;
			}
		}
		private List<T2> data2;
		public List<T2> Data2
		{
			get
			{
				if (data2 == null)
					throw new ArgumentNullException("Data");
				return data2;
			}
		}
		public async Task Map(SqlDataReader reader)
		{
			data1 = await GetData<T1>(reader);
			await reader.NextResultAsync();
			data2 = await GetData<T2>(reader);
		}

		private async Task<List<TData>> GetData<TData>(SqlDataReader reader) where TData : IMapper, new()
		{
			List<TData> collection = new List<TData>();
			while (await reader.ReadAsync())
			{
				TData item = new TData();
				item.Map(reader);
				collection.Add(item);
			}
			return collection;
		}


	}
}

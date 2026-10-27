using Mandi.Modals.Exceptions;
using Mandi.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mandi.Repository.Base
{
	public class RepositoryBase : IRepository
    {
		protected string _connectionStrings;
        public RepositoryBase(string connectionStrings)
		{
			_connectionStrings = connectionStrings;
		}

		
        protected async Task ExecuteSP(string spName, Action<SqlParameterCollection> parameterize = null, IDataMapper dataMapper = null, Action<SqlParameterCollection> onCompleted = null, ConnectionStringType connectionStringType = ConnectionStringType.TaskTrackerBusiness, SqlConnection sqlConnection=null,SqlTransaction sqlTransaction = null)
        {
			bool isConnection = sqlConnection == null;
			if (isConnection) {
				
				sqlConnection = await BuildSQLConnection(_connectionStrings);
			}
            using (SqlCommand cmd = new SqlCommand(spName, sqlConnection))
            {
                cmd.CommandTimeout = 360;
                cmd.CommandType = CommandType.StoredProcedure;
				if(sqlTransaction != null)
				{
					cmd.Transaction = sqlTransaction;
				}
                parameterize?.Invoke(cmd.Parameters);
                using (SqlDataReader reader = await ExecuteReader(() => cmd.ExecuteReaderAsync()))
                {
                    if (dataMapper != null)
                        await dataMapper.Map(reader);
                    onCompleted?.Invoke(cmd.Parameters);

                }
            }
			if (isConnection)
			{
				await sqlConnection.CloseAsync();
			}
        }

        private async Task<SqlConnection> BuildSQLConnection(string connectionString)
		{
			try
			{
				var connection = new SqlConnection(BuildSqlConnectionString(connectionString));
				await connection.OpenAsync();
				return connection;
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}
		public enum ConnectionStringType
		{
			TaskTrackerBusiness,
			TaskTrackerMeta,
			NGS
		}
		private string BuildSqlConnectionString(string connectionString)
		{
			SqlConnectionStringBuilder sqlConnectionStringBuilder = new SqlConnectionStringBuilder();
			sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);
			sqlConnectionStringBuilder.ConnectTimeout = 120;
			sqlConnectionStringBuilder.ConnectRetryCount = 6;
			sqlConnectionStringBuilder.ConnectRetryInterval = 20;
			return sqlConnectionStringBuilder.ToString();
		}

		private async Task<T> ExecuteReader<T>(Func<Task<T>> executeReader)
		{
			try
			{
				return await executeReader();
			}
			catch (SqlException ex)
			{
				if (ex.Number == 6001)
				{
					throw new CustomException(ex);
				}
				else
				{
					throw new CustomException(ex);
				}
			}
		}

		public void Dispose()
		{
		}
        protected async Task<bool> ExecuteInsertSP(string spName,Action<SqlParameterCollection> parameterize = null,ConnectionStringType connectionStringType = ConnectionStringType.TaskTrackerBusiness,SqlConnection sqlConnection = null,SqlTransaction sqlTransaction = null)
        {
            bool isConnection = sqlConnection == null;
            if (isConnection)
            {
                sqlConnection = await BuildSQLConnection(_connectionStrings);
            }

            try
            {
                using (SqlCommand cmd = new SqlCommand(spName, sqlConnection))
                {
                    cmd.CommandTimeout = 360;
                    cmd.CommandType = CommandType.StoredProcedure;

                    if (sqlTransaction != null)
                        cmd.Transaction = sqlTransaction;

                    parameterize?.Invoke(cmd.Parameters);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();

                    return rowsAffected > 0; 
                }
            }
            catch
            {
                return false;
            }
            finally
            {
                if (isConnection)
                    await sqlConnection.CloseAsync();
            }
        }

        protected async Task<T> ExecuteScalarSP<T>(string spName,Action<SqlParameterCollection> parameterize = null,ConnectionStringType connectionStringType = ConnectionStringType.TaskTrackerBusiness)
        {
            using (var connection = await BuildSQLConnection(_connectionStrings))
            using (var cmd = new SqlCommand(spName, connection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                parameterize?.Invoke(cmd.Parameters);
                object result = await cmd.ExecuteScalarAsync();
                return (T)Convert.ChangeType(result, typeof(T));
            }
        }
    }
}

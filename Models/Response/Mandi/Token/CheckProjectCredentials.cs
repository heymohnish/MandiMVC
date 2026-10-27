using Mandi.Repository.Interface;
using System.Data;

namespace Mandi.Models.Response.Mandi.Token
{
    public class CheckProjectCredentials : IMapper
    {
        public int? Id { get; set; }
        public int? Status { get; set; }
        public string? ProjectName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? TokenExpireTime { get; set; }
        public bool? IsTokenActive { get; set; }
        public void Map(IDataReader reader)
        {
            var columns = Enumerable.Range(0, reader.FieldCount)
                                 .Select(reader.GetName)
                                 .ToHashSet(StringComparer.OrdinalIgnoreCase);
            Id = columns.Contains("Id") && reader["Id"] != DBNull.Value
            ? Convert.ToInt32(reader["Id"]) : (int?)null;

            Status = columns.Contains("Status") && reader["Status"] != DBNull.Value
                     ? Convert.ToInt32(reader["Status"]) : (int?)null;

            ProjectName = columns.Contains("ProjectName") && reader["ProjectName"] != DBNull.Value
                          ? reader["ProjectName"].ToString() : null;

            RefreshToken = columns.Contains("RefreshToken") && reader["RefreshToken"] != DBNull.Value
                           ? reader["RefreshToken"].ToString() : null;

            TokenExpireTime = columns.Contains("TokenExpireTime") && reader["TokenExpireTime"] != DBNull.Value
                              ? Convert.ToDateTime(reader["TokenExpireTime"]) : (DateTime?)null;

            IsTokenActive = columns.Contains("IsTokenActive") && reader["IsTokenActive"] != DBNull.Value
                            ? Convert.ToBoolean(reader["IsTokenActive"]) : (bool?)null;

        }
    }
}

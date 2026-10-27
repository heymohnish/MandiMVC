using Mandi.Repository.Interface;
using System.Data;
namespace Mandi.DTOs
{
    public class MemberDto : IMapper
    {
        public int Id { get; set; }
        public string FirstName { get; set; }

        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string AddedDate { get; set; }

        public void Map(IDataReader reader)
        {
            Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0;
            FirstName = reader["FirstName"] != DBNull.Value ? Convert.ToString(reader["FirstName"]) : null;
            MiddleName = reader["MiddleName"] != DBNull.Value ? Convert.ToString(reader["MiddleName"]) : null;
            LastName = reader["LastName"] != DBNull.Value ? Convert.ToString(reader["LastName"]) : null;
            PhoneNumber = reader["PhoneNumber"] != DBNull.Value ? Convert.ToString(reader["PhoneNumber"]) : null;
            AddedDate = reader["AddedDate"] != DBNull.Value ? Convert.ToString(reader["AddedDate"]) : null;
        }
    }
}

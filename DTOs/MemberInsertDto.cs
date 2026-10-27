namespace Mandi.DTOs
{
    public class MemberInsertDto
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime AddedDate { get; set; }
        public string PersonNumber { get; set; }
        public DateTime UpdatedDate { get; set; }
        //public Role Role { get; set; }
    }

    public enum Role
    {
        Agent = 1,
        Member = 2,
        Supervisor = 3,
        System = 4
    }
}

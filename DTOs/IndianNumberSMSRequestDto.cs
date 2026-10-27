namespace Mandi.DTOs
{
    public class IndianNumberSMSRequestDto
    {
        public string DLTHeader { get; set; }
        public List<string> ToPhoneNumbers { get; set; }
        public string Body { get; set; }
        public string TemplateName { get; set; }
    }
}

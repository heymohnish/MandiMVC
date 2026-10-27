namespace Mandi.Models.Response.Mandi.Token
{
    public class Token
    {
        public string access_token { get; set; }
        public DateTime expires_in { get; set; }
        public string refresh_token { get; set; }
    }
}

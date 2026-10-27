namespace Mandi.Models.Request.Mandi.Token
{
    public class ProjectCredentials
    {
        public string? ProjectKey { get; set; }
        public string? ProjectSecret { get; set; }
        public string? RefrestToken { get; set; }
        public DateTime? TokenExpireTime { get; set; }
    }
    public class UpdateToken {
        public string Flag { get; set; }
        public string ProjectKey { get; set; }
        public int Id { get; set; }
        public string? RefrestToken { get; set; }
    }

}

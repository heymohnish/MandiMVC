using System.Text.Json.Serialization;

namespace Mandi.DTOs
{
    public class LoginResponseDTO
    {
        [JsonPropertyName("username")]
        public int UserId { get; set; }

        [JsonPropertyName("username")]
        public string Username { get; set; }

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public string LastName { get; set; }

        [JsonPropertyName("address")]
        public string Address { get; set; }
    }
}

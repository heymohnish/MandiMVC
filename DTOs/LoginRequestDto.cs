using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Mandi.DTOs
{
    public class LoginRequestDTO
    {
        [JsonPropertyName("username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [JsonPropertyName("password")]
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}


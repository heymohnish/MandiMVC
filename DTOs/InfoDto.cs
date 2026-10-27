using System.Text.Json.Serialization;

namespace Mandi.DTOs
{
    public class InfoDTO
    {
        [JsonPropertyName("assemblyName")]
        public string? AssemblyName { get; set; }

        [JsonPropertyName("assemblyVersion")]
        public string? AssemblyVersion { get; set; }

        [JsonPropertyName("lastUpdateOn")]
        public DateTime? LastUpdateOn { get; set; }
    }
}

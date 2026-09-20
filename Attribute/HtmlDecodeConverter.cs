using Newtonsoft.Json;
using System.Net;

public class HtmlDecodeConverter : JsonConverter<string>
{
    public override string ReadJson(JsonReader reader, Type objectType, string existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.Value == null) return null;
        return WebUtility.HtmlDecode(reader.Value.ToString());
    }

    public override void WriteJson(JsonWriter writer, string value, JsonSerializer serializer)
    {
        writer.WriteValue(value);
    }
}

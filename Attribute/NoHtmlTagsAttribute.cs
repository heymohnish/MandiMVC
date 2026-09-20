
using System.ComponentModel.DataAnnotations;
using System.Reflection.Emit;

public class NoHtmlTagsAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {

        if (value is string stringValue && (stringValue.Contains("<") || stringValue.Contains(">")||
            stringValue.Contains("&") || stringValue.Contains("[") || stringValue.Contains("]")
            ))
        {
            return new ValidationResult("HTML tags are not allowed.");
        }

        return ValidationResult.Success;
    }
}

using System.ComponentModel.DataAnnotations;

namespace Mandi.Attribute
{
    
    public class ValidGuidAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            if (value is string stringValue && !Guid.TryParse(stringValue, out _))
            {
                return new ValidationResult("Invalid ID");
            }

            return ValidationResult.Success;
        }
    }
}

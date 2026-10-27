using System.ComponentModel.DataAnnotations;

namespace Mandi.Attribute
{
    public class MinimalNameAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is string stringValue && stringValue.Length >=51 && IsValidFileName(stringValue))
            {
                return new ValidationResult("Name should not contain more than 50 character");
            }
          
            return ValidationResult.Success;
        }
        public static bool IsValidFileName(string fileName)
        {
            char[] invalidChars = Path.GetInvalidFileNameChars();
            if (fileName.Any(c => invalidChars.Contains(c)))
            {
                return false;  
            }
            return true;
        }
    }

}

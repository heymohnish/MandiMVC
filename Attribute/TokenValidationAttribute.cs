using BitCure.Patient360.Filters;
using Microsoft.AspNetCore.Mvc;

namespace BitCure.Patient360.Attribute
{
    public class TokenValidationAttribute : TypeFilterAttribute
    {
        public TokenValidationAttribute() : base(typeof(TokenValidationFilter))
        {
        }
    }

}

using Mandi.Models.Request.Mandi.Token;

namespace Mandi.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> RevokeToken(string token);

    }
}

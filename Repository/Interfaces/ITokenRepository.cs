
using Mandi.Models.Request.Mandi.Token;
using Mandi.Models.Response.Mandi.Token;

namespace Mandi.Repository.Interfaces
{
    public interface ITokenRepository
    {
        Task<CheckProjectCredentials> CheckProjectCredentials(ProjectCredentials projectCredentials,string flag);
        Task UpdateToken(UpdateToken projectCredentials);
        Task RevokeToken(string token);
    }
}

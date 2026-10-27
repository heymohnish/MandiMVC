using Mandi.Repository.Interfaces;
using Mandi.Services.Interfaces;

namespace Mandi.Repository.Interfaces
{
    public interface IUnitOfWork
    {
        ITokenRepository TokenRepository { get; }
    }
}
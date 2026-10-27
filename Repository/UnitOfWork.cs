using Mandi.Models;
using Mandi.Repository.Interfaces;
using Mandi.Services;
using Mandi.Services.Interfaces;

namespace Mandi.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        public ITokenRepository TokenRepository { get; }
        public UnitOfWork(ITokenRepository tokenRepository)
        {
            TokenRepository = tokenRepository;
           
        }
    }
}
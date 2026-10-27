using Mandi.Controllers.Base;
using Mandi.Extensions;
using Mandi.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;

namespace Mandi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(RepositoryExceptionFilterAttribute))]
    public class AccessController : ApiControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        public AccessController( )
        {
        }
       
    }
}

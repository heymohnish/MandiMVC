using Mandi.Controllers.Base;
using Mandi.Extensions;
using Mandi.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;

namespace Mandi.Controllers
{
    
    public class AccessController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public AccessController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

    }
}

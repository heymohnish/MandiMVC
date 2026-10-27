namespace Mandi.Middleware
{
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;

        public SecurityHeadersMiddleware(RequestDelegate next, IWebHostEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            var strictCspPaths = new List<string>
        {
                "/sign/requests",
                "/sign/requestsend",
                "/sign/signerrequest",
                "/sign/selfsignrequest",
                "/sign/selfsign",
                "/sign/dashboard",
                "/template/create",
                "/template/send",
                "/template/update",
                "/document/documents",
                "/template/all",
                "/template/send",
                "/signform/all",
                "/signform/signresponse",
                "/reports/all",
                "/reports/reportdocumentview",
                "/settings/myprofile",
                "/settings/trash",
                "/settings/preview",
                "/settings/templatepreview",
                "/signform/form",
                "/signform/response",
                "/access/signin",
                "/access/register",
                "/access/forgotpassword",
                "/access/changepassword",
                "/access/verifyotp",
                "/access/verifyotpforpasswordupdate",
                "/sign/signerauth",
                "/signform/auth",



        };

            var nonce = Guid.NewGuid().ToString("N");
            context.Items["Nonce"] = nonce;

            if (strictCspPaths.Any(p => context.Request.Path.StartsWithSegments(p, StringComparison.OrdinalIgnoreCase)))
            {
                context.Response.Headers.Add(
                    "Content-Security-Policy",
                    $"default-src 'self'; " +
                    $"font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
                    $"img-src 'self' data: https:; " +
                    $"script-src 'self' 'nonce-{nonce}' https://www.google.com https://www.gstatic.com; " +
                    $"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
                    $"frame-src 'self' https://www.google.com; " +
                    $"worker-src 'self' blob:;"
                );
            }
            else
            {
                context.Response.Headers.Add(
                    "Content-Security-Policy",
                    "default-src 'self'; " +
                    "img-src 'self' data: https:; " +
                    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
                    "style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com 'unsafe-inline'; " +
                    "script-src 'self' https://www.google.com https://www.gstatic.com 'unsafe-inline' 'unsafe-eval' blob:; " +
                    "frame-src 'self' https://www.google.com/ https://www.gstatic.com/; " +
                    "worker-src 'self' blob:;"
                );
            }

            await _next(context);
        }
    }
}

using Mandi.DTOs;
using Mandi.Repository.Base;
using Mandi.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Mandi.Services
{
    public class JWTService 
    {
        private readonly IConfiguration _configuration;

        public JWTService(IConfiguration configuration) 
        {
            _configuration = configuration;
        }


        public async Task<TokenResponseDTO> GenerateToken(string projectKey, string refreshToken)
        {            
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim("project_key", projectKey),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                 expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: credentials
            );
            return new TokenResponseDTO
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                RefreshToken = refreshToken
            };
        }

    }
}

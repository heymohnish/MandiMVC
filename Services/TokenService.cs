using Mandi.Extensions;
using Mandi.Models.Exceptions;
using Mandi.Models.Request.Mandi.Token;
using Mandi.Models.Response.Mandi.Token;
using Mandi.Repository;
using Mandi.Repository.Interfaces;
using Mandi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Mandi.Services
{
    [ServiceFilter(typeof(RepositoryExceptionFilterAttribute))]
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly IHttpService _httpService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly JWTService _jWTService;
        private readonly IMemoryCache _cache;

        public TokenService(IMemoryCache cache, IConfiguration configuration, IHttpService httpService, IUnitOfWork unitOfWork
            ,JWTService jWTService)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
            _httpService = httpService;
            _unitOfWork = unitOfWork;
            _jWTService = jWTService;
            _cache = cache;
        }
        public async Task<object> GenerateAccessToken(ProjectCredentials projectCredentials)
        {
            try
            {
                if(projectCredentials.RefrestToken != null)
                {
                    CheckProjectCredentials checkCredentialToken = await _unitOfWork.TokenRepository.CheckProjectCredentials(projectCredentials, "RefreshToken");
                    if (checkCredentialToken != null&& (bool)checkCredentialToken.IsTokenActive)
                    {
                        if(checkCredentialToken.TokenExpireTime < DateTime.UtcNow)
                        {
                            throw new Exception("Token Expired");
                        }
                        var refreshToken = await EncryptToCiberText(GetRefreshToken());
                        UpdateToken updateToken = new UpdateToken()
                        {
                            Flag = "RefreshToken",
                            Id = (int)checkCredentialToken.Id,
                            RefrestToken = refreshToken
                        };
                        await _unitOfWork.TokenRepository.UpdateToken(updateToken);
                        return await _jWTService.GenerateToken(checkCredentialToken.ProjectName, refreshToken);
                    }
                    else
                    {
                        throw new Exception("Invalid Project Credentials");
                    }
                }
                else
                {
                    CheckProjectCredentials checkCredentials = await _unitOfWork.TokenRepository.CheckProjectCredentials(projectCredentials, "ProjectKey");
                    if (checkCredentials.Status == 200)
                    {
                        var refreshToken = await EncryptToCiberText( GetRefreshToken());
                        UpdateToken updateToken = new UpdateToken()
                        {
                            Flag = "ProjectKey",
                            ProjectKey = projectCredentials.ProjectKey,
                            RefrestToken = refreshToken
                        };
                        await _unitOfWork.TokenRepository.UpdateToken(updateToken);
                        return await _jWTService.GenerateToken(checkCredentials.ProjectName, refreshToken);
                    }
                    else
                    {
                        throw new Exception("Invalid Project Credentials");
                    }
                }
                   
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            


        }
        public string GetRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
            }
            return Convert.ToBase64String(randomNumber);
        }
        public async Task<string> RevokeToken(string token)
        {
            await _unitOfWork.TokenRepository.RevokeToken(token);
            return "Token Revoked";
        }
        
        public async Task< string> GenerateRandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public async Task<string> EncryptToCiberText(string plainText)
        {
            string passPhrase = Convert.ToString(_configuration["Hash:Key"]);
            string saltValue = Convert.ToString(_configuration["Hash:SaltValue"]);
            string hashAlgorithm = "SHA1";
            int passwordIterations = 3;
            string initVector = "@2B3c4D4e6F6g8H9";
            int keySize = 256;

            byte[] initVectorBytes = Encoding.ASCII.GetBytes(initVector);
            byte[] saltValueBytes = Encoding.ASCII.GetBytes(saltValue);


            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);


            PasswordDeriveBytes password = new PasswordDeriveBytes
            (
                passPhrase,
                saltValueBytes,
                hashAlgorithm,
                passwordIterations
            );
            byte[] keyBytes = password.GetBytes(keySize / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;

            ICryptoTransform encryptor = symmetricKey.CreateEncryptor
            (
                keyBytes,
                initVectorBytes
            );

            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream
            (
                memoryStream,
                encryptor,
                CryptoStreamMode.Write
            );

            cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);

            cryptoStream.FlushFinalBlock();

            byte[] cipherTextBytes = memoryStream.ToArray();

            memoryStream.Close();
            cryptoStream.Close();
            string cipherText = Convert.ToBase64String(cipherTextBytes);

            return cipherText;
        }


    }
}

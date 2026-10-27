
using Mandi.Models.Request.Mandi.Token;
using Mandi.Models.Response.Mandi.Token;
using Mandi.Repository.Base;
using Mandi.Repository.Interface;
using Mandi.Repository.Interfaces;
using System.Data.SqlClient;

namespace Mandi.Repository
{
    public class TokenRepository: RepositoryBase, ITokenRepository
    {
        
        public TokenRepository(string connectionStrings, IConfiguration configuration) : base(connectionStrings)
        {
        }
        public async Task<CheckProjectCredentials> CheckProjectCredentials(ProjectCredentials projectCredentials,string flag)
        {
            try
            {
                var dataMapper = new CollectionDataMapper<CheckProjectCredentials>();
                await ExecuteSP("[dbo].[SPS_CheckProjectCredentials]", (SqlParameterCollection parameters) =>
                {
                    parameters.AddWithValue("@Flag", flag);
                    parameters.AddWithValue("@ProjectKey", projectCredentials.ProjectKey);
                    parameters.AddWithValue("@ProjectSecret", projectCredentials.ProjectSecret);
                    parameters.AddWithValue("@RefreshToken", projectCredentials.RefrestToken);
                }, dataMapper);
                var resorts = dataMapper.Data;
                return resorts.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
            
        }
        public async Task UpdateToken(UpdateToken projectCredentials)
        {
            var dataMapper = new CollectionDataMapper<CheckProjectCredentials>();
            await ExecuteSP("[dbo].[SP_UpdateProjectToken]", (SqlParameterCollection parameters) =>
            {
                parameters.AddWithValue("@Id", projectCredentials.Id);
                parameters.AddWithValue("@Flag", projectCredentials.Flag);
                parameters.AddWithValue("@RefreshToken", projectCredentials.RefrestToken);
                parameters.AddWithValue("@ProjectKey", projectCredentials.ProjectKey);
            } );
            
        }
        public async Task RevokeToken(string token)
        {
            await ExecuteSP("[dbo].[SP_InActiveProjectToken]", (SqlParameterCollection parameters) =>
            {
                parameters.AddWithValue("@RefreshToken", token);
            });
        }    
    }
}

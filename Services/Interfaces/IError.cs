namespace Mandi.Services.Interfaces
{
    public interface IError
    {
        Task LogErrorWithMethodNameAndClassName(Exception ex);
        
    }
}

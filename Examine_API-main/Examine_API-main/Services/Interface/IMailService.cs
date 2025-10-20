
namespace TodoApi2
{

    public interface IMailService
    {
        Task<bool> SendAsync(MailData mailData, CancellationToken ct);
    }



}
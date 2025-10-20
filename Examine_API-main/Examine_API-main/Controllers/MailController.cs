

using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace TodoApi2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IMailService _mail;

        public MailController(IMailService mail)
        {
            _mail = mail;
        }

        [HttpPost("sendmail")]
        public async Task<IActionResult> SendMailAsync(MailData mailData)
        {

            bool result = await _mail.SendAsync(mailData, new CancellationToken());

            if (result)
            {
                return StatusCode(StatusCodes.Status200OK, "Mail has successfully been sent.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured. The Mail could not be sent.");
            }
        }


        [HttpPost("sendmail2")]
        public void SendMailAsync2(MailData mailData)
        {
            try
            {


                var messageToSend = new MimeMessage();


                messageToSend.From.Add(new MailboxAddress("晨悅", "mornjoy@mornjoy.com.tw"));
                // messageToSend.Sender("晨悅", "mornjoy@mornjoy.com.tw");
                // 添加收件者
                messageToSend.To.Add(new MailboxAddress("DUKE", "redredxiii@msn.com"));

                messageToSend.Subject = "恭喜";

                // 使用 BodyBuilder 建立郵件內容
                // var bodyBuilder = new BodyBuilder();

                // // 設定文字內容
                // bodyBuilder.TextBody = "文字內容";

                // // 設定 HTML 內容
                // bodyBuilder.HtmlBody = "<p> HTML 內容 </p>";
                // messageToSend.Body = bodyBuilder.ToMessageBody();
                using (var client = new SmtpClient())
                {
                    // 此範例已Outlook為例
                    // var host = "smtp-mail.outlook.com";
                    // var port = 587;

                    var host = "mail.mornjoy.com.tw";
                    var port = 25;


                    // 預設為(Auto)也可以如有錯誤可透過明確定義來試試
                    //client.Connect(host,port);
                    // 明確定義透過TLS(StartTls)連線建立連線服務 
                    client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                    // 透過指定用戶發送：用戶名、密碼驗證
                    client.AuthenticateAsync("mornjoy", "Mj123456");

                    // 發送Mail
                    client.SendAsync(messageToSend, new CancellationToken());
                    // client.Send(messageToSend);

                    // 斷開連接(ture)
                    client.Disconnect(true);


                    Console.WriteLine("Done");
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }


        }
    }
}
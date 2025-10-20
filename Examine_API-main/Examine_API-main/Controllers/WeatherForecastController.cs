using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using MimeKit;

namespace TodoApi2.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [Route("[action]")]
    [HttpGet]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }

    // [HttpGet("SendEmail")]
    // public async Task<IActionResult> Get2()
    // {
    //     #region OAuth驗證
    //     const string GMailAccount = "前置作業文章打上去的測試帳號";

    //     var clientSecrets = new ClientSecrets
    //     {
    //         ClientId = "前置作業文章最後給的用戶ID",
    //         ClientSecret = "前置作業文章最後給的用戶端密碼"
    //     };

    //     var codeFlow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
    //     {
    //         DataStore = new FileDataStore("CredentialCacheFolder", false),
    //         Scopes = new[] { "https://mail.google.com/" },
    //         ClientSecrets = clientSecrets
    //     });

    //     var codeReceiver = new LocalServerCodeReceiver();
    //     var authCode = new AuthorizationCodeInstalledApp(codeFlow, codeReceiver);

    //     var credential = await authCode.AuthorizeAsync(GMailAccount, CancellationToken.None);

    //     if (credential.Token.IsExpired(SystemClock.Default))
    //         await credential.RefreshTokenAsync(CancellationToken.None);

    //     var oauth2 = new SaslMechanismOAuth2(credential.UserId, credential.Token.AccessToken);
    //     #endregion

    //     #region 信件內容
    //     var message = new MimeMessage();
    //     //寄件者名稱及信箱(信箱是測試帳號)
    //     message.From.Add(new MailboxAddress("bill", "xxxx@gmail.com"));
    //     //收件者名稱，收件者信箱
    //     message.To.Add(new MailboxAddress("Duke Lai", "redredxiii@msn.com"));
    //     //信件標題
    //     message.Subject = "[晨悅]驗證碼";
    //     //信件內容
    //     message.Body = new TextPart("plain")
    //     {
    //         Text = @"您的驗證碼是 34678"
    //     };
    //     using (var client = new SmtpClient())
    //     {
    //         await client.Connect("mail.mornjoy.com.tw", 25);
    //         await client.AuthenticateAsync(oauth2);
    //         await client.Send(message);
    //         await client.DisconnectAsync(true);
    //     }
    //     #endregion

    //     return Ok("OK");
    // }
}



using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Configuration;
using CompressedStaticFiles;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
// using Imageflow.Server;
// using ImageResizer.AspNetCore.Helpers;
// using Imageflow.Server;
// using System.IO.Compression;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Caching;
using SixLabors.ImageSharp.Web.Providers;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

string[] originAllowed = { "http://localhost:3000", "https://mj.mornjoy.com.tw/" };

var builder = WebApplication.CreateBuilder(args);


// builder.Services.AddResponseCompression(options =>
// {
//     // options.EnableForHttps = true;
//     options.Providers.Add<GzipCompressionProvider>();
//     options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] {
//   "image/jpeg", "image/png", "application/font-woff2", "image/svg+xml"});
// });
builder.Services.AddImageSharp();

// builder.Services.AddImageSharp()
//               .ClearProviders()
//               ;

builder.Services.AddImageSharp()
    .RemoveProvider<PhysicalFileSystemProvider>()
    .AddProvider<CustomPhysicalFileSystemProvider>()
    .Configure<CustomPhysicalFileSystemProviderOptions>(options =>
    {
        options.RequestPath = "/Pictures";
        // options.ContentPath = @"//Users/duke.lai/Documents/Examine/src/Pictures";
        // options.ContentPath = @"E:\Medirep";
    });
// builder.Services.Configure<GzipCompressionProviderOptions>(options =>
// {
//     options.Level = CompressionLevel.Optimal;
// });
// builder.Services.AddImageSharp(options =>
// {
//     options.Configuration = Configuration.Default;
//     options.BrowserMaxAge = TimeSpan.FromHours(12);
//     options.CacheMaxAge = TimeSpan.FromDays(30);
//     options.CacheHashLength = 8;
// }).Configure<PhysicalFileSystemCacheOptions>(options =>
// {
//     options.CacheFolder = "Images";
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins(originAllowed).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
});

// builder.Services.AddImageResizer();

// builder.Services.AddResponseCompression(options =>
// {
//     options.EnableForHttps = true;
// });
// builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
//     {
//         builder.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
//     }));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDirectoryBrowser();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));
builder.Services.AddTransient<IMailService, MailService>();
// builder.Services.AddCompressedStaticFiles();

AccessToDb.ConnectionString = builder.Configuration.GetConnectionString("Examine");
AccessToDb.ConnectionString_Medirep = builder.Configuration.GetConnectionString("Medirep");
AccessToDb.ConnectionString_CYERP = builder.Configuration.GetConnectionString("CYERP");
AccessToDb.ConnectionString_HR = builder.Configuration.GetConnectionString("HR");
AccessToDb.ConnectionString_gbsso = builder.Configuration.GetConnectionString("gbsso");
AccessToDb.ConnectionString_gbcyerp = builder.Configuration.GetConnectionString("gbcyerp");
AccessToDb.ConnectionString_GBBPM = builder.Configuration.GetConnectionString("GBBPM");

var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);
// app.UseResponseCompression();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // app.UseFileServer(new FileServerOptions
    // {
    //     FileProvider = new PhysicalFileProvider(@"//Users/duke.lai/Documents/Examine/src/Pictures"),    //測試用
    //     RequestPath = new PathString("/Pictures"),
    //     EnableDirectoryBrowsing = true
    // });
}
else
{
       
    // app.UseFileServer(new FileServerOptions
    // {
    //     FileProvider = new PhysicalFileProvider(@"E:\Medirep"),   //指向報告書資料夾
    //     RequestPath = new PathString("/Pictures"),
    //     EnableDirectoryBrowsing = true
    // });



}
// System.AppContext.SetSwitch("System.Drawing.EnableUnixSupport", true);
// app.UseHttpsRedirection();UseCompressedStaticFiles
// var configuration = new ConfigurationBuilder()
//      .AddJsonFile($"appsettings.json");

// var config = builder.Build();
// var serverPicPath = config.GetConnectionString("serverPicPath");
// app.UseStaticFiles().UseResponseCompression();

app.UseImageSharp();
app.UseStaticFiles();

// app.UseEndpoints(endpoints =>
// {
//     endpoints.MapGet("/", async context =>
//     {
//         context.Response.ContentType = "text/html";
//         await context.Response.WriteAsync("<img src=\"image.jpg?width=450\" />");
//     });
// });
// app.UseCompressedStaticFiles();
// var config = new ConfigurationBuilder()
//                 .SetBasePath(Directory.GetCurrentDirectory())
//                 .AddJsonFile("appsettings.json").Build();


app.UseAuthorization();

app.MapControllers();



app.Run();

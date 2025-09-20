using System.Text.Json.Serialization;
using FileBrowser.Server.Services;
using Scalar.AspNetCore;

const string DefaultCorsPolicyName = "DefaultCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options
            .JsonSerializerOptions
            .Converters
            .Add(new JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy(DefaultCorsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IDirectoryService, DirectoryService>();
builder.Services.AddScoped<IFileService, FileService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(DefaultCorsPolicyName);

app.UseAuthorization();

app.MapControllers();

app.Run();

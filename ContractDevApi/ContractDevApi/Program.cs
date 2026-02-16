using System.Text;
using ContractDevApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using ContractDevApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

//Database Connection. NOTE: Ensure user_secrets is properly configured to prevent leaking passwords(this is for connecting back end)
builder.Services.AddDbContext<ContractDevContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

//Temporary User Authentication using cookies - eventually replaced by JWT once front-end is connected
//NOTE: cookies is still a functional authentication system for testing purposes
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(cookieAuth =>
    {
        cookieAuth.Cookie.Name = "Cookies";
        cookieAuth.LoginPath = "/Account/Login";
        cookieAuth.LogoutPath = "/Account/Logout";
        cookieAuth.ExpireTimeSpan = TimeSpan.FromHours(1);
        cookieAuth.SlidingExpiration = true;
    });

// -------------------------------------------------------------
// JWT AUTHENTICATION CONFIGURATION
// -------------------------------------------------------------
var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]))
        };
    });

builder.Services.AddAuthorization();

//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register JwtService
builder.Services.AddScoped<JwtService>();

var app = builder.Build();
    
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Root test endpoint
app.MapGet("/", () => "API is running...");

app.Run();

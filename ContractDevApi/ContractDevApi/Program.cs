using ContractDevApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

//Database Connection. NOTE: Ensure user_secrets is properly configured to prevent leaking passwords
builder.Services.AddDbContext<ContractDevContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

builder.Services.AddAuthorization();

//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

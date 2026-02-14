using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MyApp.Api.Data;
using MyApp.Api.Services; // <-- for JwtService (you will create this)

var builder = WebApplication.CreateBuilder(args);

// -------------------------------------------------------------
// 1. REGISTER SERVICES
// -------------------------------------------------------------

// Add DbContext (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Add controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Register JwtService
builder.Services.AddScoped<JwtService>();

// -------------------------------------------------------------
// 2. BUILD THE APPLICATION
// -------------------------------------------------------------
var app = builder.Build();

// -------------------------------------------------------------
// 3. MIDDLEWARE PIPELINE
// -------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

// IMPORTANT: Authentication must come BEFORE Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Root test endpoint
app.MapGet("/", () => "API is running...");

// -------------------------------------------------------------
// 4. START SERVER
// -------------------------------------------------------------
app.Run();


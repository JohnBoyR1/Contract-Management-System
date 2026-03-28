using ContractDevApi.Controllers;
using ContractDevApi.DTOs;
using ContractDevApi.Models;
using ContractDevApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API_UnitTest;

public class Tests
{
    private UserAccountsController _controller = null!;
    private ContractDevContext _context = null!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<ContractDevContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase" + Guid.NewGuid())
            .Options;

        _context = new ContractDevContext(options);

        var configValues = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "supersecretkey1234567890!@#$%^&*()",
            ["Jwt:Issuer"] = "https://localhost:7186",
            ["Jwt:Audience"] = "http://localhost:4200",
            ["Jwt:ExpiresInMinutes"] = "60"
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();

        var jwtService = new JwtService(configuration);
        _controller = new UserAccountsController(_context, jwtService);

        UserRegistrationDto newUser = new UserRegistrationDto(){
            Username = "Test User",
            FirstName = "Test",
            LastName = "User",
            Country = "US",
            Description = "developer",
            Email = "test@gmail.com",
            Password = "applesauce",
            ConfirmPassword = "applesauce",
            SecurityQuestion = "test question",
            SecurityAnswer = "applesauce"
        };

        var response = _controller.RegisterUserAccount(newUser);

        Console.WriteLine(response);
    }

    [TearDown]
    public void TearDown()
    {
        

        _context.Dispose();
    }

    [Test]
    public void Test1()
    {
        Assert.Pass();
    }
}

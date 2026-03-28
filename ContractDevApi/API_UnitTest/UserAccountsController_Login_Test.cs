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
            ["Jwt:Key"] = "this-is-a-test-key-that-is-long-enough-for-hs256",
            ["Jwt:Issuer"] = "test-issuer",
            ["Jwt:Audience"] = "test-audience",
            ["Jwt:ExpiresInMinutes"] = "60"
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();

        var jwtService = new JwtService(configuration);
        _controller = new UserAccountsController(context, jwtService);

        _controller.RegisterUserAccount(new UserRegistrationDto {

        });
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

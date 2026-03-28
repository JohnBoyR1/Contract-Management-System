using ContractDevApi.Controllers;
using ContractDevApi.DTOs;
using ContractDevApi.Models;
using ContractDevApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API_UnitTest;

public class Tests
{
    private UserAccountsController _controller = null!;
    private ContractDevContext _context = null!;

    [SetUp]
    public async Task Setup()
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

        var response = await _controller.RegisterUserAccount(newUser);

    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task LoginValidAccount()
    {
        //Arrange
        string validEmail = "test@gmail.com";
        string validPassword = "applesauce";
        
        UserLoginDto loginDto = new UserLoginDto()
        {
          Email = validEmail,
          Password = validPassword  
        };

        //Act
        IActionResult response = await _controller.Login(loginDto);

        //Assert
        var okResult = response as OkObjectResult;
        Assert.That(okResult, Is.Not.Null, "Expected OkObjectResult for valid login");
        Assert.That(okResult!.StatusCode ?? StatusCodes.Status200OK, Is.EqualTo(StatusCodes.Status200OK));
    }

    [Test]
    public async Task LoginInvalidEmail()
    {
        //Arrange
        string invalidEmail = "invalid@fake.qwerty";
        string validPassword = "applesauce";

        UserLoginDto loginDto = new UserLoginDto()
        {
          Email = invalidEmail,
          Password = validPassword  
        };

        //Act
        IActionResult response = await _controller.Login(loginDto);

        //Assert
        var unathorizedResult = response as UnauthorizedObjectResult;
        Assert.That(unathorizedResult, Is.Not.Null, "Excepted Unauthorized for invalid login");
        Assert.That(unathorizedResult!.StatusCode ?? StatusCodes.Status401Unauthorized, Is.EqualTo(StatusCodes.Status401Unauthorized));
    }

    [Test]
    public async Task LoginEmptyData()
    {
        //Arrange
        UserLoginDto loginDto = new UserLoginDto(); //All fields empty

        //The api controller normally validates the following model state through the normal ASP.NET API pipeline
        //Requires that we define the model error here since we're testing and not using the full ASP.NET API pipeline
        _controller.ModelState.AddModelError("Email", "Email is required");
        _controller.ModelState.AddModelError("Password", "Password is required");

        //Act
        IActionResult response = await _controller.Login(loginDto);

        //Assert
        var badRequestResult = response as ObjectResult;
        Assert.That(badRequestResult, Is.Not.Null, "Expected object result for invalid model state");

        var problemDetails = badRequestResult.Value as ValidationProblemDetails;
        Assert.That(problemDetails, Is.Not.Null, "Expected ValidationProblemDetails payload");
        Assert.That(problemDetails!.Status ?? StatusCodes.Status400BadRequest, Is.EqualTo(StatusCodes.Status400BadRequest));
        Assert.That(problemDetails!.Errors.ContainsKey("Email"), Is.True);
        Assert.That(problemDetails.Errors.ContainsKey("Password"), Is.True);
    }
}

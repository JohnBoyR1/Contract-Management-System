using Microsoft.AspNetCore.Mvc;

namespace MyApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok("pong");
    }
}
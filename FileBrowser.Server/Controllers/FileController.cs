using Microsoft.AspNetCore.Mvc;

namespace FileBrowser.Server.Controllers;

[Route("api/v1/files")]
[ApiController]
public class FileController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAsync()
    {
        throw new NotImplementedException();
    }
}
using FileBrowser.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace FileBrowser.Server.Controllers;

[Route("api/v1/directories")]
[ApiController]
public class DirectoryController : ControllerBase
{
    private readonly IDirectoryService _directoryService;

    public DirectoryController(IDirectoryService directoryService)
    {
        _directoryService = directoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync(string path)
    {
        var result = await _directoryService.GetDirectoryAsync(path);
        return Ok(result);
    }
}
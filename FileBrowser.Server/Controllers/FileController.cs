using System.Net.Mime;
using FileBrowser.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace FileBrowser.Server.Controllers;

[Route("api/v1/files")]
[ApiController]
public class FileController : ControllerBase
{
    private readonly IFileService _fileService;

    public FileController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAsync(string path, string? name = null)
    {
        try
        {
            FileStream? stream = await _fileService.GetFileAsync(path);

            if (stream is null) return NotFound();

            name ??= path.Split('/')[^1];

            return File(stream, MediaTypeNames.Application.Octet, name);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}
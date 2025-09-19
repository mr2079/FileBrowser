using System.Data;
using System.Net.Mime;
using FileBrowser.Server.Models.DTOs;
using FileBrowser.Server.Models.Requests;
using FileBrowser.Server.Services;
using Mapster;
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

    [HttpPost("command")]
    public async Task<IActionResult> CommandAsync([FromBody] FileCommandRequest request)
    {
        var dto = request.Adapt<FileCommandDto>();

        var result = await _fileService.CommandAsync(dto);

        return Ok(result);
    }
}
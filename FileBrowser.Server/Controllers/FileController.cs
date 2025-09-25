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

    [HttpGet("zip")]
    public async Task<IActionResult> GetZipAsync([FromQuery] IEnumerable<string> paths)
    {
        try
        {
            FileStream? stream = await _fileService.GetZipAsync(paths);

            if (stream is null) return NotFound();

            return File(
                stream,
                MediaTypeNames.Application.Octet,
                stream.Name.Split("\\")[^1]);
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

    [HttpPut("rename")]
    public async Task<IActionResult> RenameAsync([FromBody] RenameRequest request)
    {
        var dto = request.Adapt<RenameDto>();

        var result = await _fileService.RenameAsync(dto);

        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveAsync([FromBody] RemoveRequest request)
    {
        var dto = request.Adapt<RemoveDto>();

        var result = await _fileService.RemoveAsync(dto);

        return Ok(result);
    }
}
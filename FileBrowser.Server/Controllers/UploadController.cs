using FileBrowser.Server.Models.DTOs;
using FileBrowser.Server.Models.Requests;
using FileBrowser.Server.Services;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace FileBrowser.Server.Controllers;

[Route("api/v1/uploads")]
[ApiController]
public class UploadController : ControllerBase
{
    private readonly IFileService _fileService;

    public UploadController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost("chunk")]
    public async Task<IActionResult> UploadChunkAsync([FromForm] UploadChunkRequest request)
    {
        // var dto = request.Adapt<UploadChunkDto>();

        UploadChunkDto dto = new()
        {
            Chunk = request.Chunk,
            FileName = request.FileName,
            Index = request.Index
        };

        var result = await _fileService.UploadChunkAsync(dto);

        return Ok(result);
    }

    [HttpPost("merge")]
    public async Task<IActionResult> MergeChunkAsync([FromBody] MergeChunkRequest request)
    {
        var dto = request.Adapt<MergeChunkDto>();

        var result = await _fileService.MergeChunkAsync(dto);

        return Ok(result);
    }
}
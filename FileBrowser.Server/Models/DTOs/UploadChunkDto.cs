namespace FileBrowser.Server.Models.DTOs;

public class UploadChunkDto
{
    public IFormFile Chunk { get; set; }
    public string FileName { get; set; }
    public int Index { get; set; }
}
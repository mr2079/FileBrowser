namespace FileBrowser.Server.Models.Requests;

public class UploadChunkRequest
{
    public IFormFile Chunk { get; set; }
    public string FileName { get; set; }
    public int Index { get; set; }
}
namespace FileBrowser.Server.Models.Requests;

public class MergeChunkRequest
{
    public string FileName { get; set; }
    public string Path { get; set; }
}
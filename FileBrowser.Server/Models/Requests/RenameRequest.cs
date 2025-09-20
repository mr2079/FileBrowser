namespace FileBrowser.Server.Models.Requests;

public class RenameRequest
{
    public string Path { get; set; }
    public string NewName { get; set; }
}
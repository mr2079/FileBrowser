namespace FileBrowser.Server.Models.Requests;

public class RemoveRequest
{
    public IEnumerable<string> Paths { get; set; }
}
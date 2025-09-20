namespace FileBrowser.Server.Models.Requests;

public class RemoveRequest
{
    public IEnumerable<string> Pathes { get; set; }
}
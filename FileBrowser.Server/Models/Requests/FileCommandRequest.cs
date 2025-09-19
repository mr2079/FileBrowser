using FileBrowser.Server.Models.Enums;

namespace FileBrowser.Server.Models.Requests;

public class FileCommandRequest
{
    public CommandTypeEnum CommandType { get; set; }
    public string To { get; set; }
    public IEnumerable<string> Items { get; set; }
}
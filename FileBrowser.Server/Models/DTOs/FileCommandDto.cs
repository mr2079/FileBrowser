using FileBrowser.Server.Models.Enums;

namespace FileBrowser.Server.Models.DTOs;

public class FileCommandDto
{
    public CommandTypeEnum CommandType { get; set; }
    public string To { get; set; }
    public IEnumerable<string> Items { get; set; }
}
namespace FileBrowser.Server.Models.DTOs;

public class DirectoryItemDto
{
    public string Name { get; set; }
    public string Path { get; set; }
    public bool IsDirectory { get; set; }
}
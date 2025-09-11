namespace FileBrowser.Server.Models.DTOs;

public class DirectoryDto
{
    public DirectoryDto(string path = "/")
    {
        Path = path;
    }

    public string Name { get; set; } = "/";
    public string Path { get; set; }
    public string? PreviousDirectory { get; set; }
    public List<DirectoryItemDto> Items { get; set; } = [];
}
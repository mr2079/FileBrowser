using FileBrowser.Server.Models.DTOs;

namespace FileBrowser.Server.Services;

public interface IDirectoryService
{
    Task<DirectoryDto> GetDirectoryAsync(string path);
}

public class DirectoryService : IDirectoryService
{
    private const string BaseDirectory = "Storage";

    public Task<DirectoryDto> GetDirectoryAsync(string path)
    {
        DirectoryDto dto = new(path);

        var pathParts = path.Split("/");

        if (!string.IsNullOrWhiteSpace(pathParts[^1]))
        {
            dto.Name = pathParts[^1];
        }

        if (path is not "/")
        {
            dto.PreviousDirectory = string.Join('/', pathParts[..^1]);
            if (string.IsNullOrWhiteSpace(dto.PreviousDirectory))
            {
                dto.PreviousDirectory = "/";
            }
        }

        string baseDirectoryPath = GetBaseDirectory();

        string fullPath = baseDirectoryPath;

        if (path is not "/")
        {
            string relativePath = path.TrimStart('/');
            fullPath = Path.Combine(baseDirectoryPath, relativePath);

            if (!Directory.Exists(fullPath))
            {
                dto.Name = "/";
                dto.Path = "/";
                dto.PreviousDirectory = "/";

                fullPath = baseDirectoryPath;
            }
        }

        var subDirectories = Directory.GetDirectories(fullPath);

        if (subDirectories?.Length > 0)
        {
            var subs = subDirectories
                .Select(sd => new DirectoryItemDto
                {
                    Name = sd.Split("\\")[^1],
                    Path = GetSubDirectoryPath(sd),
                    IsDirectory = true
                })
                .ToList();

            dto.Items.AddRange(subs);
        }

        var directoryFiles = Directory.GetFiles(fullPath);

        if (directoryFiles?.Length > 0)
        {
            var files = directoryFiles
                .Select(file => new DirectoryItemDto
                {
                    Name = file.Split("\\")[^1],
                    Path = file
                })
                .ToList();

            dto.Items.AddRange(files);
        }

        return Task.FromResult(dto);
    }

    private string GetBaseDirectory()
    {
        var baseDirectoryPath = Path.Combine(Directory.GetCurrentDirectory(), BaseDirectory);

        if (!Directory.Exists(baseDirectoryPath))
            Directory.CreateDirectory(baseDirectoryPath);

        return baseDirectoryPath;
    }

    private string GetSubDirectoryPath(string path)
    {
        string result = "/";

        int index = path.IndexOf(BaseDirectory, StringComparison.Ordinal);

        if (index is not -1)
        {
            result = path
                .Substring(index + BaseDirectory.Length)
                .Replace("\\", "/");
        }

        return result;
    }
}
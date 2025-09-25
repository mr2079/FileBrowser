using FileBrowser.Server.Models.DTOs;

namespace FileBrowser.Server.Services;

public interface IDirectoryService
{
    Task<DirectoryDto> GetDirectoryAsync(string path);
}

public class DirectoryService : IDirectoryService
{
    private const string BaseDirectory = "Storage";

    private readonly char[] _excludePrefixes = ['_', '.'];

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

        var subDirectories = Directory
            .GetDirectories(fullPath)
            .Where(dir =>
            {
                string dirName = Path.GetFileName(dir);
                return !_excludePrefixes.Any(prefix => dirName.StartsWith(prefix));
            })
            .ToArray();

        if (subDirectories?.Length > 0)
        {
            var subs = subDirectories
                .Select(subDirectory => new DirectoryItemDto
                {
                    Name = subDirectory.Split("\\")[^1],
                    Path = GetSubDirectoryPath(subDirectory),
                    IsDirectory = true
                })
                .ToList();

            dto.Items.AddRange(subs);
        }

        var directoryFiles = Directory.GetFiles(fullPath);

        if (directoryFiles?.Length > 0)
        {
            var files = directoryFiles
                .Select(directoryFile => new DirectoryItemDto
                {
                    Name = directoryFile.Split("\\")[^1],
                    Path = GetSubDirectoryPath(directoryFile)
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
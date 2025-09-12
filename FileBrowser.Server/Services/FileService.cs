namespace FileBrowser.Server.Services;

public interface IFileService
{
    Task<FileStream?> GetFileAsync(string filePath);
}

public class FileService :  IFileService
{
    private const string BaseDirectory = "Storage";

    public async Task<FileStream?> GetFileAsync(string path)
    {
        if (path is "/") return null;

        string baseDirectoryPath = GetBaseDirectory();

        string relativePath = path.TrimStart('/');
        
        var fullPath = Path.Combine(baseDirectoryPath, relativePath);

        if (!File.Exists(fullPath)) return null;

        return new FileStream(fullPath, FileMode.Open, FileAccess.Read);
    }

    private string GetBaseDirectory()
    {
        var baseDirectoryPath = Path.Combine(Directory.GetCurrentDirectory(), BaseDirectory);

        if (!Directory.Exists(baseDirectoryPath))
            Directory.CreateDirectory(baseDirectoryPath);

        return baseDirectoryPath;
    }
}
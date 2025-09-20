using FileBrowser.Server.Models.DTOs;
using FileBrowser.Server.Models.Enums;

namespace FileBrowser.Server.Services;

public interface IFileService
{
    Task<FileStream?> GetFileAsync(string filePath);
    Task<bool> CommandAsync(FileCommandDto dto);
    Task<bool> RenameAsync(RenameDto dto);
    Task<bool> RemoveAsync(RemoveDto dto);
}

public class FileService : IFileService
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

    public async Task<bool> CommandAsync(FileCommandDto dto)
    {
        try
        {
            string baseDirectoryPath = GetBaseDirectory();

            var destFullPath = Path.Combine(baseDirectoryPath, dto.To.TrimStart('/'));

            if (!Directory.Exists(destFullPath)) return false;

            foreach (var item in dto.Items)
            {
                string fileFullPath = Path.Combine(baseDirectoryPath, item.TrimStart('/'));

                if (!File.Exists(fileFullPath)) continue;

                string fileName = item.Split('/')[^1];

                string destFilePath = Path.Combine(destFullPath, fileName);

                switch (dto.CommandType)
                {
                    case CommandTypeEnum.Move:
                        File.Move(fileFullPath, destFilePath);
                        break;
                    case CommandTypeEnum.Copy:
                        File.Copy(fileFullPath, destFilePath);
                        break;
                    default:
                        continue;
                }
            }

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> RenameAsync(RenameDto dto)
    {
        try
        {
            string baseDirectoryPath = GetBaseDirectory();

            string relativePath = dto.Path.TrimStart('/');

            string sourceFullPath = Path.Combine(baseDirectoryPath, relativePath);

            if (!File.Exists(sourceFullPath)) return false;

            string filePath = string.Join("\\", relativePath.Split('/')[..^1]);

            string fileExtension = relativePath.Split('.')[^1];

            string newFileName = $"{dto.NewName}.{fileExtension}";

            string destFullPath = Path.Combine(baseDirectoryPath, filePath, newFileName);

            File.Move(sourceFullPath, destFullPath);

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> RemoveAsync(RemoveDto dto)
    {
        try
        {
            string baseDirectoryPath = GetBaseDirectory();

            foreach (var path in dto.Pathes)
            {
                string fullPath = Path.Combine(baseDirectoryPath, path.TrimStart('/'));

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }

                if (Directory.Exists(fullPath))
                {
                    Directory.Delete(fullPath);
                }
            }

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private string GetBaseDirectory()
    {
        var baseDirectoryPath = Path.Combine(Directory.GetCurrentDirectory(), BaseDirectory);

        if (!Directory.Exists(baseDirectoryPath))
            Directory.CreateDirectory(baseDirectoryPath);

        return baseDirectoryPath;
    }
}
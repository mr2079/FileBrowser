using FileBrowser.Server.Models.DTOs;
using FileBrowser.Server.Models.Enums;

namespace FileBrowser.Server.Services;

public interface IFileService
{
    Task<FileStream?> GetFileAsync(string filePath);
    Task<bool> CommandAsync(FileCommandDto dto);
    Task<bool> RenameAsync(RenameDto dto);
    Task<bool> RemoveAsync(RemoveDto dto);
    Task<bool> UploadChunkAsync(UploadChunkDto dto);
    Task<bool> MergeChunkAsync(MergeChunkDto dto);
}

public class FileService : IFileService
{
    private const string BaseDirectory = "Storage";
    private const string TempDirectoryName = "_temp";
    private const string UploadDirectoryName = "uploads";
    private readonly string _tempDirectory;

    public FileService()
    {
        string baseDirectory = GetBaseDirectory();
        _tempDirectory = Path.Combine(baseDirectory, TempDirectoryName);
    }

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
                    Directory.Delete(fullPath, true);
                }
            }

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> UploadChunkAsync(UploadChunkDto dto)
    {
        if (!Directory.Exists(_tempDirectory))
            Directory.CreateDirectory(_tempDirectory);

        string chunkName = $"{dto.FileName}.part{dto.Index + 1}";

        string chunkDirectoryPath = Path.Combine(_tempDirectory, UploadDirectoryName);

        if (!Directory.Exists(chunkDirectoryPath))
            Directory.CreateDirectory(chunkDirectoryPath);

        try
        {
            string chunkPath = Path.Combine(chunkDirectoryPath, chunkName);

            await using FileStream fs = new(chunkPath, FileMode.Create);

            await dto.Chunk.CopyToAsync(fs);

            return true;
        }
        catch (Exception)
        {
            var chunks = Directory
                .GetFiles(chunkDirectoryPath, $"{dto.FileName}.*")
                .ToList();

            foreach (var chunk in chunks)
            {
                File.Delete(chunk);
            }

            return false;
        }
    }

    public async Task<bool> MergeChunkAsync(MergeChunkDto dto)
    {
        string chunkPath = Path.Combine(
            _tempDirectory,
            UploadDirectoryName);

        var chunks = Directory
            .GetFiles(chunkPath, $"{dto.FileName}.*")
            .OrderBy(file =>
            {
                int index = int.Parse(
                    file.Split('.')[^1]
                        .Replace("part", string.Empty));

                return index;
            })
            .ToList();

        try
        {
            string finalPath = Path.Combine(
                GetBaseDirectory(),
                dto.Path.TrimStart('/'),
                dto.FileName);

            await using FileStream fs = new(finalPath, FileMode.Create);

            foreach (var chunk in chunks)
            {
                await using FileStream chunkStream = new(chunk, FileMode.Open);
                await chunkStream.CopyToAsync(fs);
            }

            return true;
        }
        catch (Exception)
        {
            return false;
        }
        finally
        {
            foreach (var chunk in chunks)
            {
                File.Delete(chunk);
            }
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
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace backend.Services
{
    public class CloudinaryUploaderService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryUploaderService(IConfiguration configuration)
        {
            // Lấy thông tin cấu hình từ appsettings.json
            var cloudName = configuration["CloudinarySettings:CloudName"];
            var apiKey = configuration["CloudinarySettings:ApiKey"];
            var apiSecret = configuration["CloudinarySettings:ApiSecret"];

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new ArgumentException("Thông tin cấu hình Cloudinary không đầy đủ.");
            }

            Account account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        // Phương thức tải tệp lên và trả về URL
        public async Task<string?> UploadFileAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            // Tạo các tham số để tải lên
            var uploadParams = new ImageUploadParams()
            {
                // Mở stream từ file người dùng gửi lên
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                // Tùy chọn: đặt tên thư mục trên Cloudinary để dễ quản lý
                Folder = folderName,
                // Tùy chọn: Cloudinary tự động tạo PublicId duy nhất nếu không cung cấp
                // PublicId = "my_unique_image_id" 
            };

            // Thực hiện tải lên
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            // Kiểm tra kết quả và trả về URL an toàn (HTTPS)
            if (uploadResult.Error != null)
            {
                throw new System.Exception($"Lỗi khi tải ảnh lên Cloudinary: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl?.ToString();
        }
    }
}
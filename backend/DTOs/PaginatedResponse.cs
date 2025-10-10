using System.ComponentModel.DataAnnotations;
public class PaginatedResponse<T>
{
    // Danh sách các mục trên trang hiện tại
    public required List<T> Data { get; set; }

    // Tổng số trang
    public int TotalPages { get; set; }

    // Trang hiện tại
    public int CurrentPage { get; set; }
}
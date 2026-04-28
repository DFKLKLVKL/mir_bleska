namespace MirBleska.Api.Models;

public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = "";
    public string Phone { get; set; } = "";
    public string? Email { get; set; }
    public string? Comment { get; set; }
    public string ItemsJson { get; set; } = "";
    public decimal Total { get; set; }
    public string Status { get; set; } = "new";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // ← Убедитесь, что это поле есть
}
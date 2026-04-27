namespace MirBleska.Api.Models;

public class Cart
{
    public int Id { get; set; }
    public string SessionId { get; set; } = ""; // Для гостей
    public int? UserId { get; set; }            // Для авторизованных (потом)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public List<CartItem> Items { get; set; } = new();
}

public class CartItem
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public decimal ProductPrice { get; set; }
    public int Quantity { get; set; }
    
    public Cart? Cart { get; set; }
    public Product? Product { get; set; }
}
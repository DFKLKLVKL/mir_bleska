using Microsoft.AspNetCore.Mvc;
using MirBleska.Api.Data;
using MirBleska.Api.Models;
using System.Text.Json;

namespace MirBleska.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _db;

    public OrderController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
    {
        var order = new Order
        {
            CustomerName = request.Customer.Name,
            Phone = request.Customer.Phone,
            Email = request.Customer.Email,
            Comment = request.Comment,
            ItemsJson = JsonSerializer.Serialize(request.Items),
            Total = request.Total,
            Status = "new",
            CreatedAt = DateTime.UtcNow  // ← Явно указываем дату
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return Ok(new { id = order.Id, message = "Заказ создан" });
    }

    [HttpGet]
    public IActionResult GetOrders()
    {
        var orders = _db.Orders.OrderByDescending(o => o.CreatedAt).ToList();
        return Ok(orders);
    }
}

public class OrderRequest
{
    public CustomerDto Customer { get; set; } = new();
    public List<object> Items { get; set; } = new();
    public decimal Total { get; set; }
    public string? Comment { get; set; }
}

public class CustomerDto
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string? Email { get; set; }
}
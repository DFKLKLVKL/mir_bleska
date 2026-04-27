using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MirBleska.Api.Data;
using MirBleska.Api.Models;

namespace MirBleska.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CartController(AppDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    // Получить ID сессии (гостевая корзина)
    private string GetSessionId()
    {
        var cookies = _httpContextAccessor.HttpContext?.Request.Cookies;
        if (cookies != null && cookies.ContainsKey("cart_session_id"))
        {
            return cookies["cart_session_id"]!;
        }
        
        // Создаем новую сессию
        var sessionId = Guid.NewGuid().ToString();
        _httpContextAccessor.HttpContext?.Response.Cookies.Append("cart_session_id", sessionId, new CookieOptions
        {
            Expires = DateTimeOffset.UtcNow.AddDays(30),
            HttpOnly = true,
            SameSite = SameSiteMode.Lax
        });
        
        return sessionId;
    }

    // GET /api/cart - получить корзину
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var sessionId = GetSessionId();
        
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.SessionId == sessionId);
        
        if (cart == null)
        {
            return Ok(new { items = new List<CartItem>(), total = 0 });
        }
        
        var total = cart.Items.Sum(i => i.ProductPrice * i.Quantity);
        
        return Ok(new 
        { 
            items = cart.Items,
            total = total,
            count = cart.Items.Sum(i => i.Quantity)
        });
    }

    // POST /api/cart/add - добавить товар
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        var sessionId = GetSessionId();
        
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.SessionId == sessionId);
        
        if (cart == null)
        {
            cart = new Cart { SessionId = sessionId };
            _db.Carts.Add(cart);
            await _db.SaveChangesAsync();
        }
        
        var product = await _db.Products.FindAsync(request.ProductId);
        if (product == null) return NotFound("Товар не найден");
        
        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                ProductPrice = product.Price,
                Quantity = request.Quantity,
                CartId = cart.Id
            });
        }
        
        cart.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        
        return Ok(await GetCartResponse(sessionId));
    }

    // PUT /api/cart/update - обновить количество
    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartRequest request)
    {
        var sessionId = GetSessionId();
        
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.SessionId == sessionId);
        
        if (cart == null) return NotFound();
        
        var item = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        if (item == null) return NotFound();
        
        if (request.Quantity <= 0)
        {
            cart.Items.Remove(item);
        }
        else
        {
            item.Quantity = request.Quantity;
        }
        
        await _db.SaveChangesAsync();
        
        return Ok(await GetCartResponse(sessionId));
    }

    // DELETE /api/cart/clear - очистить корзину
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var sessionId = GetSessionId();
        
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.SessionId == sessionId);
        
        if (cart != null)
        {
            _db.CartItems.RemoveRange(cart.Items);
            await _db.SaveChangesAsync();
        }
        
        return Ok(new { message = "Корзина очищена" });
    }

    private async Task<object> GetCartResponse(string sessionId)
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.SessionId == sessionId);
        
        if (cart == null) return new { items = new List<CartItem>(), total = 0, count = 0 };
        
        return new
        {
            items = cart.Items,
            total = cart.Items.Sum(i => i.ProductPrice * i.Quantity),
            count = cart.Items.Sum(i => i.Quantity)
        };
    }
}

public class AddToCartRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class UpdateCartRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MirBleska.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _db.Products.ToListAsync();
            return Ok(products);
        }
    }
}
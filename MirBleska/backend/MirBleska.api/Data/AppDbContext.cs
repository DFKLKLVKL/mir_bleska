using System.Dynamic;
using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using MirBleska.Api.Models;

namespace MirBleska.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Product> Products{get;set;}
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
}

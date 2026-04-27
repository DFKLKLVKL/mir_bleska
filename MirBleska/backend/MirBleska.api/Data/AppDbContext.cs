using Microsoft.EntityFrameworkCore;
using MirBleska.Api.Models;

namespace MirBleska.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Order> Orders => Set<Order>();
}
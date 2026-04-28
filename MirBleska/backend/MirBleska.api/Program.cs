using Microsoft.EntityFrameworkCore;
using MirBleska.Api.Data;
using MirBleska.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// База данных SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=mir_bleska.db"));

// CORS - исправлено для credentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.MapControllers();

// Создание БД и тестовых данных
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    
    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Product { Name = "Стол из эпоксидной смолы", Price = 15000, ImageUrl = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300" },
            new Product { Name = "Поднос ручной работы", Price = 3000, ImageUrl = "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=300" },
            new Product { Name = "Картина с морем", Price = 8500, ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300" }
        );
        db.SaveChanges();
        Console.WriteLine("✅ Тестовые товары добавлены!");
    }
}

app.Run();
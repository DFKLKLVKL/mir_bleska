using Microsoft.EntityFrameworkCore;
using MirBleska.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Контроллеры
builder.Services.AddControllers();

// 🔹 Swagger (чтобы тестить API в браузере)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 База данных (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// 🔹 CORS (чтобы фронт работал)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// 🔹 Swagger включаем
app.UseSwagger();
app.UseSwaggerUI();

// 🔹 CORS включаем
app.UseCors("AllowAll");

app.UseRouting();

app.MapControllers();
builder.Services.AddHttpContextAccessor();

// 🔹 Автосоздание БД + тестовые данные
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    if (!db.Products.Any())
    {
        db.Products.AddRange(
            new Models.Product
            {
                Name = "Стол из эпоксидной смолы",
                Price = 15000,
                ImageUrl = "https://via.placeholder.com/300"
            },
            new Models.Product
            {
                Name = "Поднос ручной работы",
                Price = 3000,
                ImageUrl = "https://via.placeholder.com/300"
            }
        );

        db.SaveChanges();
    }
}

app.Run();
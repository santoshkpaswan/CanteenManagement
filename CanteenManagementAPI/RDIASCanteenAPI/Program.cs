using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RDIASCanteenAPI.BuilderModel.CanteenBuilder;
using RDIASCanteenAPI.Data;
using RDIASCanteenAPI.Interface.CanteenInterface;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.TryAddScoped<MasterDayInterface, MasterDayBuilder>();

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("ProductionConnection")));

// Angular Policy Access Control-Allow Origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", 
        policy => { policy.WithOrigins("http://localhost:4200") // Angular dev server
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Angular Authorization & MapControllers
app.UseCors("AllowAngularClient");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

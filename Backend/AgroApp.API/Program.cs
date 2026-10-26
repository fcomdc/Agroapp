using AgroApp.Application.Interfaces;
using AgroApp.Application.Services;
using AgroApp.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Controladores y Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Infraestructura: conexión a BD y repositorios
builder.Services.AddInfrastructure(builder.Configuration);

// Servicios de la aplicación
builder.Services.AddScoped<IReproduccionService, ReproduccionService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IBovinosService, BovinosService>();
builder.Services.AddScoped<INfcService, NfcService>();
builder.Services.AddScoped<IUbicacionesService, UbicacionService>();
builder.Services.AddScoped<IVacunacionesService, VacunacionesService>();
builder.Services.AddScoped<IPesosService, PesosService>();
builder.Services.AddScoped<IReportesSaludService, ReportesSaludService>();
builder.Services.AddScoped<IPartosService, PartosService>();
builder.Services.AddScoped<ICriasPartoService, CriasPartoService>();
var app = builder.Build();

// Configuración de Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

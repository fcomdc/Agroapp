using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using AgroApp.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AgroApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AgroDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IReproduccionRepository, ReproduccionRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IBovinosRepository, BovinosRepository>();
        services.AddScoped<IPesosRepository, PesosRepository>();
        services.AddScoped<IVacunacionesRepository, VacunacionesRepository>();
        services.AddScoped<IReportesSaludRepository, ReportesSaludRepository>();
        services.AddScoped<IPartosRepository, PartosRepository>();
        services.AddScoped<ICriasPartoRepository, CriasPartoRepository>();
     

        // Repositorio de ubicaciones
        services.AddScoped<IUbicacionesRepository, UbicacionesRepository>();

        //Repositorio de NFC
        services.AddScoped<INfcRepository, NfcRepository>();

        return services;
    }
}

using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class UbicacionesRepository : IUbicacionesRepository
{
    private readonly AgroDbContext _context;

    public UbicacionesRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<Ubicaciones?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(u => u.IdUbicacion == id);
    }

    public async Task<IEnumerable<Ubicaciones>> GetAllAsync()
    {
        return await _context.Ubicaciones
            .FromSqlInterpolated($"EXEC dbo.sp_Buscar_Ubi @Nombre={string.Empty}")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Ubicaciones>> GetByNombreAsync(string nombre)
    {
        return await _context.Ubicaciones
            .FromSqlInterpolated($"EXEC dbo.sp_Buscar_Ubi @Nombre={nombre}")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(Ubicaciones ubicacion)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_Guardar_Ubi @Nombre={ubicacion.Nombre}, @Tipo={ubicacion.Tipo}, @Descripcion={ubicacion.Descripcion}")
            .ToListAsync();

        ubicacion.IdUbicacion = Convert.ToInt32(resultado.FirstOrDefault());
        if (ubicacion.IdUbicacion <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID de la ubicación creada.");
    }

    public async Task UpdateAsync(Ubicaciones ubicacion)
    {
        if (await GetByIdAsync(ubicacion.IdUbicacion) is null)
            throw new KeyNotFoundException("La ubicación no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_Actualizar_Ubi @IdUbicacion={ubicacion.IdUbicacion}, @Nombre={ubicacion.Nombre}, @Tipo={ubicacion.Tipo}, @Descripcion={ubicacion.Descripcion}, @Estado={ubicacion.Estado}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("La ubicación no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Eliminar_Ubi @IdUbicacion={id}");
    }
}

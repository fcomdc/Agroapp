using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class ReproduccionRepository : IReproduccionRepository
{
    private readonly AgroDbContext _context;

    public ReproduccionRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<Reproduccion?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(r => r.IdReproduccion == id);
    }

    public async Task<IEnumerable<Reproduccion>> GetAllByBovinoIdAsync(int idBovino)
    {
        return (await GetAllAsync())
            .Where(r => r.IdBovino == idBovino)
            .OrderByDescending(r => r.FechaRegistro)
            .ToList();
    }

    public async Task AddAsync(Reproduccion reproduccion)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_Reproduccion_Guardar @IdBovino={reproduccion.IdBovino}, @FechaMonta={reproduccion.FechaMonta}, @TipoReproduccion={reproduccion.TipoReproduccion}, @FechaInseminacion={reproduccion.FechaInseminacion}, @Resultado={reproduccion.Resultado}, @FechaConfirmacion={reproduccion.FechaConfirmacion}, @FechaProbableParto={reproduccion.FechaProbableParto}, @Observaciones={reproduccion.Observaciones}, @IdUsuario={reproduccion.IdUsuario}")
            .ToListAsync();

        reproduccion.IdReproduccion = Convert.ToInt32(resultado.FirstOrDefault());
        if (reproduccion.IdReproduccion <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID de la reproducción creada.");
    }

    public async Task UpdateAsync(Reproduccion reproduccion)
    {
        if (await GetByIdAsync(reproduccion.IdReproduccion) is null)
            throw new KeyNotFoundException("El registro de reproducción no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_Reproduccion_Actualizar @IdReproduccion={reproduccion.IdReproduccion}, @IdBovino={reproduccion.IdBovino}, @FechaMonta={reproduccion.FechaMonta}, @TipoReproduccion={reproduccion.TipoReproduccion}, @FechaInseminacion={reproduccion.FechaInseminacion}, @Resultado={reproduccion.Resultado}, @FechaConfirmacion={reproduccion.FechaConfirmacion}, @FechaProbableParto={reproduccion.FechaProbableParto}, @Observaciones={reproduccion.Observaciones}, @IdUsuario={reproduccion.IdUsuario}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El registro de reproducción no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Reproduccion_Eliminar @IdReproduccion={id}");
    }

    private async Task<IEnumerable<Reproduccion>> GetAllAsync() =>
        await _context.Reproducciones
            .FromSqlRaw("EXEC dbo.sp_Reproduccion_BuscarTodos")
            .AsNoTracking()
            .ToListAsync();
}

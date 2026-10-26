using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class VacunacionesRepository : IVacunacionesRepository
{
    private readonly AgroDbContext _context;

    public VacunacionesRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Vacunaciones>> GetAllAsync()
    {
        return await _context.Vacunaciones
            .FromSqlRaw("EXEC dbo.sp_Vacunacion_BuscarTodos")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Vacunaciones?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(v => v.IdVacunacion == id);
    }

    public async Task<IEnumerable<Vacunaciones>> GetByBovinoAsync(int idBovino)
    {
        return await _context.Vacunaciones
            .FromSqlInterpolated(
                $"EXEC dbo.sp_Vacunacion_BuscarPorBovino @IdBovino={idBovino}")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(Vacunaciones vacunacion)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_Vacunacion_Guardar @IdBovino={vacunacion.IdBovino}, @FechaAplicacion={vacunacion.FechaAplicacion}, @ProximaAplicacion={vacunacion.ProximaAplicacion}, @Dosis={vacunacion.Dosis}, @Lote={vacunacion.Lote}, @IdUsuario={vacunacion.IdUsuario}, @Observaciones={vacunacion.Observaciones}")
            .ToListAsync();

        vacunacion.IdVacunacion = Convert.ToInt32(resultado.FirstOrDefault());
        if (vacunacion.IdVacunacion <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID de la vacunación creada.");
    }

    public async Task UpdateAsync(Vacunaciones vacunacion)
    {
        if (await GetByIdAsync(vacunacion.IdVacunacion) is null)
            throw new KeyNotFoundException("El registro de vacunación no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_Vacunacion_Actualizar @IdVacunacion={vacunacion.IdVacunacion}, @IdBovino={vacunacion.IdBovino}, @FechaAplicacion={vacunacion.FechaAplicacion}, @ProximaAplicacion={vacunacion.ProximaAplicacion}, @Dosis={vacunacion.Dosis}, @Lote={vacunacion.Lote}, @IdUsuario={vacunacion.IdUsuario}, @Observaciones={vacunacion.Observaciones}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El registro de vacunación no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Vacunacion_Eliminar @IdVacunacion={id}");
    }
}

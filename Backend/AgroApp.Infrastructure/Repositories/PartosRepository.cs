using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class PartosRepository : IPartosRepository
{
    private readonly AgroDbContext _context;

    public PartosRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Partos>> GetAllAsync() =>
        await _context.Partos
            .FromSqlRaw("EXEC dbo.sp_Parto_BuscarTodos")
            .AsNoTracking()
            .ToListAsync();

    public async Task<Partos?> GetByIdAsync(int id) =>
        (await GetAllAsync()).FirstOrDefault(p => p.IdParto == id);

    public async Task<IEnumerable<Partos>> GetByMadreAsync(int idMadre) =>
        await _context.Partos
            .FromSqlInterpolated($"EXEC dbo.sp_Parto_BuscarPorMadre @IdMadre={idMadre}")
            .AsNoTracking()
            .ToListAsync();

    public async Task AddAsync(Partos parto)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_Parto_Guardar @IdMadre={parto.IdMadre}, @FechaParto={parto.FechaParto}, @TipoParto={parto.TipoParto}, @CantidadCrías={parto.CantidadCrias}, @Observaciones={parto.Observaciones}, @IdUsuario={parto.IdUsuario}")
            .ToListAsync();

        parto.IdParto = Convert.ToInt32(resultado.FirstOrDefault());
        if (parto.IdParto <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID del parto creado.");
    }

    public async Task UpdateAsync(Partos parto)
    {
        if (await GetByIdAsync(parto.IdParto) is null)
            throw new KeyNotFoundException("El parto no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_Parto_Actualizar @IdParto={parto.IdParto}, @IdMadre={parto.IdMadre}, @FechaParto={parto.FechaParto}, @TipoParto={parto.TipoParto}, @CantidadCrías={parto.CantidadCrias}, @Observaciones={parto.Observaciones}, @IdUsuario={parto.IdUsuario}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El parto no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Parto_Eliminar @IdParto={id}");
    }
}

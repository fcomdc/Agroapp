using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class CriasPartoRepository : ICriasPartoRepository
{
    private readonly AgroDbContext _context;

    public CriasPartoRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CriasParto>> GetAllAsync() =>
        await _context.CriasParto
            .FromSqlRaw("EXEC dbo.sp_CriaParto_BuscarTodos")
            .AsNoTracking()
            .ToListAsync();

    public async Task<CriasParto?> GetByIdAsync(int id) =>
        (await GetAllAsync()).FirstOrDefault(c => c.IdCria == id);

    public async Task AddAsync(CriasParto cria)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_CriaParto_Guardar @IdParto={cria.IdParto}, @IdBovino={cria.IdBovino}, @Sexo={cria.Sexo}, @Nombre={cria.Nombre}, @PesoNacimiento={cria.PesoNacimiento}, @EstadoCria={cria.EstadoCria}, @Observaciones={cria.Observaciones}")
            .ToListAsync();

        cria.IdCria = Convert.ToInt32(resultado.FirstOrDefault());
        if (cria.IdCria <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID de la cría creada.");
    }

    public async Task UpdateAsync(CriasParto cria)
    {
        if (await GetByIdAsync(cria.IdCria) is null)
            throw new KeyNotFoundException("La cría no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_CriaParto_Actualizar @IdCria={cria.IdCria}, @IdParto={cria.IdParto}, @IdBovino={cria.IdBovino}, @Sexo={cria.Sexo}, @Nombre={cria.Nombre}, @PesoNacimiento={cria.PesoNacimiento}, @EstadoCria={cria.EstadoCria}, @Observaciones={cria.Observaciones}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("La cría no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_CriaParto_Eliminar @IdCria={id}");
    }
}

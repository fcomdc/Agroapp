
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class BovinosRepository : IBovinosRepository
{
    private readonly AgroDbContext _context;

    public BovinosRepository(AgroDbContext context)
    {
        _context = context;
    }

    // Obtener todos los bovinos
    public async Task<IEnumerable<Bovino>> GetAllAsync()
    {
        return await _context.Bovinos
            .FromSqlRaw("EXEC dbo.sp_Bovino_Listar")
            .AsNoTracking()
            .ToListAsync();
    }

    // Obtener un bovino por su ID
    public async Task<Bovino?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(b => b.IdBovino == id);
    }

    // Buscar un bovino por su código
    public async Task<Bovino?> GetByCodigoAsync(string codigo)
    {
        return (await _context.Bovinos
            .FromSqlInterpolated(
                $"EXEC dbo.sp_Bovino_Buscar @Busqueda={codigo}")
            .AsNoTracking()
            .ToListAsync())
            .FirstOrDefault(b => b.Codigo == codigo);
    }

    // Registrar un bovino
    public async Task<Bovino> CreateAsync(Bovino bovino)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_Bovino_Guardar @Codigo={bovino.Codigo}, @Nombre={bovino.Nombre}, @Sexo={bovino.Sexo}, @FechaNacimiento={bovino.FechaNacimiento}, @Raza={bovino.Raza}, @Color={bovino.Color}, @Foto={bovino.Foto}, @IdUbicacion={bovino.IdUbicacion}, @Estado={bovino.Estado}, @Observaciones={bovino.Observaciones}")
            .ToListAsync();

        var id = Convert.ToInt32(resultado.FirstOrDefault());
        return id > 0
            ? await GetByIdAsync(id) ?? throw new InvalidOperationException("El bovino fue registrado, pero no se pudo recuperar.")
            : throw new InvalidOperationException("No se pudo obtener el ID del bovino creado.");
    }

    // Actualizar un bovino
    public async Task UpdateAsync(Bovino bovino)
    {
        if (await GetByIdAsync(bovino.IdBovino) is null)
            throw new KeyNotFoundException("Bovino no encontrado.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_Bovino_Actualizar @IdBovino={bovino.IdBovino}, @Codigo={bovino.Codigo}, @Nombre={bovino.Nombre}, @Sexo={bovino.Sexo}, @FechaNacimiento={bovino.FechaNacimiento}, @Raza={bovino.Raza}, @Color={bovino.Color}, @Foto={bovino.Foto}, @IdUbicacion={bovino.IdUbicacion}, @Estado={bovino.Estado}, @Observaciones={bovino.Observaciones}");
    }

    // Eliminar un bovino
    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("Bovino no encontrado.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Bovino_Eliminar @IdBovino={id}");
    }
}

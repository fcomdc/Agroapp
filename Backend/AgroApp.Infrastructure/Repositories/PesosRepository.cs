using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class PesosRepository : IPesosRepository
{
    private readonly AgroDbContext _context;

    public PesosRepository(AgroDbContext context)
    {
        _context = context;
    }

    // Obtener todos los registros mediante procedimiento almacenado
    public async Task<IEnumerable<Pesos>> GetAllAsync()
    {
        return await _context.Pesos
            .FromSqlRaw("EXEC dbo.sp_Peso_Listar")
            .AsNoTracking()
            .ToListAsync();
    }

    // Obtener un registro por ID a partir del listado del procedimiento almacenado
    public async Task<Pesos?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(p => p.IdPeso == id);
    }

    // Obtener el historial de peso de un bovino a partir del listado del procedimiento almacenado
    public async Task<IEnumerable<Pesos>> GetByBovinoAsync(int idBovino)
    {
        return (await GetAllAsync())
            .Where(p => p.IdBovino == idBovino)
            .OrderByDescending(p => p.FechaPeso)
            .ToList();
    }

    // Buscar registros por nombre del bovino mediante procedimiento almacenado
    public async Task<IEnumerable<Pesos>> BuscarPorNombreAsync(string nombre)
    {
        return await _context.Pesos
            .FromSqlInterpolated(
                $"EXEC dbo.sp_Peso_BuscarPorNombre @Nombre={nombre}")
            .AsNoTracking()
            .ToListAsync();
    }

    // Guardar mediante procedimiento almacenado
    public async Task<Pesos> CreateAsync(Pesos peso)
    {
        // El procedimiento devuelve únicamente el IdPeso generado
        var resultado = await _context.Database
            .SqlQuery<decimal>($@"
                EXEC dbo.sp_Peso_Guardar
                    @IdBovino={peso.IdBovino},
                    @Peso={peso.Peso},
                    @FechaPeso={peso.FechaPeso},
                    @IdUsuario={peso.IdUsuario},
                    @Observaciones={peso.Observaciones}")
            .ToListAsync();

        var idGenerado = Convert.ToInt32(resultado.FirstOrDefault());

        if (idGenerado <= 0)
        {
            throw new InvalidOperationException(
                "No se pudo obtener el ID del registro de peso creado.");
        }

        // Recuperar el registro recién insertado mediante el procedimiento de listado
        var creado = await GetByIdAsync(idGenerado);

        return creado ?? throw new InvalidOperationException(
            "El peso fue registrado, pero no se pudo recuperar.");
    }

    // Actualizar mediante procedimiento almacenado
    public async Task UpdateAsync(Pesos peso)
    {
        var existe = await GetByIdAsync(peso.IdPeso);

        if (existe == null)
        {
            throw new KeyNotFoundException(
                "El registro de peso no existe.");
        }

        await _context.Database.ExecuteSqlInterpolatedAsync($@"
            EXEC dbo.sp_Peso_Actualizar
                @IdPeso={peso.IdPeso},
                @IdBovino={peso.IdBovino},
                @Peso={peso.Peso},
                @FechaPeso={peso.FechaPeso},
                @IdUsuario={peso.IdUsuario},
                @Observaciones={peso.Observaciones}");
    }

    // Eliminar mediante procedimiento almacenado
    public async Task DeleteAsync(int id)
    {
        var existe = await GetByIdAsync(id);

        if (existe == null)
        {
            throw new KeyNotFoundException(
                "El registro de peso no existe.");
        }

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Peso_Eliminar @IdPeso={id}");
    }
}

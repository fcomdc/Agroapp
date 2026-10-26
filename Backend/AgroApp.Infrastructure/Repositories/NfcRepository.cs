
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class NfcRepository : INfcRepository
{
    private readonly AgroDbContext _context;

    public NfcRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NFC>> GetAllAsync()
    {
        return await _context.NFCs
            .FromSqlRaw("EXEC dbo.sp_NFC_Listar")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<NFC?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(n => n.IdNFC == id);
    }

    public async Task<NFC?> GetByUIDAsync(string uid)
    {
        return (await GetAllAsync())
            .FirstOrDefault(n => n.UID_NFC == uid);
    }

    public async Task<IEnumerable<NFC>> GetByBovinoAsync(int idBovino)
    {
        return (await GetAllAsync())
            .Where(n => n.IdBovino == idBovino)
            .ToList();
    }

    public async Task<NFC> CreateAsync(NFC nfc)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_NFC_Guardar @IdBovino={nfc.IdBovino}, @UID_NFC={nfc.UID_NFC}, @TipoTag={nfc.TipoTag}")
            .ToListAsync();

        var id = Convert.ToInt32(resultado.FirstOrDefault());
        return id > 0
            ? await GetByIdAsync(id) ?? throw new InvalidOperationException("La etiqueta NFC fue registrada, pero no se pudo recuperar.")
            : throw new InvalidOperationException("No se pudo obtener el ID de la etiqueta NFC creada.");
    }

    public async Task UpdateAsync(NFC nfc)
    {
        if (await GetByIdAsync(nfc.IdNFC) is null)
            throw new KeyNotFoundException("Etiqueta NFC no encontrada.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_NFC_Actualizar @IdNFC={nfc.IdNFC}, @IdBovino={nfc.IdBovino}, @UID_NFC={nfc.UID_NFC}, @TipoTag={nfc.TipoTag}, @Estado={nfc.Estado}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("Etiqueta NFC no encontrada.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_NFC_Eliminar @IdNFC={id}");
    }
}

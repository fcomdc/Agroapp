using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class ReportesSaludRepository : IReportesSaludRepository
{
    private readonly AgroDbContext _context;

    public ReportesSaludRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReportesSalud>> GetAllAsync() =>
        await _context.ReportesSalud
            .FromSqlRaw("EXEC dbo.sp_ReporteSalud_BuscarTodos")
            .AsNoTracking()
            .ToListAsync();

    public async Task<ReportesSalud?> GetByIdAsync(int id) =>
        (await GetAllAsync()).FirstOrDefault(r => r.IdReporte == id);

    public async Task<IEnumerable<ReportesSalud>> GetByBovinoAsync(int idBovino) =>
        await _context.ReportesSalud
            .FromSqlInterpolated($"EXEC dbo.sp_ReporteSalud_BuscarPorBovino @IdBovino={idBovino}")
            .AsNoTracking()
            .ToListAsync();

    public async Task AddAsync(ReportesSalud reporte)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_ReporteSalud_Guardar @IdBovino={reporte.IdBovino}, @IdUsuario={reporte.IdUsuario}, @Sintomas={reporte.Sintomas}, @Observaciones={reporte.Observaciones}, @Gravedad={reporte.Gravedad}, @Estado={reporte.Estado}, @Diagnostico={reporte.Diagnostico}, @Tratamiento={reporte.Tratamiento}")
            .ToListAsync();

        reporte.IdReporte = Convert.ToInt32(resultado.FirstOrDefault());
        if (reporte.IdReporte <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID del reporte de salud creado.");
    }

    public async Task UpdateAsync(ReportesSalud reporte)
    {
        if (await GetByIdAsync(reporte.IdReporte) is null)
            throw new KeyNotFoundException("El reporte de salud no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_ReporteSalud_Actualizar @IdReporte={reporte.IdReporte}, @IdBovino={reporte.IdBovino}, @IdUsuario={reporte.IdUsuario}, @Sintomas={reporte.Sintomas}, @Observaciones={reporte.Observaciones}, @Gravedad={reporte.Gravedad}, @Estado={reporte.Estado}, @Diagnostico={reporte.Diagnostico}, @Tratamiento={reporte.Tratamiento}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El reporte de salud no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_ReporteSalud_Eliminar @IdReporte={id}");
    }
}

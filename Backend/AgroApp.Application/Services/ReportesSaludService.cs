using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class ReportesSaludService : IReportesSaludService
{
    private readonly IReportesSaludRepository _repository;

    public ReportesSaludService(IReportesSaludRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ReportesSaludDto>> GetAllAsync() =>
        (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<ReportesSaludDto?> GetByIdAsync(int id)
    {
        var reporte = await _repository.GetByIdAsync(id);
        return reporte is null ? null : MapToDto(reporte);
    }

    public async Task<IEnumerable<ReportesSaludDto>> GetByBovinoAsync(int idBovino) =>
        (await _repository.GetByBovinoAsync(idBovino)).Select(MapToDto);

    public async Task<ReportesSaludDto> CreateAsync(ReportesSaludDto dto)
    {
        var reporte = new ReportesSalud
        {
            IdBovino = dto.IdBovino,
            IdUsuario = dto.IdUsuario,
            Sintomas = dto.Sintomas,
            Observaciones = dto.Observaciones,
            Gravedad = dto.Gravedad,
            Estado = dto.Estado,
            Diagnostico = dto.Diagnostico,
            Tratamiento = dto.Tratamiento
        };

        await _repository.AddAsync(reporte);
        return MapToDto(reporte);
    }

    public async Task UpdateAsync(int id, ReportesSaludDto dto)
    {
        var reporte = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("El reporte de salud no existe.");

        reporte.IdBovino = dto.IdBovino;
        reporte.IdUsuario = dto.IdUsuario;
        reporte.Sintomas = dto.Sintomas;
        reporte.Observaciones = dto.Observaciones;
        reporte.Gravedad = dto.Gravedad;
        reporte.Estado = dto.Estado;
        reporte.Diagnostico = dto.Diagnostico;
        reporte.Tratamiento = dto.Tratamiento;

        await _repository.UpdateAsync(reporte);
    }

    public async Task DeleteAsync(int id)
    {
        if (await _repository.GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El reporte de salud no existe.");

        await _repository.DeleteAsync(id);
    }

    private static ReportesSaludDto MapToDto(ReportesSalud reporte) => new()
    {
        IdReporte = reporte.IdReporte,
        IdBovino = reporte.IdBovino,
        IdUsuario = reporte.IdUsuario,
        FechaReporte = reporte.FechaReporte,
        Sintomas = reporte.Sintomas,
        Observaciones = reporte.Observaciones,
        Gravedad = reporte.Gravedad,
        Estado = reporte.Estado,
        FechaAtencion = reporte.FechaAtencion,
        Diagnostico = reporte.Diagnostico,
        Tratamiento = reporte.Tratamiento
    };
}

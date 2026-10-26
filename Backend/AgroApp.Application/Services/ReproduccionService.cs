using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class ReproduccionService : IReproduccionService
{
    private readonly IReproduccionRepository _repository;

    public ReproduccionService(IReproduccionRepository repository)
    {
        _repository = repository;
    }

    public async Task<ReproduccionDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return null;
        return MapToDto(entity);
    }

    public async Task<IEnumerable<ReproduccionDto>> GetAllByBovinoIdAsync(int idBovino)
    {
        var entities = await _repository.GetAllByBovinoIdAsync(idBovino);
        return entities.Select(MapToDto);
    }

    public async Task<ReproduccionDto> CreateAsync(ReproduccionDto dto)
    {
        var entity = new Reproduccion
        {
            IdBovino = dto.IdBovino,
            FechaMonta = dto.FechaMonta,
            TipoReproduccion = dto.TipoReproduccion,
            FechaInseminacion = dto.FechaInseminacion,
            Resultado = dto.Resultado ?? "Pendiente",
            FechaConfirmacion = dto.FechaConfirmacion,
            Observaciones = dto.Observaciones,
            IdUsuario = dto.IdUsuario,
            FechaRegistro = DateTime.UtcNow
        };

        if (entity.TipoReproduccion == "Monta Natural" && entity.FechaMonta.HasValue)
        {
            entity.FechaProbableParto = entity.FechaMonta.Value.AddDays(283);
        }
        else if (entity.TipoReproduccion == "Inseminacion Artificial" && entity.FechaInseminacion.HasValue)
        {
            entity.FechaProbableParto = entity.FechaInseminacion.Value.AddDays(283);
        }
        else
        {
            entity.FechaProbableParto = dto.FechaProbableParto;
        }

        await _repository.AddAsync(entity);
        return MapToDto(entity);
    }

    public async Task UpdateAsync(int id, ReproduccionDto dto)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) throw new KeyNotFoundException("Reproduccion no encontrada.");

        entity.FechaMonta = dto.FechaMonta;
        entity.TipoReproduccion = dto.TipoReproduccion;
        entity.FechaInseminacion = dto.FechaInseminacion;
        entity.Resultado = dto.Resultado;
        entity.FechaConfirmacion = dto.FechaConfirmacion;
        entity.Observaciones = dto.Observaciones;
        entity.IdUsuario = dto.IdUsuario;

        if (entity.TipoReproduccion == "Monta Natural" && entity.FechaMonta.HasValue)
        {
            entity.FechaProbableParto = entity.FechaMonta.Value.AddDays(283);
        }
        else if (entity.TipoReproduccion == "Inseminacion Artificial" && entity.FechaInseminacion.HasValue)
        {
            entity.FechaProbableParto = entity.FechaInseminacion.Value.AddDays(283);
        }
        else
        {
            entity.FechaProbableParto = dto.FechaProbableParto;
        }

        await _repository.UpdateAsync(entity);
    }

    public async Task DeleteAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    private ReproduccionDto MapToDto(Reproduccion entity)
    {
        return new ReproduccionDto
        {
            IdReproduccion = entity.IdReproduccion,
            IdBovino = entity.IdBovino,
            FechaMonta = entity.FechaMonta,
            TipoReproduccion = entity.TipoReproduccion,
            FechaInseminacion = entity.FechaInseminacion,
            Resultado = entity.Resultado,
            FechaConfirmacion = entity.FechaConfirmacion,
            FechaProbableParto = entity.FechaProbableParto,
            Observaciones = entity.Observaciones,
            IdUsuario = entity.IdUsuario,
            FechaRegistro = entity.FechaRegistro
        };
    }
}

using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class PartosService : IPartosService
{
    private readonly IPartosRepository _repository;

    public PartosService(IPartosRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<PartosDto>> GetAllAsync() =>
        (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<PartosDto?> GetByIdAsync(int id)
    {
        var parto = await _repository.GetByIdAsync(id);
        return parto is null ? null : MapToDto(parto);
    }

    public async Task<IEnumerable<PartosDto>> GetByMadreAsync(int idMadre) =>
        (await _repository.GetByMadreAsync(idMadre)).Select(MapToDto);

    public async Task<PartosDto> CreateAsync(PartosDto dto)
    {
        var parto = new Partos
        {
            IdMadre = dto.IdMadre,
            FechaParto = dto.FechaParto,
            TipoParto = dto.TipoParto,
            CantidadCrias = dto.CantidadCrias,
            Observaciones = dto.Observaciones,
            IdUsuario = dto.IdUsuario
        };

        await _repository.AddAsync(parto);
        return MapToDto(parto);
    }

    public async Task UpdateAsync(int id, PartosDto dto)
    {
        var parto = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("El parto no existe.");

        parto.IdMadre = dto.IdMadre;
        parto.FechaParto = dto.FechaParto;
        parto.TipoParto = dto.TipoParto;
        parto.CantidadCrias = dto.CantidadCrias;
        parto.Observaciones = dto.Observaciones;
        parto.IdUsuario = dto.IdUsuario;

        await _repository.UpdateAsync(parto);
    }

    public async Task DeleteAsync(int id)
    {
        if (await _repository.GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El parto no existe.");

        await _repository.DeleteAsync(id);
    }

    private static PartosDto MapToDto(Partos parto) => new()
    {
        IdParto = parto.IdParto,
        IdMadre = parto.IdMadre,
        FechaParto = parto.FechaParto,
        TipoParto = parto.TipoParto,
        CantidadCrias = parto.CantidadCrias,
        Observaciones = parto.Observaciones,
        IdUsuario = parto.IdUsuario,
        FechaRegistro = parto.FechaRegistro
    };
}

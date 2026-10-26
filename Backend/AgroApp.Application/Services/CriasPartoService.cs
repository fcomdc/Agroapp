using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class CriasPartoService : ICriasPartoService
{
    private readonly ICriasPartoRepository _repository;

    public CriasPartoService(ICriasPartoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CriasPartoDto>> GetAllAsync() =>
        (await _repository.GetAllAsync()).Select(MapToDto);

    public async Task<CriasPartoDto?> GetByIdAsync(int id)
    {
        var cria = await _repository.GetByIdAsync(id);
        return cria is null ? null : MapToDto(cria);
    }

    public async Task<CriasPartoDto> CreateAsync(CriasPartoDto dto)
    {
        var cria = new CriasParto
        {
            IdParto = dto.IdParto,
            IdBovino = dto.IdBovino,
            Sexo = dto.Sexo,
            Nombre = dto.Nombre,
            PesoNacimiento = dto.PesoNacimiento,
            EstadoCria = dto.EstadoCria,
            Observaciones = dto.Observaciones
        };

        await _repository.AddAsync(cria);
        return MapToDto(cria);
    }

    public async Task UpdateAsync(int id, CriasPartoDto dto)
    {
        var cria = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("La cría no existe.");

        cria.IdParto = dto.IdParto;
        cria.IdBovino = dto.IdBovino;
        cria.Sexo = dto.Sexo;
        cria.Nombre = dto.Nombre;
        cria.PesoNacimiento = dto.PesoNacimiento;
        cria.EstadoCria = dto.EstadoCria;
        cria.Observaciones = dto.Observaciones;

        await _repository.UpdateAsync(cria);
    }

    public async Task DeleteAsync(int id)
    {
        if (await _repository.GetByIdAsync(id) is null)
            throw new KeyNotFoundException("La cría no existe.");

        await _repository.DeleteAsync(id);
    }

    private static CriasPartoDto MapToDto(CriasParto cria) => new()
    {
        IdCria = cria.IdCria,
        IdParto = cria.IdParto,
        IdBovino = cria.IdBovino,
        Sexo = cria.Sexo,
        Nombre = cria.Nombre,
        PesoNacimiento = cria.PesoNacimiento,
        EstadoCria = cria.EstadoCria,
        Observaciones = cria.Observaciones
    };
}

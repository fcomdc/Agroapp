using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class PesosService : IPesosService
{
    private readonly IPesosRepository _repository;

    public PesosService(IPesosRepository repository)
    {
        _repository = repository;
    }

    // Obtener todos los registros de peso
    public async Task<IEnumerable<PesosDto>> GetAllAsync()
    {
        var pesos = await _repository.GetAllAsync();

        return pesos.Select(p => MapToDto(p));
    }

    // Obtener un registro por su ID
    public async Task<PesosDto?> GetByIdAsync(int id)
    {
        var peso = await _repository.GetByIdAsync(id);

        return peso == null ? null : MapToDto(peso);
    }

    // Obtener el historial de peso de un bovino
    public async Task<IEnumerable<PesosDto>> GetByBovinoAsync(int idBovino)
    {
        var pesos = await _repository.GetByBovinoAsync(idBovino);

        return pesos.Select(p => MapToDto(p));
    }

    // Registrar un nuevo peso
    public async Task<PesosDto> CreateAsync(PesosDto dto)
    {
        var peso = new Pesos
        {
            IdPeso = 0,
            IdBovino = dto.IdBovino,
            Peso = dto.Peso,
            FechaPeso = dto.FechaPeso,
            IdUsuario = dto.IdUsuario,
            Observaciones = dto.Observaciones,
            FechaRegistro = default
        };

        var creado = await _repository.CreateAsync(peso);

        return MapToDto(creado);
    }

    // Actualizar un registro de peso
    public async Task UpdateAsync(int id, PesosDto dto)
    {
        var peso = await _repository.GetByIdAsync(id);

        if (peso == null)
            throw new KeyNotFoundException("El registro de peso no existe.");

        peso.IdBovino = dto.IdBovino;
        peso.Peso = dto.Peso;
        peso.FechaPeso = dto.FechaPeso;
        peso.IdUsuario = dto.IdUsuario;
        peso.Observaciones = dto.Observaciones;

        await _repository.UpdateAsync(peso);
    }

    // Eliminar un registro de peso
    public async Task DeleteAsync(int id)
    {
        var peso = await _repository.GetByIdAsync(id);

        if (peso == null)
            throw new KeyNotFoundException("El registro de peso no existe.");

        await _repository.DeleteAsync(id);
    }

    // Convertir entidad a DTO
    private static PesosDto MapToDto(Pesos peso)
    {
        return new PesosDto
        {
            IdPeso = peso.IdPeso,
            IdBovino = peso.IdBovino,
            Peso = peso.Peso,
            FechaPeso = peso.FechaPeso,
            IdUsuario = peso.IdUsuario,
            Observaciones = peso.Observaciones,
            FechaRegistro = peso.FechaRegistro
        };
    }
}
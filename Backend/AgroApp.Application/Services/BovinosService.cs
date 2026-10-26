
using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class BovinosService : IBovinosService
{
    private readonly IBovinosRepository _repository;

    public BovinosService(IBovinosRepository repository)
    {
        _repository = repository;
    }

    // Obtener todos los bovinos
    public async Task<IEnumerable<BovinosDto>> GetAllAsync()
    {
        var bovinos = await _repository.GetAllAsync();

        return bovinos.Select(b => MapToDto(b));
    }

    // Obtener un bovino por su ID
    public async Task<BovinosDto?> GetByIdAsync(int id)
    {
        var bovino = await _repository.GetByIdAsync(id);

        return bovino == null ? null : MapToDto(bovino);
    }

    // Buscar un bovino por su código
    public async Task<BovinosDto?> GetByCodigoAsync(string codigo)
    {
        var bovino = await _repository.GetByCodigoAsync(codigo);

        return bovino == null ? null : MapToDto(bovino);
    }

    // Registrar un bovino
    public async Task<BovinosDto> CreateAsync(BovinosDto dto)
    {
        var existente = await _repository.GetByCodigoAsync(dto.Codigo);

        if (existente != null)
            throw new InvalidOperationException(
                "Ya existe un bovino registrado con ese código.");

        var bovino = MapToEntity(dto);

        // La base de datos genera el ID y la fecha de registro
        bovino.IdBovino = 0;
        bovino.FechaRegistro = default;

        var creado = await _repository.CreateAsync(bovino);

        return MapToDto(creado);
    }

    // Actualizar un bovino
    public async Task UpdateAsync(int id, BovinosDto dto)
    {
        var bovino = await _repository.GetByIdAsync(id);

        if (bovino == null)
            throw new KeyNotFoundException("Bovino no encontrado.");

        var codigoExistente = await _repository.GetByCodigoAsync(dto.Codigo);

        if (codigoExistente != null && codigoExistente.IdBovino != id)
            throw new InvalidOperationException(
                "El código ya pertenece a otro bovino.");

        bovino.Codigo = dto.Codigo;
        bovino.Nombre = dto.Nombre;
        bovino.Sexo = dto.Sexo;
        bovino.FechaNacimiento = dto.FechaNacimiento;
        bovino.Raza = dto.Raza;
        bovino.Color = dto.Color;
        bovino.Foto = dto.Foto;
        bovino.IdUbicacion = dto.IdUbicacion;
        bovino.Estado = dto.Estado;
        bovino.Observaciones = dto.Observaciones;

        await _repository.UpdateAsync(bovino);
    }

    // Eliminar un bovino
    public async Task DeleteAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    // Convertir entidad a DTO
    private static BovinosDto MapToDto(Bovino bovino)
    {
        return new BovinosDto
        {
            IdBovino = bovino.IdBovino,
            Codigo = bovino.Codigo,
            Nombre = bovino.Nombre,
            Sexo = bovino.Sexo,
            FechaNacimiento = bovino.FechaNacimiento,
            Raza = bovino.Raza,
            Color = bovino.Color,
            Foto = bovino.Foto,
            IdUbicacion = bovino.IdUbicacion,
            Estado = bovino.Estado,
            Observaciones = bovino.Observaciones,
            FechaRegistro = bovino.FechaRegistro
        };
    }

    // Convertir DTO a entidad
    private static Bovino MapToEntity(BovinosDto dto)
    {
        return new Bovino
        {
            Codigo = dto.Codigo,
            Nombre = dto.Nombre,
            Sexo = dto.Sexo,
            FechaNacimiento = dto.FechaNacimiento,
            Raza = dto.Raza,
            Color = dto.Color,
            Foto = dto.Foto,
            IdUbicacion = dto.IdUbicacion,
            Estado = string.IsNullOrWhiteSpace(dto.Estado)
                ? "Activo"
                : dto.Estado,
            Observaciones = dto.Observaciones
        };
    }
}

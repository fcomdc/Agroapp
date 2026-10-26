using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface IPesosService
{
    // Obtener todos los registros de peso
    Task<IEnumerable<PesosDto>> GetAllAsync();

    // Obtener un registro por su ID
    Task<PesosDto?> GetByIdAsync(int id);

    // Obtener el historial de peso de un bovino
    Task<IEnumerable<PesosDto>> GetByBovinoAsync(int idBovino);

    // Registrar un nuevo peso
    Task<PesosDto> CreateAsync(PesosDto dto);

    // Actualizar un registro de peso
    Task UpdateAsync(int id, PesosDto dto);

    // Eliminar un registro de peso
    Task DeleteAsync(int id);
}
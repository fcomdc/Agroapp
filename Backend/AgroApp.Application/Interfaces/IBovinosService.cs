
using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface IBovinosService
{
    // Obtener todos los bovinos
    Task<IEnumerable<BovinosDto>> GetAllAsync();

    // Obtener un bovino por su ID
    Task<BovinosDto?> GetByIdAsync(int id);

    // Buscar un bovino por su código
    Task<BovinosDto?> GetByCodigoAsync(string codigo);

    // Registrar un bovino
    Task<BovinosDto> CreateAsync(BovinosDto dto);

    // Actualizar un bovino
    Task UpdateAsync(int id, BovinosDto dto);

    // Eliminar un bovino
    Task DeleteAsync(int id);
}

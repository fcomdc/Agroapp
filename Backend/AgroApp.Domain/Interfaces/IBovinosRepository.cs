
using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces;

public interface IBovinosRepository
{
    // Obtener todos los bovinos
    Task<IEnumerable<Bovino>> GetAllAsync();

    // Obtener un bovino por su ID
    Task<Bovino?> GetByIdAsync(int id);

    // Buscar un bovino por su código
    Task<Bovino?> GetByCodigoAsync(string codigo);

    // Registrar un bovino
    Task<Bovino> CreateAsync(Bovino bovino);

    // Actualizar un bovino
    Task UpdateAsync(Bovino bovino);

    // Eliminar un bovino
    Task DeleteAsync(int id);
}

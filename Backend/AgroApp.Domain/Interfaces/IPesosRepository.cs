using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces;

public interface IPesosRepository
{
    // Obtener todos los registros de peso
    Task<IEnumerable<Pesos>> GetAllAsync();

    // Obtener un registro por su ID
    Task<Pesos?> GetByIdAsync(int id);

    // Obtener el historial de peso de un bovino
    Task<IEnumerable<Pesos>> GetByBovinoAsync(int idBovino);

    // Buscar registros de peso por nombre del bovino
    Task<IEnumerable<Pesos>> BuscarPorNombreAsync(string nombre);

    // Registrar un nuevo peso
    Task<Pesos> CreateAsync(Pesos peso);

    // Actualizar un registro de peso
    Task UpdateAsync(Pesos peso);

    // Eliminar un registro de peso
    Task DeleteAsync(int id);
}
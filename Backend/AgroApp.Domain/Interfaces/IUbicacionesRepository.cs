
using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces
{
    public interface IUbicacionesRepository
    {
        Task<Ubicaciones?> GetByIdAsync(int id);

        Task<IEnumerable<Ubicaciones>> GetAllAsync();

        Task<IEnumerable<Ubicaciones>> GetByNombreAsync(string nombre);

        Task AddAsync(Ubicaciones ubicacion);

        Task UpdateAsync(Ubicaciones ubicacion);

        Task DeleteAsync(int id);
    }
}

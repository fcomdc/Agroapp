using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces;

public interface IReproduccionRepository
{
    Task<Reproduccion?> GetByIdAsync(int id);
    Task<IEnumerable<Reproduccion>> GetAllByBovinoIdAsync(int idBovino);
    Task AddAsync(Reproduccion reproduccion);
    Task UpdateAsync(Reproduccion reproduccion);
    Task DeleteAsync(int id);
}

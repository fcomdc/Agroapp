using AgroApp.Domain.Entities;

namespace AgroApp.Application.Interfaces;

public interface IUsuarioService
{
    Task<Usuario?> GetByIdAsync(int id);
    Task<IEnumerable<Usuario>> GetAllAsync();
    Task<IEnumerable<Usuario>> GetByNombreAsync(string nombre);
    Task<Usuario?> GetByUsuarioAsync(string usuario);
    Task<Usuario> CreateAsync(Usuario usuario);
    Task<bool> UpdateAsync(Usuario usuario);
    Task<bool> DeleteAsync(int id);
}

using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _repository;

    public UsuarioService(IUsuarioRepository repository)
    {
        _repository = repository;
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Usuario>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<IEnumerable<Usuario>> GetByNombreAsync(string nombre)
    {
        return await _repository.GetByNombreAsync(nombre);
    }

    public async Task<Usuario?> GetByUsuarioAsync(string usuario)
    {
        return await _repository.GetByUsuarioAsync(usuario);
    }

    public async Task<Usuario> CreateAsync(Usuario usuario)
    {
        if (string.IsNullOrWhiteSpace(usuario.NombreCompleto))
            throw new ArgumentException("El nombre completo es obligatorio.");

        if (string.IsNullOrWhiteSpace(usuario.NombreUsuario))
            throw new ArgumentException("El nombre de usuario es obligatorio.");

        if (string.IsNullOrWhiteSpace(usuario.Contrasena))
            throw new ArgumentException("La contraseña es obligatoria.");

        string[] rolesPermitidos = { "Administrador", "Trabajador", "Veterinario" };

        if (!rolesPermitidos.Contains(usuario.Rol))
            throw new ArgumentException("El rol especificado no es válido.");

        var existente = await _repository.GetByUsuarioAsync(usuario.NombreUsuario);

        if (existente != null)
            throw new InvalidOperationException("El nombre de usuario ya existe.");

        usuario.Estado = true;
        usuario.FechaRegistro = DateTime.UtcNow;

        await _repository.AddAsync(usuario);
        return usuario;
    }

    public async Task<bool> UpdateAsync(Usuario usuario)
    {
        var existente = await _repository.GetByIdAsync(usuario.IdUsuario);

        if (existente == null)
            return false;

        if (string.IsNullOrWhiteSpace(usuario.NombreCompleto))
            throw new ArgumentException("El nombre completo es obligatorio.");

        if (string.IsNullOrWhiteSpace(usuario.NombreUsuario))
            throw new ArgumentException("El nombre de usuario es obligatorio.");

        string[] rolesPermitidos = { "Administrador", "Trabajador", "Veterinario" };

        if (!rolesPermitidos.Contains(usuario.Rol))
            throw new ArgumentException("El rol especificado no es válido.");

        var duplicado = await _repository.GetByUsuarioAsync(usuario.NombreUsuario);

        if (duplicado != null && duplicado.IdUsuario != usuario.IdUsuario)
            throw new InvalidOperationException("El nombre de usuario ya pertenece a otra cuenta.");

        existente.NombreCompleto = usuario.NombreCompleto;
        existente.NombreUsuario = usuario.NombreUsuario;
        existente.Rol = usuario.Rol;
        existente.Estado = usuario.Estado;

        await _repository.UpdateAsync(existente);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existente = await _repository.GetByIdAsync(id);

        if (existente == null)
            return false;

        await _repository.DeleteAsync(id);
        return true;
    }
}

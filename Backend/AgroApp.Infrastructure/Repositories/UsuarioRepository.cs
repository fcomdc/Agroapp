using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;
using AgroApp.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AgroDbContext _context;

    public UsuarioRepository(AgroDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return (await GetAllAsync())
            .FirstOrDefault(u => u.IdUsuario == id);
    }

    public async Task<IEnumerable<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios
            .FromSqlInterpolated($"EXEC dbo.sp_Usuario_Buscar @NombreCompleto={string.Empty}")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Usuario>> GetByNombreAsync(string nombre)
    {
        return await _context.Usuarios
            .FromSqlInterpolated(
                $"EXEC dbo.sp_Usuario_Buscar @NombreCompleto={nombre}")
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Usuario?> GetByUsuarioAsync(string usuario)
    {
        return (await GetAllAsync())
            .FirstOrDefault(u => u.NombreUsuario == usuario);
    }

    public async Task AddAsync(Usuario usuario)
    {
        var resultado = await _context.Database
            .SqlQuery<decimal>($"EXEC dbo.sp_Usuario_Guardar @NombreCompleto={usuario.NombreCompleto}, @Usuario={usuario.NombreUsuario}, @Contrasena={usuario.Contrasena}, @Rol={usuario.Rol}")
            .ToListAsync();

        usuario.IdUsuario = Convert.ToInt32(resultado.FirstOrDefault());
        if (usuario.IdUsuario <= 0)
            throw new InvalidOperationException("No se pudo obtener el ID del usuario creado.");
    }

    public async Task UpdateAsync(Usuario usuario)
    {
        if (await GetByIdAsync(usuario.IdUsuario) is null)
            throw new KeyNotFoundException("El usuario no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync($"EXEC dbo.sp_Usuario_Actualizar @IdUsuario={usuario.IdUsuario}, @NombreCompleto={usuario.NombreCompleto}, @Usuario={usuario.NombreUsuario}, @Contrasena={usuario.Contrasena}, @Rol={usuario.Rol}, @Estado={usuario.Estado}");
    }

    public async Task DeleteAsync(int id)
    {
        if (await GetByIdAsync(id) is null)
            throw new KeyNotFoundException("El usuario no existe.");

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"EXEC dbo.sp_Usuario_Eliminar @IdUsuario={id}");
    }
}

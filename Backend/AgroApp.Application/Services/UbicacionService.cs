using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services
{
    public class UbicacionService : IUbicacionesService
    {
        private readonly IUbicacionesRepository _repository;

        public UbicacionService(IUbicacionesRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<UbicacionesDto>> GetAllAsync()
        {
            var ubicaciones = await _repository.GetAllAsync();

            return ubicaciones.Select(u => new UbicacionesDto
            {
                IdUbicacion = u.IdUbicacion,
                Nombre = u.Nombre,
                Tipo = u.Tipo,
                Descripcion = u.Descripcion,
                Estado = u.Estado
            });
        }

        public async Task<UbicacionesDto?> GetByIdAsync(int id)
        {
            var u = await _repository.GetByIdAsync(id);

            if (u == null)
                return null;

            return new UbicacionesDto
            {
                IdUbicacion = u.IdUbicacion,
                Nombre = u.Nombre,
                Tipo = u.Tipo,
                Descripcion = u.Descripcion,
                Estado = u.Estado
            };
        }

        public async Task<IEnumerable<UbicacionesDto>> GetByNombreAsync(
            string nombre)
        {
            var ubicaciones = await _repository.GetByNombreAsync(nombre);

            return ubicaciones.Select(u => new UbicacionesDto
            {
                IdUbicacion = u.IdUbicacion,
                Nombre = u.Nombre,
                Tipo = u.Tipo,
                Descripcion = u.Descripcion,
                Estado = u.Estado
            });
        }

        public async Task<UbicacionesDto> CreateAsync(UbicacionesDto dto)
        {
            var ubicacion = new Ubicaciones
            {
                Nombre = dto.Nombre,
                Tipo = dto.Tipo,
                Descripcion = dto.Descripcion,
                Estado = dto.Estado
            };

            await _repository.AddAsync(ubicacion);

            dto.IdUbicacion = ubicacion.IdUbicacion;

            return new UbicacionesDto
            {
                IdUbicacion = ubicacion.IdUbicacion,
                Nombre = ubicacion.Nombre,
                Tipo = ubicacion.Tipo,
                Descripcion = ubicacion.Descripcion,
                Estado = ubicacion.Estado
            };
        }

        public async Task<bool> UpdateAsync(int id, UbicacionesDto dto)
        {
            var ubicacion = await _repository.GetByIdAsync(id);

            if (ubicacion == null)
                return false;

            ubicacion.Nombre = dto.Nombre;
            ubicacion.Tipo = dto.Tipo;
            ubicacion.Descripcion = dto.Descripcion;
            ubicacion.Estado = dto.Estado;

            await _repository.UpdateAsync(ubicacion);

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ubicacion = await _repository.GetByIdAsync(id);

            if (ubicacion == null)
                return false;

            await _repository.DeleteAsync(id);

            return true;
        }
    }
}

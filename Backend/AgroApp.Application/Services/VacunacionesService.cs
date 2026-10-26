using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services
{
    public class VacunacionesService : IVacunacionesService
    {
        private readonly IVacunacionesRepository _vacunacionesRepository;

        public VacunacionesService(
            IVacunacionesRepository vacunacionesRepository)
        {
            _vacunacionesRepository = vacunacionesRepository;
        }

        public async Task<IEnumerable<VacunacionesDto>> ObtenerTodasAsync()
        {
            var vacunaciones = await _vacunacionesRepository.GetAllAsync();

            return vacunaciones.Select(MapearADto);
        }

        public async Task<VacunacionesDto?> ObtenerPorIdAsync(int id)
        {
            var vacunacion = await _vacunacionesRepository.GetByIdAsync(id);

            return vacunacion == null ? null : MapearADto(vacunacion);
        }

        public async Task<VacunacionesDto> CrearAsync(VacunacionesDto vacunacionDto)
        {
            var vacunacion = new Vacunaciones
            {
                IdBovino = vacunacionDto.IdBovino,
                FechaAplicacion = vacunacionDto.FechaAplicacion,
                ProximaAplicacion = vacunacionDto.ProximaAplicacion,
                Dosis = vacunacionDto.Dosis,
                Lote = vacunacionDto.Lote,
                IdUsuario = vacunacionDto.IdUsuario,
                Observaciones = vacunacionDto.Observaciones,
                FechaRegistro = DateTime.Now
            };

            await _vacunacionesRepository.AddAsync(vacunacion);

            return MapearADto(vacunacion);
        }

        public async Task<bool> ActualizarAsync(int id, VacunacionesDto vacunacionDto)
        {
            var vacunacion = await _vacunacionesRepository.GetByIdAsync(id);

            if (vacunacion == null)
                return false;

            vacunacion.IdBovino = vacunacionDto.IdBovino;
            vacunacion.FechaAplicacion = vacunacionDto.FechaAplicacion;
            vacunacion.ProximaAplicacion = vacunacionDto.ProximaAplicacion;
            vacunacion.Dosis = vacunacionDto.Dosis;
            vacunacion.Lote = vacunacionDto.Lote;
            vacunacion.IdUsuario = vacunacionDto.IdUsuario;
            vacunacion.Observaciones = vacunacionDto.Observaciones;

            await _vacunacionesRepository.UpdateAsync(vacunacion);

            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var vacunacion = await _vacunacionesRepository.GetByIdAsync(id);

            if (vacunacion == null)
                return false;

            await _vacunacionesRepository.DeleteAsync(id);

            return true;
        }

        private static VacunacionesDto MapearADto(Vacunaciones vacunacion)
        {
            return new VacunacionesDto
            {
                IdVacunacion = vacunacion.IdVacunacion,
                IdBovino = vacunacion.IdBovino,
                FechaAplicacion = vacunacion.FechaAplicacion,
                ProximaAplicacion = vacunacion.ProximaAplicacion,
                Dosis = vacunacion.Dosis,
                Lote = vacunacion.Lote,
                IdUsuario = vacunacion.IdUsuario,
                Observaciones = vacunacion.Observaciones,
                FechaRegistro = vacunacion.FechaRegistro
            };
        }
    }
}
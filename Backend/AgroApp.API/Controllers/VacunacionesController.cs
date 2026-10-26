using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VacunacionesController : ControllerBase
    {
        private readonly IVacunacionesService _vacunacionesService;

        public VacunacionesController(
            IVacunacionesService vacunacionesService)
        {
            _vacunacionesService = vacunacionesService;
        }

        // GET: api/Vacunaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VacunacionesDto>>> GetAll()
        {
            var vacunaciones = await _vacunacionesService.ObtenerTodasAsync();

            return Ok(vacunaciones);
        }

        // GET: api/Vacunaciones/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<VacunacionesDto>> GetById(int id)
        {
            var vacunacion = await _vacunacionesService.ObtenerPorIdAsync(id);

            if (vacunacion == null)
                return NotFound(new
                {
                    mensaje = "No se encontró la vacunación solicitada."
                });

            return Ok(vacunacion);
        }

        // POST: api/Vacunaciones
        [HttpPost]
        public async Task<ActionResult<VacunacionesDto>> Create(
            [FromBody] VacunacionesDto vacunacionDto)
        {
            var vacunacionCreada =
                await _vacunacionesService.CrearAsync(vacunacionDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = vacunacionCreada.IdVacunacion },
                vacunacionCreada);
        }

        // PUT: api/Vacunaciones/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] VacunacionesDto vacunacionDto)
        {
            var actualizada = await _vacunacionesService
                .ActualizarAsync(id, vacunacionDto);

            if (!actualizada)
                return NotFound(new
                {
                    mensaje = "No se encontró la vacunación solicitada."
                });

            return NoContent();
        }

        // DELETE: api/Vacunaciones/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminada = await _vacunacionesService.EliminarAsync(id);

            if (!eliminada)
                return NotFound(new
                {
                    mensaje = "No se encontró la vacunación solicitada."
                });

            return NoContent();
        }
    }
}
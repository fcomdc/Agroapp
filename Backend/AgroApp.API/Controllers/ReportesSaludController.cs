using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportesSaludController : ControllerBase
{
    private readonly IReportesSaludService _service;

    public ReportesSaludController(IReportesSaludService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var reporte = await _service.GetByIdAsync(id);
        return reporte is null
            ? NotFound(new { mensaje = "El reporte de salud no existe." })
            : Ok(reporte);
    }

    [HttpGet("bovino/{idBovino:int}")]
    public async Task<IActionResult> GetByBovino(int idBovino) =>
        Ok(await _service.GetByBovinoAsync(idBovino));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ReportesSaludDto dto)
    {
        var reporte = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = reporte.IdReporte }, reporte);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ReportesSaludDto dto)
    {
        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { mensaje = "El reporte de salud no existe." });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { mensaje = "El reporte de salud no existe." });
        }
    }
}

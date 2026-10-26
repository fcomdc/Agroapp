using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PesosController : ControllerBase
{
    private readonly IPesosService _service;

    public PesosController(IPesosService service)
    {
        _service = service;
    }

    // Obtener todos los registros de peso
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pesos = await _service.GetAllAsync();
        return Ok(pesos);
    }

    // Obtener un registro por su ID
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var peso = await _service.GetByIdAsync(id);

        if (peso == null)
            return NotFound(new { mensaje = "El registro de peso no existe." });

        return Ok(peso);
    }

    // Obtener el historial de peso de un bovino
    [HttpGet("bovino/{idBovino:int}")]
    public async Task<IActionResult> GetByBovino(int idBovino)
    {
        var pesos = await _service.GetByBovinoAsync(idBovino);
        return Ok(pesos);
    }

    // Registrar un nuevo peso
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PesosDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var peso = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = peso.IdPeso },
            peso
        );
    }

    // Actualizar un registro de peso
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PesosDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { mensaje = "El registro de peso no existe." });
        }
    }

    // Eliminar un registro de peso
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
            return NotFound(new { mensaje = "El registro de peso no existe." });
        }
    }
}
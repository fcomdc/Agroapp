using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PartosController : ControllerBase
{
    private readonly IPartosService _service;

    public PartosController(IPartosService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parto = await _service.GetByIdAsync(id);
        return parto is null
            ? NotFound(new { mensaje = "El parto no existe." })
            : Ok(parto);
    }

    [HttpGet("madre/{idMadre:int}")]
    public async Task<IActionResult> GetByMadre(int idMadre) =>
        Ok(await _service.GetByMadreAsync(idMadre));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PartosDto dto)
    {
        var parto = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = parto.IdParto }, parto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PartosDto dto)
    {
        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { mensaje = "El parto no existe." });
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
            return NotFound(new { mensaje = "El parto no existe." });
        }
    }
}

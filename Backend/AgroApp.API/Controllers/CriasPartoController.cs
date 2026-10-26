using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CriasPartoController : ControllerBase
{
    private readonly ICriasPartoService _service;

    public CriasPartoController(ICriasPartoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cria = await _service.GetByIdAsync(id);
        return cria is null
            ? NotFound(new { mensaje = "La cría no existe." })
            : Ok(cria);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CriasPartoDto dto)
    {
        var cria = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = cria.IdCria }, cria);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CriasPartoDto dto)
    {
        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { mensaje = "La cría no existe." });
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
            return NotFound(new { mensaje = "La cría no existe." });
        }
    }
}

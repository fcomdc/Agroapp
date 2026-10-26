
using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BovinosController : ControllerBase
{
    private readonly IBovinosService _service;

    public BovinosController(IBovinosService service)
    {
        _service = service;
    }

    // GET: api/Bovinos
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bovinos = await _service.GetAllAsync();
        return Ok(bovinos);
    }

    // GET: api/Bovinos/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var bovino = await _service.GetByIdAsync(id);

        if (bovino == null)
            return NotFound(new { mensaje = "Bovino no encontrado." });

        return Ok(bovino);
    }

    // GET: api/Bovinos/codigo/BOV-001
    [HttpGet("codigo/{codigo}")]
    public async Task<IActionResult> GetByCodigo(string codigo)
    {
        var bovino = await _service.GetByCodigoAsync(codigo);

        if (bovino == null)
            return NotFound(new { mensaje = "Bovino no encontrado." });

        return Ok(bovino);
    }

    // POST: api/Bovinos
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BovinosDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var created = await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.IdBovino },
                created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensaje = ex.Message });
        }
    }

    // PUT: api/Bovinos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] BovinosDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensaje = ex.Message });
        }
    }

    // DELETE: api/Bovinos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
    }
}

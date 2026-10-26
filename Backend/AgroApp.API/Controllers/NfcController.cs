using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgroApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NfcController : ControllerBase
{
    private readonly INfcService _service;

    public NfcController(INfcService service)
    {
        _service = service;
    }

    // Obtener todas las etiquetas NFC
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var etiquetas = await _service.GetAllAsync();

        return Ok(etiquetas);
    }

    // Obtener una etiqueta NFC por su ID
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var nfc = await _service.GetByIdAsync(id);

        if (nfc == null)
            return NotFound(new { mensaje = "Etiqueta NFC no encontrada." });

        return Ok(nfc);
    }

    // Buscar una etiqueta NFC por su UID
    [HttpGet("uid/{uid}")]
    public async Task<IActionResult> GetByUID(string uid)
    {
        var nfc = await _service.GetByUIDAsync(uid);

        if (nfc == null)
            return NotFound(new { mensaje = "No existe una etiqueta NFC con ese UID." });

        return Ok(nfc);
    }

    // Obtener las etiquetas NFC de un bovino
    [HttpGet("bovino/{idBovino:int}")]
    public async Task<IActionResult> GetByBovino(int idBovino)
    {
        var etiquetas = await _service.GetByBovinoAsync(idBovino);

        return Ok(etiquetas);
    }

    // Registrar una etiqueta NFC
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NfcDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var creada = await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = creada.IdNFC },
                creada);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensaje = ex.Message });
        }
    }

    // Actualizar una etiqueta NFC
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] NfcDto dto)
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

    // Eliminar una etiqueta NFC
    [HttpDelete("{id:int}")]
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

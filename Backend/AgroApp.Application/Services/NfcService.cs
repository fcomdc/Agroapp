
using AgroApp.Application.DTOs;
using AgroApp.Application.Interfaces;
using AgroApp.Domain.Entities;
using AgroApp.Domain.Interfaces;

namespace AgroApp.Application.Services;

public class NfcService : INfcService
{
    private readonly INfcRepository _repository;

    public NfcService(INfcRepository repository)
    {
        _repository = repository;
    }

    // Obtener todas las etiquetas NFC
    public async Task<IEnumerable<NfcDto>> GetAllAsync()
    {
        var etiquetas = await _repository.GetAllAsync();

        return etiquetas.Select(n => MapToDto(n));
    }

    // Obtener una etiqueta NFC por su ID
    public async Task<NfcDto?> GetByIdAsync(int id)
    {
        var nfc = await _repository.GetByIdAsync(id);

        return nfc == null ? null : MapToDto(nfc);
    }

    // Buscar una etiqueta NFC por su UID
    public async Task<NfcDto?> GetByUIDAsync(string uid)
    {
        var nfc = await _repository.GetByUIDAsync(uid);

        return nfc == null ? null : MapToDto(nfc);
    }

    // Obtener las etiquetas NFC asociadas a un bovino
    public async Task<IEnumerable<NfcDto>> GetByBovinoAsync(int idBovino)
    {
        var etiquetas = await _repository.GetByBovinoAsync(idBovino);

        return etiquetas.Select(n => MapToDto(n));
    }

    // Registrar una etiqueta NFC
    public async Task<NfcDto> CreateAsync(NfcDto dto)
    {
        var existente = await _repository.GetByUIDAsync(dto.UID_NFC);

        if (existente != null)
            throw new InvalidOperationException(
                "Ya existe una etiqueta NFC registrada con ese UID.");

        var nfc = MapToEntity(dto);

        // La base de datos genera el ID y la fecha de asignación
        nfc.IdNFC = 0;
        nfc.FechaAsignacion = default;
        nfc.Estado = true;

        var creado = await _repository.CreateAsync(nfc);

        return MapToDto(creado);
    }

    // Actualizar una etiqueta NFC
    public async Task UpdateAsync(int id, NfcDto dto)
    {
        var nfc = await _repository.GetByIdAsync(id);

        if (nfc == null)
            throw new KeyNotFoundException(
                "Etiqueta NFC no encontrada.");

        var uidExistente = await _repository.GetByUIDAsync(dto.UID_NFC);

        if (uidExistente != null && uidExistente.IdNFC != id)
            throw new InvalidOperationException(
                "El UID ya pertenece a otra etiqueta NFC.");

        nfc.IdBovino = dto.IdBovino;
        nfc.UID_NFC = dto.UID_NFC;
        nfc.TipoTag = dto.TipoTag;
        nfc.Estado = dto.Estado;

        await _repository.UpdateAsync(nfc);
    }

    // Eliminar una etiqueta NFC
    public async Task DeleteAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    // Convertir entidad a DTO
    private static NfcDto MapToDto(NFC nfc)
    {
        return new NfcDto
        {
            IdNFC = nfc.IdNFC,
            IdBovino = nfc.IdBovino,
            UID_NFC = nfc.UID_NFC,
            TipoTag = nfc.TipoTag,
            Estado = nfc.Estado,
            FechaAsignacion = nfc.FechaAsignacion
        };
    }

    // Convertir DTO a entidad
    private static NFC MapToEntity(NfcDto dto)
    {
        return new NFC
        {
            IdBovino = dto.IdBovino,
            UID_NFC = dto.UID_NFC,
            TipoTag = dto.TipoTag,
            Estado = dto.Estado
        };
    }
}

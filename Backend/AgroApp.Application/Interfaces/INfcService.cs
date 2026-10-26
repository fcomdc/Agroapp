
using AgroApp.Application.DTOs;

namespace AgroApp.Application.Interfaces;

public interface INfcService
{
    Task<IEnumerable<NfcDto>> GetAllAsync();

    Task<NfcDto?> GetByIdAsync(int id);

    Task<NfcDto?> GetByUIDAsync(string uid);

    Task<IEnumerable<NfcDto>> GetByBovinoAsync(int idBovino);

    Task<NfcDto> CreateAsync(NfcDto dto);

    Task UpdateAsync(int id, NfcDto dto);

    Task DeleteAsync(int id);
}

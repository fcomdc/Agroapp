using AgroApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgroApp.Domain.Interfaces
{
    public interface INfcRepository
    {
        Task<IEnumerable<NFC>> GetAllAsync();

        Task<NFC?> GetByIdAsync(int id);

        Task<NFC?> GetByUIDAsync(string uid);

        Task<IEnumerable<NFC>> GetByBovinoAsync(int idBovino);

        Task<NFC> CreateAsync(NFC nfc);

        Task UpdateAsync(NFC nfc);

        Task DeleteAsync(int id);
    }
}

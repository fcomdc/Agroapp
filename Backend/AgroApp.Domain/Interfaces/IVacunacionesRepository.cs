using System;
using System.Collections.Generic;
using System.Text;

using AgroApp.Domain.Entities;

namespace AgroApp.Domain.Interfaces
{
    public interface IVacunacionesRepository
    {
        Task<IEnumerable<Vacunaciones>> GetAllAsync();

        Task<Vacunaciones?> GetByIdAsync(int id);

        Task<IEnumerable<Vacunaciones>> GetByBovinoAsync(int idBovino);

        Task AddAsync(Vacunaciones vacunacion);

        Task UpdateAsync(Vacunaciones vacunacion);

        Task DeleteAsync(int id);
    }
}

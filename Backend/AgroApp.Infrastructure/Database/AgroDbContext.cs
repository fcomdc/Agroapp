using AgroApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgroApp.Infrastructure.Database;

public class AgroDbContext : DbContext
{
    public AgroDbContext(DbContextOptions<AgroDbContext> options) : base(options)
    {
    }

    public DbSet<Reproduccion> Reproducciones { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Ubicaciones> Ubicaciones { get; set; }
    public DbSet<Bovino> Bovinos { get; set; }
    public DbSet<NFC> NFCs { get; set; }
    public DbSet<Pesos> Pesos { get; set; }
    public DbSet<Vacunaciones> Vacunaciones { get; set; }
    public DbSet<ReportesSalud> ReportesSalud { get; set; }
    public DbSet<Partos> Partos { get; set; }
    public DbSet<CriasParto> CriasParto { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Reproduccion>(entity =>
        {
            entity.HasKey(e => e.IdReproduccion);
            entity.Property(e => e.IdBovino).IsRequired();
            entity.Property(e => e.TipoReproduccion).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario);
        });

        modelBuilder.Entity<Ubicaciones>(entity =>
        {
            entity.HasKey(e => e.IdUbicacion);
        });
    }
}

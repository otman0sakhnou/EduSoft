using Microsoft.EntityFrameworkCore;

namespace BackOfficeService
{
  public class BackOfficeDbContext : DbContext
  {
    public BackOfficeDbContext()
    {
    }

    public BackOfficeDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Filière> Filières { get; set; }
    public DbSet<Module> Modules { get; set; }
    public DbSet<Groupe> Groupes { get; set; }
    public DbSet<Étudiant> Étudiants { get; set; }
    public DbSet<Séance> Séances { get; set; }
    public DbSet<Facture> Factures { get; set; }
    public DbSet<FilièreModule> FilièreModules { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      // Configure cascading delete and update for Filière-Module relationship
      // Configure cascading delete for Filière-Module relationship
      modelBuilder.Entity<FilièreModule>()
          .HasKey(fm => new { fm.FilièreId, fm.ModuleId });

      modelBuilder.Entity<FilièreModule>()
          .HasOne(fm => fm.Filière)
          .WithMany(f => f.FilièreModules)
          .HasForeignKey(fm => fm.FilièreId)
          .OnDelete(DeleteBehavior.Cascade); // Set cascading delete behavior

      modelBuilder.Entity<FilièreModule>()
          .HasOne(fm => fm.Module)
          .WithMany(m => m.FilièreModules)
          .HasForeignKey(fm => fm.ModuleId)
          .OnDelete(DeleteBehavior.Cascade); // Set cascading delete behavior

      // Configure cascading delete for Groupe-Étudiant relationship
      modelBuilder.Entity<Groupe>()
          .HasMany(g => g.Étudiants)
          .WithOne(e => e.Groupe)
          .HasForeignKey(e => e.IdGroupe)
          .OnDelete(DeleteBehavior.Cascade); // Set cascading delete behavior

      // Configure cascading delete for Module-Séance relationship
      modelBuilder.Entity<Module>()
          .HasMany(m => m.Séances)
          .WithOne(s => s.Module)
          .HasForeignKey(s => s.ModuleId)
          .OnDelete(DeleteBehavior.Cascade); // Set cascading delete behavior

      // Configure cascading delete for Groupe-Séance relationship
      modelBuilder.Entity<Groupe>()
          .HasMany(g => g.Séances)
          .WithOne(s => s.Groupe)
          .HasForeignKey(s => s.GroupeId)
          .OnDelete(DeleteBehavior.Cascade); // Set cascading delete behavior

      base.OnModelCreating(modelBuilder);
    }
  }
}

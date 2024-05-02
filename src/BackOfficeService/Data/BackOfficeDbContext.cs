using Microsoft.EntityFrameworkCore;

namespace BackOfficeService;

public class BackOfficeDbContext :DbContext
{
    public BackOfficeDbContext()
    {
    }

    public BackOfficeDbContext(DbContextOptions options) :base(options)
  {
    
  }

  public DbSet<Filière> Filières { get; set; }
  public DbSet<Module> Modules { get; set; }
  public DbSet<Groupe> Groupes { get; set; }
  public DbSet<Étudiant> Étudiants { get; set; }
  public DbSet<Séance> Séances { get; set; }
  public DbSet<Absence> Absences { get; set; }
  public DbSet<Facture> Factures { get; set; }

  //  protected override void OnModelCreating(ModelBuilder modelBuilder)
  //       {
  //           modelBuilder.Entity<Module>()
  //               .HasOne(m => m.Filière)
  //               .WithMany()
  //               .HasForeignKey(m => m.IdFilière)
  //               .OnDelete(DeleteBehavior.Cascade); // <-- Set cascading delete behavior

  //           // Other configurations...

  //           base.OnModelCreating(modelBuilder);
  //       }
}

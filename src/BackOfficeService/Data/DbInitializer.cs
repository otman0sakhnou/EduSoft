
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService.Data;

public class DbInitializer
{
  public static void InitDb(WebApplication app)
  {
    using var scope = app.Services.CreateScope();
    SeedData(scope.ServiceProvider.GetService<BackOfficeDbContext>());
  }

  private static void SeedData(BackOfficeDbContext context)
  {
    context.Database.Migrate();

    // Check if the database has been already seeded
    if (context.Filières.Any() || context.Groupes.Any() || context.Modules.Any() || context.Étudiants.Any())
    {
      Console.WriteLine("Already have data - there's no need to seed anything");
    }
    else
    {
      // Seed Filières (Departments)
      var filières = new Filière[]
      {
                    new Filière { IdFilière = Guid.NewGuid(), NomFilière = "Informatique", Description = "Département d'informatique" },
                    new Filière { IdFilière = Guid.NewGuid(), NomFilière = "Managment", Description = "Département de managment" },

      };
      context.Filières.AddRange(filières);
      context.SaveChanges();

      // Seed Groupe (Groups)
      var groupes = new Groupe[]
      {
                    new Groupe { GroupeID = Guid.NewGuid(), NomGroupe = "Groupe A", IdFilière = filières[0].IdFilière },
                    new Groupe { GroupeID = Guid.NewGuid(), NomGroupe = "Groupe B", IdFilière = filières[1].IdFilière },

      };
      context.Groupes.AddRange(groupes);
      context.SaveChanges();

      // Seed Module
      var modules = new Module[]
      {
                    new Module { ModuleId = Guid.NewGuid(), NomModule = "Module 1", IdFilière = filières[0].IdFilière },
                    new Module { ModuleId = Guid.NewGuid(), NomModule = "Module 2", IdFilière = filières[1].IdFilière },

      };
      context.Modules.AddRange(modules);
      context.SaveChanges();

      // Seed Étudiant (Students)
      var étudiants = new Étudiant[]
  {
    new Étudiant { EtudiantId = Guid.NewGuid(), CNE = "CNE654321", CIN = "CIN123456", Nom = "Omar", Prenom = "Hassan", Adresse = "246 Avenue Example",DateDeNaissance = new DateOnly(1995, 5, 15), LieuDeNaissance = "Rabat", Telephone = "1234567890", Email = "omar.hassan@example.com", IdGroupe = groupes[1].GroupeID },
    new Étudiant { EtudiantId = Guid.NewGuid(), CNE = "CNE987654", CIN = "CIN789012", Nom = "Nadia", Prenom = "Amine", Adresse = "357 Street Sample", DateDeNaissance = new DateOnly(1998, 10, 25),LieuDeNaissance = "Casablanca", Telephone = "0987654321", Email = "nadia.amine@example.com", IdGroupe = groupes[0].GroupeID },
    new Étudiant { EtudiantId = Guid.NewGuid(), CNE = "CNE123456",CIN = "CIN654321",Nom = "Karim", Prenom = "Ali", Adresse = "468 Lane Demo",  DateDeNaissance = new DateOnly(1997, 8, 7), LieuDeNaissance = "Fes",Telephone = "1029384756", Email = "karim.ali@example.com", IdGroupe = groupes[1].GroupeID }
  };
      context.Étudiants.AddRange(étudiants);
      context.SaveChanges();



    }
  }
}




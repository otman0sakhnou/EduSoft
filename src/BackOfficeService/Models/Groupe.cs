using System.ComponentModel.DataAnnotations.Schema;

namespace BackOfficeService;

[Table("Groupe")]
public class Groupe
{
  public Guid GroupeID { get; set; }
  public string NomGroupe { get; set; }
  public Guid IdFilière { get; set; }
  [ForeignKey("IdFilière")]
  public Filière Filière { get; set; }
  public ICollection<Étudiant> Étudiants { get; set; }
  public ICollection<Séance> Séances { get; set; }
}

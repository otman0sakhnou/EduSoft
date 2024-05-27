using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackOfficeService;


public class Séance
{
  [Key]
  public Guid IdSéance { get; set; }
  public string NomProfesseur { get; set; }
  public Guid GroupeId { get; set; }
  [ForeignKey("GroupeId")]
  public Groupe Groupe { get; set; }
  public Guid ModuleId { get; set; }
  [ForeignKey("ModuleId")]
  public Module Module { get; set; }
  public DateOnly DateSéance { get; set; }
  public string HeureDébut { get; set; }
  public string HeureFin { get; set; }
  public List<Guid> ÉtudiantsAbsents { get; set; }
}

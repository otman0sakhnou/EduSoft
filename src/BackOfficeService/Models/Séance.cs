using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class Séance
{
  [Key]
  public Guid IdSéance { get; set; }
  public string NomProfesseur { get; set; }
  public string NomGroupe { get; set; }
  public string NomModule { get; set; }
  public DateOnly DateSéance { get; set; }
  public string HeureDébut { get; set; }
  public string HeureFin { get; set; }
}

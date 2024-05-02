using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class Absence
{
  [Key]
  public Guid IdAbsence { get; set; }
  public string NomProfesseur { get; set; }
  public string NomÉtudiant { get; set; }
  public string NomGroupe { get; set; }
  public string NomModule { get; set; }
  public DateOnly DateAbsence { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class SignaleAbsenceDto
{
 
  public string NomProfesseur { get; set; }

  [Required(ErrorMessage = "Le nom de l'étudiant est requis.")]
  public string NomÉtudiant { get; set; }

  [Required(ErrorMessage = "Le nom du groupe est requis.")]
  public string NomGroupe { get; set; }

  [Required(ErrorMessage = "Le nom du module est requis.")]
  public string NomModule { get; set; }

  [Required(ErrorMessage = "La date d'absence est requise.")]
  public DateOnly DateAbsence { get; set; }
}

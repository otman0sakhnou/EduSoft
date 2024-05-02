using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class ReqSéanceDto
{
 
  public string NomProfesseur { get; set; }

  [Required(ErrorMessage = "Le nom du groupe est requis.")]
  public string NomGroupe { get; set; }

  [Required(ErrorMessage = "Le nom du module est requis.")]
  public string NomModule { get; set; }

  [Required(ErrorMessage = "La date de séance est requise.")]
  public DateOnly DateSéance { get; set; }

  [Required(ErrorMessage = "L'heure de début est requise.")]
  public string HeureDébut { get; set; }

  [Required(ErrorMessage = "L'heure de fin est requise.")]
  public string HeureFin { get; set; }
}

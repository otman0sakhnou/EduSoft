using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class ReqSéanceDto
{

  public string NomProfesseur { get; set; }

  [Required(ErrorMessage = "Le groupe ID est requis.")]
  public Guid GroupeId { get; set; }

  [Required(ErrorMessage = "Le module ID est requis.")]
  public Guid ModuleId { get; set; }

  [Required(ErrorMessage = "La date de séance est requise.")]
  public DateOnly DateSéance { get; set; }

  [Required(ErrorMessage = "L'heure de début est requise.")]
  public string HeureDébut { get; set; }

  [Required(ErrorMessage = "L'heure de fin est requise.")]
  public string HeureFin { get; set; }
  public List<Guid> ÉtudiantsAbsents { get; set; }
}

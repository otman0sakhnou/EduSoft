using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class ReqFacture
{
  [Required(ErrorMessage = "Le nom du professeur est requis.")]
  public string NomProfesseur { get; set; }

  [Required(ErrorMessage = "Le mois est requis.")]
  public string Mois { get; set; }

  [Required(ErrorMessage = "Le montant par séance est requis.")]
  [Range(0.01, double.MaxValue, ErrorMessage = "Le montant par séance doit être supérieur à zéro.")]
  public decimal MontantParSéance { get; set; }

  [Required(ErrorMessage = "Le total des séances est requis.")]
  public string TotalSéances { get; set; }

}

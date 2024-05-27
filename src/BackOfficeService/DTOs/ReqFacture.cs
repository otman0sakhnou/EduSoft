using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class ReqFacture
{
  [Required(ErrorMessage = "Le nom du professeur est requis.")]
  public string NomProfesseur { get; set; }

  [Required(ErrorMessage = "Le mois est requis.")]
  public string Mois { get; set; }
  [Required(ErrorMessage = "L'année est requis.")]
  public string Année { get; set; }

  [Required(ErrorMessage = "Le montant par heure est requis.")]
  [Range(0.01, double.MaxValue, ErrorMessage = "Le montant par séance doit être supérieur à zéro.")]
  public decimal MontantParHeure { get; set; }

  [Required(ErrorMessage = "Le total des heures est requis.")]
  public string TotalHeures { get; set; }

}
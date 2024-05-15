using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class Facture
{
  [Key]
  public Guid FactureId { get; set; }
  public string NomProfesseur { get; set; }
  public string Mois { get; set; }
  public decimal MontantParHeure { get; set; }
  public string TotalHeures { get; set; }
  public double MontantTotale { get; set; }
}

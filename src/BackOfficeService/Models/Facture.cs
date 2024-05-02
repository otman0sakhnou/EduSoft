using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class Facture
{
  [Key]
  public Guid FactureId { get; set; }
  public string NomProfesseur { get; set; }
  public string Mois { get; set; }
  public decimal MontantParSéance { get; set; }
  public string TotalSéances { get; set; }
  public double MontantTotale { get; set; }
  public FactureStatut Statut { get; set; }
}

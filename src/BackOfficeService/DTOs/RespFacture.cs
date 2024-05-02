namespace BackOfficeService;

public class RespFacture
{
  public string FactureId { get; set; }
  public string NomProfesseur { get; set; }
  public string Mois { get; set; }
  public decimal MontantParSéance { get; set; }
  public string TotalSéances { get; set; }
  public double MontantTotale { get; set; }
  public string Statut { get; set; }
}

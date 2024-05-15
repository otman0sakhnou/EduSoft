namespace BackOfficeService;

public class RespFacture
{
  public string FactureId { get; set; }
  public string NomProfesseur { get; set; }
  public string Mois { get; set; }
  public decimal MontantParHeure { get; set; }
  public string TotalHeures { get; set; }
  public double MontantTotale { get; set; }
}

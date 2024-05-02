namespace BackOfficeService;

public class SéanceDto
{
  public string IdSéance { get; set; }
  public string NomProfesseur { get; set; }
  public string NomGroupe { get; set; }
  public string NomModule { get; set; }
  public DateOnly DateSéance { get; set; }
  public string HeureDébut { get; set; }
  public string HeureFin { get; set; }
}

namespace BackOfficeService;

public class SéanceDto
{
  public string IdSéance { get; set; }
  public string NomProfesseur { get; set; }
  public Guid GroupeId { get; set; }
  public Guid ModuleId { get; set; }
  public DateOnly DateSéance { get; set; }
  public string HeureDébut { get; set; }
  public string HeureFin { get; set; }
  public List<Guid> ÉtudiantsAbsents { get; set; }
}

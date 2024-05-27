namespace BackOfficeService;

public class ModuleDto
{
  public Guid ModuleId { get; set; }
  public string NomModule { get; set; }
  public List<FilièreDto> Filières { get; set; }

}

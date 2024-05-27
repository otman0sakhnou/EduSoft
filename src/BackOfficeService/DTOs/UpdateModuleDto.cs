using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class UpdateModuleDto
{
  public string NomModule { get; set; }
  public List<Guid> FilièreIds { get; set; }
}

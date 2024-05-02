using System.ComponentModel.DataAnnotations.Schema;

namespace BackOfficeService;

[Table("Module")]
public class Module
{
  public Guid ModuleId { get; set; }
  public string NomModule { get; set; }
  public Guid IdFilière { get; set; }
  [ForeignKey("IdFilière")]
  public Filière Filière { get; set; }
}

using System.ComponentModel.DataAnnotations.Schema;
namespace BackOfficeService;
public class FilièreModule
{
  public Guid FilièreId { get; set; }
  [ForeignKey("FilièreId")]
  public Filière Filière { get; set; }

  public Guid ModuleId { get; set; }
  [ForeignKey("ModuleId")]
  public Module Module { get; set; }
}
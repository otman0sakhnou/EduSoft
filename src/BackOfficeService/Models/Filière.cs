using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;


public class Filière
{
  [Key]
  public Guid IdFilière { get; set; }
  public string NomFilière   { get; set; }
  public string Description { get; set; }
  public ICollection<FilièreModule> FilièreModules { get; set; }
}

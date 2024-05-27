using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackOfficeService
{
  [Table("Module")]
  public class Module
  {
    public Guid ModuleId { get; set; }
    public string NomModule { get; set; }
    public ICollection<FilièreModule> FilièreModules { get; set; }
    public ICollection<Séance> Séances { get; set; }
  }
}

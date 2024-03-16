using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class UpdateModuleDto
{
  [Required(ErrorMessage = "Le nom du module est requis.")]
  public string NomModule { get; set; }

  [Required(ErrorMessage = "L'ID de la filière est requis.")]
  public Guid IdFilière { get; set; }
}

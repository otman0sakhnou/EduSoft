using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class CreateFilièreDto
{
  [Required(ErrorMessage = "Le nom de la filière est requis.")]
  public string NomFilière { get; set; }

  [Required(ErrorMessage = "La description de la filière est requise.")]
  public string Description { get; set; }
}

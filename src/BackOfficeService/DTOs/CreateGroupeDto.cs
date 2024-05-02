using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class CreateGroupeDto
{
  [Required(ErrorMessage = "Le nom du groupe est requis.")]
  public string NomGroupe { get; set; }

  [Required(ErrorMessage = "L'ID de la filière est requis.")]
  public Guid IdFilière { get; set; }
}

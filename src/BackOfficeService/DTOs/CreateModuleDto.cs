using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackOfficeService
{
  public class CreateModuleDto
  {
    [Required(ErrorMessage = "Le nom du module est requis")]
    public string NomModule { get; set; }

    [Required(ErrorMessage = "Au moins une filière doit être sélectionnée")]
    public List<Guid> FilièreIds { get; set; }
  }
}

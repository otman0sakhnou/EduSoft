using System.ComponentModel.DataAnnotations;

namespace BackOfficeService;

public class CreateÉtudiantDto
{
  [Required(ErrorMessage = "Le cne de l'étudiant est requis.")]
  public string CNE { get; set; }
  [Required(ErrorMessage = "Le cin de l'étudiant est requis.")]
  public string CIN { get; set; }
  [Required(ErrorMessage = "Le nom de l'étudiant est requis.")]
  public string Nom { get; set; }

  [Required(ErrorMessage = "Le prénom de l'étudiant est requis.")]
  public string Prenom { get; set; }

  [Required(ErrorMessage = "L'adresse de l'étudiant est requise.")]
  public string Adresse { get; set; }

  [Required(ErrorMessage = "Le numéro de téléphone de l'étudiant est requis.")]
  [Phone(ErrorMessage = "Le numéro de téléphone n'est pas valide.")]
  public string Telephone { get; set; }

  [Required(ErrorMessage = "L'adresse email de l'étudiant est requise.")]
  [EmailAddress(ErrorMessage = "L'adresse email n'est pas valide.")]
  public string Email { get; set; }
  [Required(ErrorMessage = "La date de naissance de l'étudiant est requise.")]
  [Display(Name = "Date de naissance")]
  [DataType(DataType.Date)]
  public DateOnly? DateDeNaissance { get; set; }

  [Required(ErrorMessage = "Le lieu de naissance de l'étudiant est requis.")]
  [Display(Name = "Lieu de naissance")]
  public string LieuDeNaissance { get; set; }

  [Required(ErrorMessage = "L'ID du groupe est requis.")]
  public Guid IdGroupe { get; set; }
}

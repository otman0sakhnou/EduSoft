using System.ComponentModel.DataAnnotations;

namespace IdentityService;

public class RegisterViewModel
{
    [Required(ErrorMessage = "L'adresse e-mail est requise.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Le mot de passe est requis.")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Le nom d'utilisateur est requis.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Le nom complet est requis.")]
    public string FullName { get; set; }

    [Required(ErrorMessage = "Le rôle est requis.")]
    public string rôle { get; set; }
    public string ReturnUrl { get; set; }
    public string Button { get; set; }
}

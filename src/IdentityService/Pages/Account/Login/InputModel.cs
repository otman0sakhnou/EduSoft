// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using System.ComponentModel.DataAnnotations;

namespace IdentityService.Pages.Login;

public class InputModel
{
    [Required(ErrorMessage = "Le nom d'utilisateur est requis.")]
    // [EmailAddress(ErrorMessage = "veuillez entrer une adresse e-mail valide.")]
    public string UserName { get; set; }

    [Required(ErrorMessage = "Le Mot de passe est requis.")]
    [DataType(DataType.Password)]
    public string Password { get; set; }
    public bool RememberLogin { get; set; }
    public string ReturnUrl { get; set; }
    public string Button { get; set; }
}
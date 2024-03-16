using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackOfficeService;

[Table("Étudiant")]
public class Étudiant
{
    [Key]
    public Guid EtudiantId { get; set; }
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public string Adresse { get; set; }
    public string Telephone { get; set; }
    public string Email { get; set; }
    public Guid IdGroupe { get; set; }


    [ForeignKey("IdGroupe")]
    public Groupe Groupe { get; set; }
}

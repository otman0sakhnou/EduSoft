﻿namespace BackOfficeService;

public class ÉtudiantDto
{
  public Guid EtudiantId { get; set; }
  public string Nom { get; set; }
  public string Prenom { get; set; }
  public string Adresse { get; set; }
  public string Telephone { get; set; }
  public string Email { get; set; }
  public string NomGroupe { get; set; }

}

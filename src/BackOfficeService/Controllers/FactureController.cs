using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService;

[ApiController]
[Route("api/facture")]
public class FactureController : ControllerBase
{
  private readonly BackOfficeDbContext _backOfficeDbContext;
  private readonly IMapper _mapper;

  public FactureController(BackOfficeDbContext backOfficeDbContext, IMapper mapper)
  {
    _backOfficeDbContext = backOfficeDbContext;
    _mapper = mapper;
  }

  [HttpGet("{nomProfesseur}")]
  public async Task<ActionResult<IEnumerable<RespFacture>>> GetFacturesByProfesseur(string nomProfesseur)
  {
    var factures = await _backOfficeDbContext.Factures
        .Where(f => f.NomProfesseur == nomProfesseur)
        .ToListAsync();

    if (factures == null || !factures.Any())
    {
      return NotFound($"Aucune facture n'a été trouvée pour le professeur {nomProfesseur}.");
    }

    var respFactures = _mapper.Map<IEnumerable<RespFacture>>(factures);

    return Ok(respFactures);
  }
  [HttpPost]
  public async Task<ActionResult<RespFacture>> AddFacture(ReqFacture reqFacture)
  {
    try
    {
      // Calculate total amount based on total sessions and montantParSéance
      double totalAmount = double.Parse(reqFacture.TotalHeures) * (double)reqFacture.MontantParHeure;
    
      var facture = new Facture
      {
        NomProfesseur = reqFacture.NomProfesseur,
        Mois = reqFacture.Mois,
        MontantParHeure = reqFacture.MontantParHeure,
        TotalHeures = reqFacture.TotalHeures,
        MontantTotale = totalAmount,
      };

      // Add facture to database
      _backOfficeDbContext.Factures.Add(facture);
      await _backOfficeDbContext.SaveChangesAsync();

      var respFacture = _mapper.Map<RespFacture>(facture);

      return Ok(respFacture);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }
  [HttpDelete("{factureId}")]
  public async Task<ActionResult> DeleteFacture(Guid factureId)
  {
    try
    {
      var facture = await _backOfficeDbContext.Factures.FindAsync(factureId);

      if (facture == null)
      {
        return NotFound($"Facture with ID {factureId} not found.");
      }

      _backOfficeDbContext.Factures.Remove(facture);
      await _backOfficeDbContext.SaveChangesAsync();

      return Ok("Facture deleted successfully.");
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }
}

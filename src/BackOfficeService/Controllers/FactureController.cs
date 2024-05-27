using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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

  [HttpGet]
  public async Task<ActionResult<IEnumerable<RespFacture>>> GetFactures([FromQuery] string nomProfesseur = null)
  {
    IQueryable<Facture> query = _backOfficeDbContext.Factures;

    if (!string.IsNullOrEmpty(nomProfesseur))
    {
      query = query.Where(f => f.NomProfesseur == nomProfesseur);
    }

    var factures = await query.ToListAsync();

    if (factures == null || !factures.Any())
    {
      return NotFound("Aucune facture n'a été trouvée.");
    }

    var respFactures = _mapper.Map<IEnumerable<RespFacture>>(factures);

    return Ok(respFactures);
  }
  [HttpPost]
  public async Task<ActionResult<RespFacture>> AddFacture(ReqFacture reqFacture)
  {
    try
    {
      TimeSpan totalDuration;
      if (TimeSpan.TryParseExact(reqFacture.TotalHeures, "hh\\:mm", CultureInfo.InvariantCulture, out totalDuration))
      {
        double totalHours = totalDuration.TotalHours;
        decimal totalAmount = (decimal)totalHours * reqFacture.MontantParHeure;

        var facture = new Facture
        {
          NomProfesseur = reqFacture.NomProfesseur,
          Mois = reqFacture.Mois,
          Année = reqFacture.Année,
          MontantParHeure = reqFacture.MontantParHeure,
          TotalHeures = reqFacture.TotalHeures,
          MontantTotale =(double) totalAmount 
        };

        _backOfficeDbContext.Factures.Add(facture);
        await _backOfficeDbContext.SaveChangesAsync();

        var respFacture = _mapper.Map<RespFacture>(facture);

        return Ok(respFacture);
      }
      else
      {
        return BadRequest("Invalid time format for TotalHeures.");
      }
    }
    catch (Exception ex)
    {
      Console.WriteLine($"Error: {ex.Message}");
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

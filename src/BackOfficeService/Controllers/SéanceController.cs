using System.Globalization;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService;

[ApiController]
[Route("api/séance")]
public class SéanceController : ControllerBase
{
  private readonly BackOfficeDbContext _backOfficeDbContext;
  private readonly IMapper _mapper;

  public SéanceController(BackOfficeDbContext backOfficeDbContext, IMapper mapper)
  {
    _backOfficeDbContext = backOfficeDbContext;
    _mapper = mapper;
  }
  [HttpGet]
  public async Task<ActionResult<IEnumerable<SéanceDto>>> GetAllSessions()
  {
    try
    {
      var seances = await _backOfficeDbContext.Séances.ToListAsync();
      
      var séanceDtos = _mapper.Map<List<SéanceDto>>(seances);
      if (séanceDtos == null || séanceDtos.Count == 0)
      {
        return NotFound("Aucune séance n'a été trouvée.");
      }

      return Ok(séanceDtos);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }

  [HttpGet("ParProfesseur/{nomProfesseur}")]
  public async Task<ActionResult<IEnumerable<SéanceDto>>> GetSessionsByProfessor(string nomProfesseur, [FromQuery] DateOnly? date = null)
  {
    try
    {
      var query = _backOfficeDbContext.Séances.Where(s => s.NomProfesseur == nomProfesseur);

      if (date.HasValue)
      {
        query = query.Where(s => s.DateSéance == date);
        var séance = await query.FirstOrDefaultAsync();
        if (séance == null)
        {
          return NotFound($"Aucune séance n'a été trouvée pour le professeur {nomProfesseur} à la date spécifiée.");
        }

        var séanceDto = _mapper.Map<SéanceDto>(séance);
      }

      var séances = await query.ToListAsync();
      if (séances == null || !séances.Any())
      {
        return NotFound($"Aucune séance n'a été trouvée pour le professeur {nomProfesseur}.");
      }

      var séanceDtos = _mapper.Map<List<SéanceDto>>(séances);

      return Ok(séanceDtos);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<SéanceDto>> AddSeance(ReqSéanceDto seanceDto)
  {
    try
    {

      seanceDto.NomProfesseur = User.Identity.Name;
      var séance = _mapper.Map<Séance>(seanceDto);

      _backOfficeDbContext.Séances.Add(séance);
      await _backOfficeDbContext.SaveChangesAsync();

      var addedSeanceDto = _mapper.Map<SéanceDto>(séance);

      return Ok(addedSeanceDto);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }
  [HttpGet("TotalHoursByProfessor")]
  public async Task<ActionResult<int>> GetTotalHoursByProfessor([FromQuery] string nomProfesseur, [FromQuery] DateOnly date)
  {
    try
    {
      var frenchCulture = new CultureInfo("fr-FR");
      var seances = await _backOfficeDbContext.Séances
          .Where(s => s.NomProfesseur == nomProfesseur && s.DateSéance.Year == date.Year && s.DateSéance.Month == date.Month)
          .ToListAsync();

      int totalHours = 0;

      foreach (var seance in seances)
      {
        TimeSpan heureDebut = TimeSpan.ParseExact(seance.HeureDébut, "hh\\:mm", CultureInfo.InvariantCulture);
        TimeSpan heureFin = TimeSpan.ParseExact(seance.HeureFin, "hh\\:mm", CultureInfo.InvariantCulture);

        TimeSpan sessionDuration = heureFin - heureDebut;

        totalHours += sessionDuration.Hours;
      }

      var monthName = frenchCulture.DateTimeFormat.GetMonthName(date.Month);

      var séanceViewModel = new SéanceViewModel
      {
        NomProfesseur = nomProfesseur,
        Mois = monthName,
        TotalHeures = totalHours.ToString()
      };

      return Ok(new List<SéanceViewModel> { séanceViewModel });
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }



}

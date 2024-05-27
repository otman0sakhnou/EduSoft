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
      var séances = await _backOfficeDbContext.Séances
                .Include(s => s.Groupe)
                .Include(s => s.Module)
                .ToListAsync();

      var séanceDtos = _mapper.Map<List<SéanceDto>>(séances);
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
  [HttpGet("{id}")]
  public async Task<ActionResult<SéanceDto>> GetSéance(Guid id)
  {
    try
    {
      var séance = await _backOfficeDbContext.Séances
          .Include(s => s.Groupe)
          .Include(s => s.Module)
          .Include(s => s.ÉtudiantsAbsents)
          .FirstOrDefaultAsync(s => s.IdSéance == id);

      if (séance == null)
      {
        return NotFound();
      }

      var séanceDto = _mapper.Map<SéanceDto>(séance);
      return Ok(séanceDto);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }
  [HttpGet("by-etudiant/{etudiantId}")]
  public async Task<ActionResult<IEnumerable<SéanceDto>>> GetSéancesByEtudiant(Guid etudiantId)
  {
    try
    {
      var séances = await _backOfficeDbContext.Séances
          .Where(s => s.ÉtudiantsAbsents.Contains(etudiantId))
          .Include(s => s.Groupe)
          .Include(s => s.Module)
          .ToListAsync();

      var séanceDtos = _mapper.Map<List<SéanceDto>>(séances);
      if (séanceDtos == null || séanceDtos.Count == 0)
      {
        return NotFound($"Aucune séance n'a été trouvée pour l'étudiant");
      }

      return Ok(séanceDtos);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<SéanceDto>> AddSeance(ReqSéanceDto reqSéanceDto)
  {
    try
    {
      reqSéanceDto.NomProfesseur = User.Identity.Name;

      var séance = _mapper.Map<Séance>(reqSéanceDto);

      séance.ÉtudiantsAbsents = await _backOfficeDbContext.Étudiants
          .Where(e => reqSéanceDto.ÉtudiantsAbsents.Contains(e.EtudiantId))
          .Select(e => e.EtudiantId)
          .ToListAsync();

      _backOfficeDbContext.Séances.Add(séance);
      await _backOfficeDbContext.SaveChangesAsync();

      var addedSeanceDto = _mapper.Map<SéanceDto>(séance);

      return CreatedAtAction(nameof(GetSéance), new { id = séance.IdSéance }, addedSeanceDto);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }

  [HttpGet("TotalHoursByProfessor")]
  public async Task<ActionResult<string>> GetTotalHoursByProfessor([FromQuery] string nomProfesseur, [FromQuery] DateOnly date)
  {
    try
    {
      var frenchCulture = new CultureInfo("fr-FR");
      var seances = await _backOfficeDbContext.Séances
          .Where(s => s.NomProfesseur == nomProfesseur && s.DateSéance.Year == date.Year && s.DateSéance.Month == date.Month)
          .ToListAsync();

      TimeSpan totalDuration = TimeSpan.Zero;
      foreach (var seance in seances)
      {
        TimeSpan heureDebut;
        TimeSpan heureFin;

        if (!TimeSpan.TryParseExact(seance.HeureDébut, "hh\\:mm", CultureInfo.InvariantCulture, out heureDebut) ||
            !TimeSpan.TryParseExact(seance.HeureFin, "hh\\:mm", CultureInfo.InvariantCulture, out heureFin))
        {
          return BadRequest("Invalid time format.");
        }

        TimeSpan sessionDuration = heureFin - heureDebut;
        totalDuration += sessionDuration;
      }

      string formattedTotalHours = $"{(int)totalDuration.TotalHours:D2}:{totalDuration.Minutes:D2}";
      var monthName = frenchCulture.DateTimeFormat.GetMonthName(date.Month);

      var séanceViewModel = new SéanceViewModel
      {
        NomProfesseur = nomProfesseur,
        Année = date.Year.ToString(),
        Mois = monthName,
        TotalHeures = formattedTotalHours,
      };

      return Ok(new List<SéanceViewModel> { séanceViewModel });
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }
  [HttpGet("absenceCounts/{studentId}")]
  public async Task<ActionResult<Dictionary<string, Dictionary<string, int>>>> GetAbsenceCounts(Guid studentId)
  {
    try
    {
      var currentDate = DateTime.UtcNow;

      var startOfWeek = currentDate.StartOfWeek(DayOfWeek.Monday);
      var startOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
      var startOfYear = new DateTime(currentDate.Year, 1, 1);

      var absences = await _backOfficeDbContext.Séances
          .Include(s => s.Module)
          .Where(s => s.ÉtudiantsAbsents.Contains(studentId))
          .ToListAsync();
      if (absences == null)
      {
        return NotFound("No absences found for the student.");
      }

      var absencesThisWeek = absences
          .Where(s => s.DateSéance.ToDateTime(TimeOnly.MinValue) >= startOfWeek)
          .GroupBy(s => s.Module)
           .ToDictionary(g => g.Key != null ? g.Key.NomModule : "Unknown", g => g.Count());

      var absencesThisMonth = absences
          .Where(s => s.DateSéance.ToDateTime(TimeOnly.MinValue) >= startOfMonth)
          .GroupBy(s => s.Module)
           .ToDictionary(g => g.Key != null ? g.Key.NomModule : "Unknown", g => g.Count());

      var absencesThisYear = absences
          .Where(s => s.DateSéance.ToDateTime(TimeOnly.MinValue) >= startOfYear)
          .GroupBy(s => s.Module)
          .ToDictionary(g => g.Key != null ? g.Key.NomModule : "Unknown", g => g.Count());

      var absenceCounts = new Dictionary<string, Dictionary<string, int>>
        {
            { "ThisWeek", absencesThisWeek },
            { "ThisMonth", absencesThisMonth },
            { "ThisYear", absencesThisYear }
        };

      return Ok(absenceCounts);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }


  [HttpGet("top-modules")]
  public async Task<ActionResult<IEnumerable<object>>> GetTopModulesWithMostAbsences([FromQuery] Guid groupId)
  {
    try
    {
      var séances = await _backOfficeDbContext.Séances
          .Where(s => s.GroupeId == groupId)
          .Include(s => s.Module)
          .ToListAsync();

      var moduleAbsences = séances
          .GroupBy(s => s.ModuleId)
          .Select(group => new
          {
            ModuleId = group.Key,
            ModuleName = group.First().Module.NomModule,
            AbsenceCount = group.Sum(s => s.ÉtudiantsAbsents.Count)
          })
          .OrderByDescending(ma => ma.AbsenceCount)
          .Take(5)
          .ToList();

      return Ok(moduleAbsences);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }
  [HttpGet("monthly-absences")]
  public async Task<ActionResult<IEnumerable<object>>> GetMonthlyAbsencesCount([FromQuery] Guid groupId)
  {
    try
    {
      var currentDate = DateTime.UtcNow;
      var year = currentDate.Year;
      var month = currentDate.Month;

      var séances = await _backOfficeDbContext.Séances
          .Where(s => s.GroupeId == groupId && s.DateSéance.Year == year && s.DateSéance.Month == month)
          .ToListAsync();

      var monthlyData = new List<object>();

      for (int day = 1; day <= DateTime.DaysInMonth(year, month); day++)
      {
        var absenceCount = séances
            .Where(s => s.DateSéance.Day == day)
            .Sum(s => s.ÉtudiantsAbsents.Count);

        monthlyData.Add(new
        {
          Day = day,
          AbsenceCount = absenceCount
        });
      }

      return Ok(monthlyData);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }
  [HttpGet("lastAbsence/{studentId}")]
  public async Task<ActionResult<DateTime?>> GetLastAbsenceDate(Guid studentId)
  {
    try
    {
      var lastAbsenceDate = await _backOfficeDbContext.Séances
          .Where(s => s.ÉtudiantsAbsents.Contains(studentId))
          .OrderByDescending(s => s.DateSéance)
          .Select(s => s.DateSéance)
          .FirstOrDefaultAsync();

      if (lastAbsenceDate != default(DateOnly))
      {
        return Ok(lastAbsenceDate);
      }
      else
      {
        return Ok(new { message = "aucune absence" });
      }
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }
  [HttpGet("by-professor-and-date")]
  public async Task<ActionResult<IEnumerable<SéanceDto>>> GetSeancesByProfessorAndDate([FromQuery] string nomProfesseur, [FromQuery] string year, [FromQuery] string month)
  {
    try
    {
      int parsedMonth = GetMonthNumber(month);
      if (!int.TryParse(year, out int parsedYear) || parsedMonth == 0)
      {
        Console.WriteLine($"Year: {year}, Month: {month}");
        return BadRequest("Year and month must be valid integers.");
      }

      var seances = await _backOfficeDbContext.Séances
          .Where(s => s.NomProfesseur == nomProfesseur && s.DateSéance.Year == parsedYear && s.DateSéance.Month == parsedMonth)
          .Include(s => s.Groupe)
          .Include(s => s.Module)
          .ToListAsync();

      if (seances == null || seances.Count == 0)
      {
        return NotFound("Aucune séance trouvée pour ce professeur à cette date.");
      }

      var seanceDtos = _mapper.Map<List<SéanceDto>>(seances);
      return Ok(seanceDtos);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex.Message);
    }
  }

  private int GetMonthNumber(string monthName)
  {
    Dictionary<string, int> months = new Dictionary<string, int>
            {
                {"janvier", 1}, {"février", 2}, {"mars", 3}, {"avril", 4}, {"mai", 5}, {"juin", 6},
                {"juillet", 7}, {"août", 8}, {"septembre", 9}, {"octobre", 10}, {"novembre", 11}, {"décembre", 12}
            };
    return months.TryGetValue(monthName.ToLower(), out int monthNumber) ? monthNumber : 0;
  }



}
public static class DateTimeExtensions
{
  public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
  {
    int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
    return dt.AddDays(-1 * diff).Date;
  }
}



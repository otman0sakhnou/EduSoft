using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService;




[ApiController]
[Route("api/absence")]
public class AbsenceController : ControllerBase
{
  private readonly BackOfficeDbContext _backOfficeDbContext;
  private readonly IMapper _mapper;

  public AbsenceController(BackOfficeDbContext backOfficeDbContext, IMapper mapper)
  {
    _backOfficeDbContext = backOfficeDbContext;
    _mapper = mapper;
  }
  [HttpGet]
  public async Task<ActionResult<IEnumerable<AbsenceDto>>> GetAllAbsences()
  {
    try
    {
      var absences = await _backOfficeDbContext.Absences.ToListAsync();
      var absenceDtos = _mapper.Map<List<AbsenceDto>>(absences);

      if (absenceDtos == null || absenceDtos.Count == 0)
      {
        return NotFound("Aucune absence n'a été trouvée.");
      }

      return Ok(absenceDtos);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }
  //afficher les absences d'un étudiant par groupe avec et par date 
  [HttpGet("groupe/{groupName}")]
  public async Task<ActionResult<IEnumerable<AbsenceDto>>> GetAbsenceHistoryByGroupName(string groupName, [FromQuery] DateOnly? date = null)
  {
    try
    {
      var query = _backOfficeDbContext.Absences
         .Where(a => a.NomGroupe == groupName);
      if (date.HasValue)
      {
        query = query.Where(a => a.DateAbsence == date);
      }

      var absenceHistoryDto = _mapper.Map<List<AbsenceDto>>(query);
      var absenceHistory = await query.ToListAsync();
      if (absenceHistoryDto == null || absenceHistoryDto.Count == 0)
      {
        return NotFound($"Aucune absence n'a été trouvée pour le groupe {groupName} à la date spécifiée.");
      }

      return Ok(absenceHistoryDto);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }

  //afficher les absences d'un étudiant donné avec une date spécifiée
  [HttpGet("Étudiant/{studentName}")]
  public async Task<ActionResult<IEnumerable<AbsenceDto>>> GetAbsenceHistoryByStudentName(string studentName, [FromQuery] DateOnly? date = null)
  {
    try
    {
      var query = _backOfficeDbContext.Absences
         .Where(a => a.NomÉtudiant == studentName);
      if (date.HasValue)
      {
        query = query.Where(a => a.DateAbsence == date);
      }

      var absenceHistoryDto = _mapper.Map<List<AbsenceDto>>(query);
      var absenceHistory = await query.ToListAsync();
      if (absenceHistoryDto == null || absenceHistoryDto.Count == 0)
      {
        return NotFound($"Aucune absence n'a été trouvée pour l'étudiant {studentName} à la date spécifiée.");
      }

      return Ok(absenceHistoryDto);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }


  //signaler une Absence
  [Authorize]
  [HttpPost]
  public async Task<ActionResult<AbsenceDto>> ReportAbsence(SignaleAbsenceDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    string nom = User.Identity.Name;

    request.NomProfesseur = nom;
    var absenceHistory = _mapper.Map<Absence>(request);

    _backOfficeDbContext.Absences.Add(absenceHistory);
    await _backOfficeDbContext.SaveChangesAsync();

    var absenceHistoryDto = _mapper.Map<AbsenceDto>(absenceHistory);

    return CreatedAtAction(nameof(GetAbsenceById), new { id = absenceHistoryDto.IdAbsence }, absenceHistoryDto);
  }






  [HttpGet("{id}", Name = nameof(GetAbsenceById))]
  public async Task<ActionResult<AbsenceDto>> GetAbsenceById(int id)
  {
    var absence = await _backOfficeDbContext.Absences.FindAsync(id);

    if (absence == null)
    {
      return NotFound();
    }

    var absenceDto = _mapper.Map<AbsenceDto>(absence);
    return Ok(absenceDto);
  }
  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteAbsenceById(Guid id)
  {
    try
    {
      var absence = await _backOfficeDbContext.Absences.FindAsync(id);
      if (absence == null)
      {
        return NotFound($"Absence with ID {id} not found.");
      }

      _backOfficeDbContext.Absences.Remove(absence);
      await _backOfficeDbContext.SaveChangesAsync();

      return NoContent();
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }

}

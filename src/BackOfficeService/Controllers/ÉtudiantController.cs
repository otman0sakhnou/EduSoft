using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService.Controllers;

[ApiController]
[Route("api/étudiant")]
public class ÉtudiantController : ControllerBase
{
  private readonly BackOfficeDbContext _context;
  private readonly IMapper _mapper;

  public ÉtudiantController(BackOfficeDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<ÉtudiantDto>>> GetÉtudiants()
  {
    var étudiants = await _context.Étudiants
        .Include(e => e.Groupe)
        .ToListAsync();


    var étudiantDtos = étudiants.Select(g =>
    {
      var étudiant = _mapper.Map<ÉtudiantDto>(g);
      étudiant.NomGroupe = g.Groupe?.NomGroupe;
      return étudiant;
    });



    return Ok(étudiantDtos);
  }

  [HttpGet("byGroupName/{groupName}")]
  public async Task<ActionResult<IEnumerable<ÉtudiantDto>>> GetÉtudiantsByGroup(string groupName)
  {
    try
    {
      var students = await _context.Étudiants
          .Include(e => e.Groupe)
          .Where(e => e.Groupe.NomGroupe == groupName)
          .ToListAsync();

      var studentDtos = _mapper.Map<List<ÉtudiantDto>>(students);

      return Ok(studentDtos);
    }
    catch (Exception ex)
    {
      return StatusCode(500, ex);
    }
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<ÉtudiantDto>> GetÉtudiant(Guid id)
  {
    var étudiant = await _context.Étudiants.FindAsync(id);

    if (étudiant == null)
    {
      return NotFound();
    }

    var étudiantDto = _mapper.Map<ÉtudiantDto>(étudiant);
    return Ok(étudiantDto);
  }
  // POST: api/Étudiant
  [HttpPost]
  public async Task<ActionResult<ÉtudiantDto>> CreateÉtudiant(CreateÉtudiantDto createÉtudiantDto)
  {
    var groupe = await _context.Groupes.FindAsync(createÉtudiantDto.IdGroupe);
    if (groupe == null)
    {
      return BadRequest("Le groupe spécifié n'existe pas.");
    }
    var étudiant = _mapper.Map<Étudiant>(createÉtudiantDto);
    étudiant.IdGroupe = groupe.GroupeID;

    _context.Étudiants.Add(étudiant);
    await _context.SaveChangesAsync();

    var étudiantDto = _mapper.Map<ÉtudiantDto>(étudiant);
    return CreatedAtAction(nameof(GetÉtudiant), new { id = étudiantDto.EtudiantId }, étudiantDto);
  }

  // PUT: api/Étudiant/5
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateÉtudiant(Guid id, UpdateÉtudiantDto updateÉtudiantDto)
  {
    var étudiant = await _context.Étudiants.FindAsync(id);
    if (étudiant == null)
    {
      return NotFound();
    }

    _mapper.Map(updateÉtudiantDto, étudiant);
    var groupe = await _context.Groupes.FindAsync(updateÉtudiantDto.IdGroupe);
    if (groupe == null)
    {
      return BadRequest("groupe not found.");
    }


    étudiant.IdGroupe = groupe.GroupeID;

    _context.Entry(étudiant).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!ÉtudiantExists(id))
      {
        return NotFound();
      }
      else
      {
        throw;
      }
    }
    var nomComplet = étudiant.Nom + " " + étudiant.Prenom;
    return Ok(nomComplet + " updated");
  }
  // DELETE: api/Étudiant/5
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteÉtudiant(Guid id)
  {
    var étudiant = await _context.Étudiants.FindAsync(id);
    if (étudiant == null)
    {
      return NotFound();
    }

    _context.Étudiants.Remove(étudiant);
    await _context.SaveChangesAsync();

    var nomComplet = étudiant.Nom + " " + étudiant.Prenom;
    return Ok(nomComplet + " Deleted");
  }

  private bool ÉtudiantExists(Guid id)
  {
    return _context.Étudiants.Any(e => e.EtudiantId == id);
  }
}

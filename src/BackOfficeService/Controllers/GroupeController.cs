using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService;


[ApiController]
[Route("api/groupe")]


public class GroupeController : ControllerBase
{
  private readonly BackOfficeDbContext _context;
  private readonly IMapper _mapper;

  public GroupeController(BackOfficeDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<GroupeDto>>> GetGroupes()
  {
    var groupes = await _context.Groupes
        .Include(g => g.Filière)
        .ToListAsync();


    var groupeDtos = groupes.Select(g =>
    {
      var groupeDto = _mapper.Map<GroupeDto>(g);
      groupeDto.NomFilière = g.Filière?.NomFilière;
      groupeDto.Description = g.Filière?.Description;
      return groupeDto;
    }).ToList();

    return Ok(groupeDtos);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<GroupeDto>> GetGroupe(Guid id)
  {
    var groupe = await _context.Groupes
        .Include(g => g.Filière)
        .FirstOrDefaultAsync(g => g.GroupeID == id);

    if (groupe == null)
    {
      return NotFound();
    }

    var groupeDto = _mapper.Map<GroupeDto>(groupe);
    return Ok(groupeDto);
  }

  [HttpPost]
  public async Task<ActionResult<GroupeDto>> CreateGroupe(CreateGroupeDto createGroupeDto)
  {
    var filière = await _context.Filières.FindAsync(createGroupeDto.IdFilière);

    if (filière == null)
    {
      return BadRequest("La filière spécifiée n'existe pas.");
    }

    var groupe = _mapper.Map<Groupe>(createGroupeDto);
    groupe.Filière = filière;

    _context.Groupes.Add(groupe);
    await _context.SaveChangesAsync();

    var groupeDto = _mapper.Map<GroupeDto>(groupe);
    return CreatedAtAction(nameof(GetGroupe), new { id = groupe.GroupeID }, groupeDto);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateGroupe(Guid id, UpdateGroupeDto updateGroupeDto)
  {
    var groupe = await _context.Groupes.FindAsync(id);
    if (groupe == null)
    {
      return NotFound();
    }


    _mapper.Map(updateGroupeDto, groupe);

   
    var filiere = await _context.Filières.FindAsync(updateGroupeDto.IdFilière);
    if (filiere == null)
    {
      return NotFound("Filière not found");
    }

    groupe.IdFilière = filiere.IdFilière;
    groupe.Filière = filiere; 

    await _context.SaveChangesAsync();

    return Ok(groupe); // Return the updated groupe object
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteGroupe(Guid id)
  {
    var groupe = await _context.Groupes.FindAsync(id);
    if (groupe == null)
    {
      return NotFound();
    }

    _context.Groupes.Remove(groupe);
    await _context.SaveChangesAsync();

    return Ok(groupe.NomGroupe +" deleted");
  }
}

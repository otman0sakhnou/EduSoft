using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService;


[ApiController]
[Route("api/filière")]
public class FilièreController : ControllerBase
{
  private readonly BackOfficeDbContext _context;
  private readonly IMapper _mapper;
  public FilièreController(BackOfficeDbContext backOfficeDb, IMapper mapper)
  {
    _context = backOfficeDb;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<FilièreDto>>> GetFilières()
  {
    var filières = await _context.Filières.ToListAsync();
    var filièresDto = _mapper.Map<List<FilièreDto>>(filières);
    return Ok(filièresDto);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<FilièreDto>> GetFilière(Guid id)
  {
    var filière = await _context.Filières.FindAsync(id);

    if (filière == null)
    {
      return NotFound();
    }

    var filièreDto = _mapper.Map<FilièreDto>(filière);
    return Ok(filièreDto);
  }

  [HttpPost]
  public async Task<ActionResult<FilièreDto>> CreateFilière(CreateFilièreDto createFilièreDto)
  {
    var filière = _mapper.Map<Filière>(createFilièreDto);

    _context.Filières.Add(filière);
    await _context.SaveChangesAsync();

    var filièreDto = _mapper.Map<FilièreDto>(filière);
    return CreatedAtAction(nameof(GetFilière), new { id = filière.IdFilière }, filièreDto);
  }
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateFilière(Guid id, UpdateFilièreDto updateFilièreDto)
  {
    var filière = await _context.Filières.FindAsync(id);
    if (filière == null)
    {
      return NotFound();
    }

    _mapper.Map(updateFilièreDto, filière);

    await _context.SaveChangesAsync();

    return Ok(filière);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteFilière(Guid id)
  {
    var filière = await _context.Filières.FindAsync(id);
    if (filière == null)
    {
      return NotFound();
    }

    _context.Filières.Remove(filière);
    await _context.SaveChangesAsync();

    return NoContent();
  }

}

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackOfficeService.Controllers;


[ApiController]
[Route("api/module")]
public class ModuleController : ControllerBase
{
  private readonly BackOfficeDbContext _context;
  private readonly IMapper _mapper;

  public ModuleController(BackOfficeDbContext context, IMapper mapper)
  {
    _context = context;
    _mapper = mapper;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<ModuleDto>>> GetModules()
  {
    var modules = await _context.Modules
        .Include(m => m.Filière)
        .ToListAsync();

    var moduleDtos = modules.Select(module =>
    {
      var moduleDto = _mapper.Map<ModuleDto>(module);
      moduleDto.NomFilière = module.Filière?.NomFilière;
      moduleDto.Description = module.Filière?.Description;
      return moduleDto;
    }).ToList();

    return Ok(moduleDtos);
  }

  [HttpGet("byModuleName/{name}")]
  public async Task<ActionResult<IEnumerable<ModuleDto>>> GetModulesByName(string name)
  {
    if (string.IsNullOrEmpty(name))
    {
      return BadRequest("Module name cannot be empty");
    }

    var modules = await _context.Modules
        .Include(m => m.Filière)
        .Where(m => m.NomModule.ToLower().Contains(name.ToLower()))
        .ToListAsync();

    var moduleDtos = modules.Select(module =>
    {
      var moduleDto = _mapper.Map<ModuleDto>(module);
      moduleDto.NomFilière = module.Filière?.NomFilière;
      moduleDto.Description = module.Filière?.Description;
      return moduleDto;
    }).ToList();

    return Ok(moduleDtos);
  }
  [HttpPost]
  public async Task<ActionResult<ModuleDto>> PostModule(CreateModuleDto createModuleDto)
  {
    var filiere = await _context.Filières.FindAsync(createModuleDto.IdFilière);

    if (filiere == null)
    {
      return BadRequest("La filière spécifiée n'existe pas.");
    }

    var module = _mapper.Map<Module>(createModuleDto);
    module.Filière = filiere;

    _context.Modules.Add(module);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetModules), new { id = module.ModuleId }, _mapper.Map<ModuleDto>(module));
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateModule(Guid id, UpdateModuleDto updateModuleDto)
  {
    var module = await _context.Modules.FindAsync(id);
    if (module == null)
    {
      return NotFound();
    }


    _mapper.Map(updateModuleDto, module);


    var filiere = await _context.Filières.FindAsync(updateModuleDto.IdFilière);
    if (filiere == null)
    {
      return NotFound("Filière not found");
    }

    module.IdFilière = filiere.IdFilière;
    module.Filière = filiere;
    await _context.SaveChangesAsync();

    return Ok(module);
  }








  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteModule(Guid id)
  {
    var module = await _context.Modules.FindAsync(id);
    if (module == null)
    {
      return NotFound();
    }

    _context.Modules.Remove(module);
    await _context.SaveChangesAsync();

    return Ok(module.NomModule + " deleted");
  }


  private (string NomFilière, string Description)? GetFilièreInfo(Guid filiereId)
  {
    var filiere = _context.Filières.Find(filiereId);
    if (filiere != null)
    {
      return (filiere.NomFilière, filiere.Description);
    }
    return null;
  }

}



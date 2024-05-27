using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace BackOfficeService.Controllers
{
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
          .Include(m => m.FilièreModules)
          .ThenInclude(fm => fm.Filière)
          .ToListAsync();

      var moduleDtos = _mapper.Map<List<ModuleDto>>(modules);

      return Ok(moduleDtos);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<ModuleDto>> GetModule(Guid id)
    {
      var module = await _context.Modules
          .Include(m => m.FilièreModules)
          .ThenInclude(fm => fm.Filière)
          .FirstOrDefaultAsync(m => m.ModuleId == id);

      if (module == null)
      {
        return NotFound();
      }

      var moduleDto = _mapper.Map<ModuleDto>(module);
      return Ok(moduleDto);
    }

    [HttpGet("byModuleName/{name}")]
    public async Task<ActionResult<IEnumerable<ModuleDto>>> GetModulesByName(string name)
    {
      if (string.IsNullOrEmpty(name))
      {
        return BadRequest("Module name cannot be empty");
      }

      var modules = await _context.Modules
          .Include(m => m.FilièreModules)
          .ThenInclude(fm => fm.Filière)
          .Where(m => m.NomModule.ToLower().Contains(name.ToLower()))
          .ToListAsync();

      var moduleDtos = modules.Select(module =>
      {
        var moduleDto = _mapper.Map<ModuleDto>(module);
        moduleDto.Filières = module.FilièreModules.Select(fm => _mapper.Map<FilièreDto>(fm.Filière)).ToList();
        return moduleDto;
      }).ToList();

      return Ok(moduleDtos);
    }

    [HttpPost]
    public async Task<ActionResult<ModuleDto>> PostModule(CreateModuleDto createModuleDto)
    {
      var allModules = await _context.Modules
          .Include(m => m.FilièreModules)
          .ToListAsync();

      var existingModule = allModules.FirstOrDefault(m => m.NomModule.Equals(createModuleDto.NomModule, StringComparison.OrdinalIgnoreCase));

      if (existingModule != null)
      {
        foreach (var filiereId in createModuleDto.FilièreIds)
        {
          var filiere = await _context.Filières.FindAsync(filiereId);
          if (filiere == null)
          {
            return BadRequest($"Filière with ID {filiereId} does not exist.");
          }
          if (!existingModule.FilièreModules.Any(fm => fm.FilièreId == filiereId))
          {
            var filiereModule = new FilièreModule
            {
              FilièreId = filiereId,
              ModuleId = existingModule.ModuleId,
              Filière = filiere,
              Module = existingModule
            };

            _context.FilièreModules.Add(filiereModule);
          }
        }

        await _context.SaveChangesAsync();

        var moduleDto = _mapper.Map<ModuleDto>(existingModule);
        return CreatedAtAction(nameof(GetModules), new { id = existingModule.ModuleId }, moduleDto);
      }
      else
      {
        var module = _mapper.Map<Module>(createModuleDto);

        foreach (var filiereId in createModuleDto.FilièreIds)
        {
          var filiere = await _context.Filières.FindAsync(filiereId);
          if (filiere == null)
          {
            return BadRequest($"Filière with ID {filiereId} does not exist.");
          }

          var filiereModule = new FilièreModule
          {
            FilièreId = filiereId,
            Module = module
          };

          _context.FilièreModules.Add(filiereModule);
        }

        _context.Modules.Add(module);
        await _context.SaveChangesAsync();

        var moduleDto = _mapper.Map<ModuleDto>(module);
        return CreatedAtAction(nameof(GetModules), new { id = module.ModuleId }, moduleDto);
      }
    }



    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateModule(Guid id, UpdateModuleDto updateModuleDto)
    {
      var module = await _context.Modules
          .Include(m => m.FilièreModules)
          .FirstOrDefaultAsync(m => m.ModuleId == id);

      if (module == null)
      {
        return NotFound();
      }

      _mapper.Map(updateModuleDto, module);

      _context.FilièreModules.RemoveRange(module.FilièreModules);

      foreach (var filiereId in updateModuleDto.FilièreIds)
      {
        var filiere = await _context.Filières.FindAsync(filiereId);
        if (filiere == null)
        {
          return BadRequest($"Filière with ID {filiereId} does not exist.");
        }

        module.FilièreModules.Add(new FilièreModule
        {
          FilièreId = filiereId,
          ModuleId = id
        });
      }

      await _context.SaveChangesAsync();

      return Ok(module);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModule(Guid id)
    {
      var module = await _context.Modules
          .Include(m => m.FilièreModules)
          .FirstOrDefaultAsync(m => m.ModuleId == id);

      if (module == null)
      {
        return NotFound();
      }

      _context.Modules.Remove(module);
      await _context.SaveChangesAsync();

      return Ok($"{module.NomModule} deleted");
    }
    [HttpDelete("{moduleId}/filiere/{filiereId}")]
    public async Task<IActionResult> DeleteFiliereFromModule(Guid moduleId, Guid filiereId)
    {
      var module = await _context.Modules
          .Include(m => m.FilièreModules)
          .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

      if (module == null)
      {
        return NotFound("Module not found.");
      }

      var filiereModule = module.FilièreModules.FirstOrDefault(fm => fm.FilièreId == filiereId);
      if (filiereModule == null)
      {
        return NotFound("Filière association not found.");
      }

      module.FilièreModules.Remove(filiereModule);
      await _context.SaveChangesAsync();

      return Ok("Association deleted successfully.");
    }
  }
}

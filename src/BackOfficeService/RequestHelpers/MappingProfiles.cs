using AutoMapper;

namespace BackOfficeService.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Mapping for Filière and its DTOs
            CreateMap<Filière, FilièreDto>().ReverseMap();
            CreateMap<CreateFilièreDto, Filière>();
            CreateMap<UpdateFilièreDto, Filière>();

            // Mapping for Groupe and its DTOs
            CreateMap<Groupe, GroupeDto>()
                .ForMember(dest => dest.NomFilière, opt => opt.MapFrom(src => src.Filière.NomFilière))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Filière.Description));
            CreateMap<CreateGroupeDto, Groupe>();
            CreateMap<UpdateGroupeDto, Groupe>();

            // Mapping for Module and its DTOs
             CreateMap<Module, ModuleDto>()
                .ForMember(dest => dest.Filières, opt => opt.MapFrom(src => src.FilièreModules.Select(fm => fm.Filière).ToList()));
            CreateMap<CreateModuleDto, Module>()
                .ForMember(dest => dest.FilièreModules, opt => opt.Ignore());
            CreateMap<UpdateModuleDto, Module>()
                .ForMember(dest => dest.FilièreModules, opt => opt.Ignore());

            // Mapping for Étudiant and its DTOs
            CreateMap<Étudiant, ÉtudiantDto>()
                .ForMember(dest => dest.NomGroupe, opt => opt.MapFrom(src => src.Groupe.NomGroupe));
            CreateMap<CreateÉtudiantDto, Étudiant>();
            CreateMap<UpdateÉtudiantDto, Étudiant>();

            // Mapping for Séance and its DTOs
            CreateMap<SéanceDto, Séance>();
            CreateMap<ReqSéanceDto, Séance>();
            CreateMap<Séance, SéanceDto>();
            

            // Mapping for Facture and its DTOs
            CreateMap<Facture, RespFacture>();
            CreateMap<ReqFacture, Facture>();
        }
    }
}

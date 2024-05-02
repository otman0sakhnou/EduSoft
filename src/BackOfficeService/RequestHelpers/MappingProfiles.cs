using AutoMapper;


namespace BackOfficeService.RequestHelpers
{
    public class MappingProfiles : Profile
    {

        public MappingProfiles()
        {
            CreateMap<Filière, FilièreDto>().ReverseMap();
            CreateMap<Groupe, GroupeDto>()
    .ForMember(dest => dest.NomFilière, opt => opt.MapFrom(src => src.Filière.NomFilière))
    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Filière.Description));
            CreateMap<Module, ModuleDto>()
                .ForMember(dest => dest.NomFilière, opt => opt.MapFrom(src => src.Filière.NomFilière))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Filière.Description));
            CreateMap<Étudiant, ÉtudiantDto>()
                .ForMember(dest => dest.NomGroupe, opt => opt.MapFrom(src => src.Groupe.NomGroupe));

            CreateMap<CreateModuleDto, Module>();
            CreateMap<CreateFilièreDto, Filière>();
            CreateMap<CreateÉtudiantDto, Étudiant>();
            CreateMap<CreateGroupeDto, Groupe>();
            CreateMap<SéanceDto, Séance>();
            CreateMap<SignaleAbsenceDto,Absence>();
            CreateMap<Absence, AbsenceDto>();
            CreateMap<ReqSéanceDto,Séance>();
            CreateMap<Séance,SéanceDto>();
            CreateMap<Facture,RespFacture>();
            CreateMap<ReqFacture,Facture>();

            CreateMap<UpdateFilièreDto, Filière>();
            CreateMap<UpdateGroupeDto, Groupe>();
            CreateMap<UpdateModuleDto, Module>();
            CreateMap<UpdateÉtudiantDto, Étudiant>();
        }
    }
}

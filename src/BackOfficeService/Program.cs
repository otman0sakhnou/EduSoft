using BackOfficeService;
using BackOfficeService.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<BackOfficeDbContext>(opt =>
{
  opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options=>
{ 
  options.Authority = builder.Configuration["IdentityServiceUrl"];
  options.RequireHttpsMetadata = false;
  options.TokenValidationParameters.ValidateAudience = false;
  options.TokenValidationParameters.NameClaimType ="name";
});


var app = builder.Build();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

try
{
  DbInitializer.InitDb(app);
}
catch (Exception e)
{
  Console.WriteLine(e);
}
app.Run();

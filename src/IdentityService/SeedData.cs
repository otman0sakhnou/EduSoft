using System;
using System.Linq;
using System.Security.Claims;
using IdentityModel;
using IdentityService.Data;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace IdentityService
{
    public class SeedData
    {
        public static void EnsureSeedData(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                // Apply any pending migrations
                context.Database.Migrate();

                // Seed roles if they don't exist
                string[] roleNames = { "Admin", "Enseignant", "Comptable", "Responsable d'Absence" };
                foreach (var roleName in roleNames)
                {
                    if (!roleManager.RoleExistsAsync(roleName).Result)
                    {
                        roleManager.CreateAsync(new IdentityRole(roleName)).Wait();
                    }
                   }

                 if (!userManager.Users.Any())
                {
                    SeedUsers(userManager);
                }
            }
        }

        private static void SeedUsers(UserManager<ApplicationUser> userManager)
        {
            Log.Debug($"{"userName"} already exists");
            SeedUser(userManager, "Mohammed", "MohammedKhalid@email.com","Mohammed Khalid", "Pass123$", new Claim[]
            {
                new Claim(JwtClaimTypes.Name, "Mohammed Khalid"),
            }, "Admin");

            SeedUser(userManager, "Ahmed", "Ahmed@email.com","Ahmed Hamza", "Pass123$", new Claim[]
            {
                new Claim(JwtClaimTypes.Name, "Ahmed Hamza"),
            }, "Enseignant");
            SeedUser(userManager, "Fatima", "FatimaMohamed@email.com","Fatima Mohamed", "Pass123$", new Claim[]
            {
                new Claim(JwtClaimTypes.Name, "Fatima Mohamed"),
            }, "Comptable");

            SeedUser(userManager, "Karim", "KarimHassan@email.com","Karim Hassan", "Pass123$", new Claim[]
            {
                new Claim(JwtClaimTypes.Name, "Karim Hassan"),
            }, "Responsable d'Absence");
        }

        private static void SeedUser(UserManager<ApplicationUser> userManager, string userName, string email,string fullname, string password, Claim[] claims, string roleName)
        {
            Log.Debug($"{userName} already exists");
            var user = userManager.FindByNameAsync(userName).Result;
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = userName,
                    Email = email,
                    EmailConfirmed = true,
                    roleName = roleName,
                    FullName =fullname 
                };

                var result = userManager.CreateAsync(user, password).Result;
                if (result.Succeeded)
                {
                    userManager.AddClaimsAsync(user, claims).Wait();
                    userManager.AddToRoleAsync(user, roleName).Wait();
                    Log.Debug($"{userName} created and assigned the role {roleName}");
                }
                else
                {
                    throw new Exception(result.Errors.First().Description);
                }
            }
            else
            {
                Log.Debug($"{userName} already exists");
            }
        }
    }
}

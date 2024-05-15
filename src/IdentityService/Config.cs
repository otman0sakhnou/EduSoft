using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
  public static IEnumerable<IdentityResource> IdentityResources =>
      new IdentityResource[]
      {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
      };

  public static IEnumerable<ApiScope> ApiScopes =>
      new ApiScope[]
      {
            new ApiScope("edusoftapp","EduSoft app full access")
      };

  public static IEnumerable<Client> Clients =>
      new Client[]
      {
            new Client
          {
            ClientId = "postman",
            ClientName ="Postman",
            AllowedScopes ={"openid","profile","edusoftapp"},
            RedirectUris = {"http://www.getpostman.com/oauth2/callback"},
            ClientSecrets = new []{new Secret("NotASecret".Sha256())},
            AllowedGrantTypes ={GrantType.ResourceOwnerPassword}
          },
            new Client
          {
            ClientId = "reactApp",
            ClientName ="reactApp",
            ClientSecrets = new []{new Secret("secret".Sha256())},
            AllowedGrantTypes =GrantTypes.CodeAndClientCredentials,
            RequirePkce =true,
            RedirectUris = {"http://localhost:3000/callback"},
            AllowOfflineAccess = true,
            AllowedScopes = {"openid","profile","edusoftapp"},
            AccessTokenLifetime = 3600*24*30,
            AlwaysIncludeUserClaimsInIdToken =true
          },
      };
}

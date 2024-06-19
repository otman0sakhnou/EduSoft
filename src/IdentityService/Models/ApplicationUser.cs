// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.


using Microsoft.AspNetCore.Identity;

namespace IdentityService.Models;

// Add profile data for application users by adding properties to the ApplicationUser class
public class ApplicationUser : IdentityUser
{
  public string roleName { get; set; }
  public string FullName { get; internal set; }
  public DateTime AccountCreationDate { get; set; } = DateTime.UtcNow;
  public DateTime? LastLoginDate { get; set; }
  public DateTime? LastLogoutDate { get; set; }
  public bool IsOnline { get; set; }
  public double UsagePercentage { get; set; }
  public TimeSpan TotalTimeSpent { get; set; }
  public TimeSpan TimeSpentSinceLastLogin { get; set; }
}
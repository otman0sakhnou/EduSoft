using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateÉtudiantInformation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "DateDeNaissance",
                table: "Étudiant",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LieuDeNaissance",
                table: "Étudiant",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateDeNaissance",
                table: "Étudiant");

            migrationBuilder.DropColumn(
                name: "LieuDeNaissance",
                table: "Étudiant");
        }
    }
}

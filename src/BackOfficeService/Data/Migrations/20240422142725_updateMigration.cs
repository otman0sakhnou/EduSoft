using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Absences",
                columns: table => new
                {
                    IdAbsence = table.Column<Guid>(type: "uuid", nullable: false),
                    NomProfesseur = table.Column<string>(type: "text", nullable: true),
                    NomÉtudiant = table.Column<string>(type: "text", nullable: true),
                    NomGroupe = table.Column<string>(type: "text", nullable: true),
                    NomModule = table.Column<string>(type: "text", nullable: true),
                    DateAbsence = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Absences", x => x.IdAbsence);
                });

            migrationBuilder.CreateTable(
                name: "Séances",
                columns: table => new
                {
                    IdSéance = table.Column<Guid>(type: "uuid", nullable: false),
                    NomProfesseur = table.Column<string>(type: "text", nullable: true),
                    NomÉtudiant = table.Column<string>(type: "text", nullable: true),
                    NomGroupe = table.Column<string>(type: "text", nullable: true),
                    NomModule = table.Column<string>(type: "text", nullable: true),
                    DateSéance = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    HeureDébut = table.Column<string>(type: "text", nullable: true),
                    HeureFin = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Séances", x => x.IdSéance);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Absences");

            migrationBuilder.DropTable(
                name: "Séances");
        }
    }
}

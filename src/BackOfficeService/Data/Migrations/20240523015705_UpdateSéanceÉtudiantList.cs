using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSéanceÉtudiantList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Factures",
                columns: table => new
                {
                    FactureId = table.Column<Guid>(type: "uuid", nullable: false),
                    NomProfesseur = table.Column<string>(type: "text", nullable: true),
                    Mois = table.Column<string>(type: "text", nullable: true),
                    Année = table.Column<string>(type: "text", nullable: true),
                    MontantParHeure = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalHeures = table.Column<string>(type: "text", nullable: true),
                    MontantTotale = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Factures", x => x.FactureId);
                });

            migrationBuilder.CreateTable(
                name: "Filières",
                columns: table => new
                {
                    IdFilière = table.Column<Guid>(type: "uuid", nullable: false),
                    NomFilière = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filières", x => x.IdFilière);
                });

            migrationBuilder.CreateTable(
                name: "Module",
                columns: table => new
                {
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    NomModule = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Module", x => x.ModuleId);
                });

            migrationBuilder.CreateTable(
                name: "Groupe",
                columns: table => new
                {
                    GroupeID = table.Column<Guid>(type: "uuid", nullable: false),
                    NomGroupe = table.Column<string>(type: "text", nullable: true),
                    IdFilière = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groupe", x => x.GroupeID);
                    table.ForeignKey(
                        name: "FK_Groupe_Filières_IdFilière",
                        column: x => x.IdFilière,
                        principalTable: "Filières",
                        principalColumn: "IdFilière",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FilièreModules",
                columns: table => new
                {
                    FilièreId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilièreModules", x => new { x.FilièreId, x.ModuleId });
                    table.ForeignKey(
                        name: "FK_FilièreModules_Filières_FilièreId",
                        column: x => x.FilièreId,
                        principalTable: "Filières",
                        principalColumn: "IdFilière",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FilièreModules_Module_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Module",
                        principalColumn: "ModuleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Étudiant",
                columns: table => new
                {
                    EtudiantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CNE = table.Column<string>(type: "text", nullable: true),
                    CIN = table.Column<string>(type: "text", nullable: true),
                    Nom = table.Column<string>(type: "text", nullable: true),
                    Prenom = table.Column<string>(type: "text", nullable: true),
                    Adresse = table.Column<string>(type: "text", nullable: true),
                    Telephone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    DateDeNaissance = table.Column<DateOnly>(type: "date", nullable: true),
                    LieuDeNaissance = table.Column<string>(type: "text", nullable: true),
                    IdGroupe = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Étudiant", x => x.EtudiantId);
                    table.ForeignKey(
                        name: "FK_Étudiant_Groupe_IdGroupe",
                        column: x => x.IdGroupe,
                        principalTable: "Groupe",
                        principalColumn: "GroupeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Séances",
                columns: table => new
                {
                    IdSéance = table.Column<Guid>(type: "uuid", nullable: false),
                    NomProfesseur = table.Column<string>(type: "text", nullable: true),
                    GroupeId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    DateSéance = table.Column<DateOnly>(type: "date", nullable: false),
                    HeureDébut = table.Column<string>(type: "text", nullable: true),
                    HeureFin = table.Column<string>(type: "text", nullable: true),
                    ÉtudiantsAbsents = table.Column<List<Guid>>(type: "uuid[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Séances", x => x.IdSéance);
                    table.ForeignKey(
                        name: "FK_Séances_Groupe_GroupeId",
                        column: x => x.GroupeId,
                        principalTable: "Groupe",
                        principalColumn: "GroupeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Séances_Module_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Module",
                        principalColumn: "ModuleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Étudiant_IdGroupe",
                table: "Étudiant",
                column: "IdGroupe");

            migrationBuilder.CreateIndex(
                name: "IX_FilièreModules_ModuleId",
                table: "FilièreModules",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_Groupe_IdFilière",
                table: "Groupe",
                column: "IdFilière");

            migrationBuilder.CreateIndex(
                name: "IX_Séances_GroupeId",
                table: "Séances",
                column: "GroupeId");

            migrationBuilder.CreateIndex(
                name: "IX_Séances_ModuleId",
                table: "Séances",
                column: "ModuleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Étudiant");

            migrationBuilder.DropTable(
                name: "Factures");

            migrationBuilder.DropTable(
                name: "FilièreModules");

            migrationBuilder.DropTable(
                name: "Séances");

            migrationBuilder.DropTable(
                name: "Groupe");

            migrationBuilder.DropTable(
                name: "Module");

            migrationBuilder.DropTable(
                name: "Filières");
        }
    }
}

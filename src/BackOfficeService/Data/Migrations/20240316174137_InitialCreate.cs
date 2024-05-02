using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "Module",
                columns: table => new
                {
                    ModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    NomModule = table.Column<string>(type: "text", nullable: true),
                    IdFilière = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Module", x => x.ModuleId);
                    table.ForeignKey(
                        name: "FK_Module_Filières_IdFilière",
                        column: x => x.IdFilière,
                        principalTable: "Filières",
                        principalColumn: "IdFilière",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Étudiant",
                columns: table => new
                {
                    EtudiantId = table.Column<Guid>(type: "uuid", nullable: false),
                    Nom = table.Column<string>(type: "text", nullable: true),
                    Prenom = table.Column<string>(type: "text", nullable: true),
                    Adresse = table.Column<string>(type: "text", nullable: true),
                    Telephone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_Étudiant_IdGroupe",
                table: "Étudiant",
                column: "IdGroupe");

            migrationBuilder.CreateIndex(
                name: "IX_Groupe_IdFilière",
                table: "Groupe",
                column: "IdFilière");

            migrationBuilder.CreateIndex(
                name: "IX_Module_IdFilière",
                table: "Module",
                column: "IdFilière");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Étudiant");

            migrationBuilder.DropTable(
                name: "Module");

            migrationBuilder.DropTable(
                name: "Groupe");

            migrationBuilder.DropTable(
                name: "Filières");
        }
    }
}

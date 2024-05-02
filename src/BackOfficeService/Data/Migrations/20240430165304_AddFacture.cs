using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFacture : Migration
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
                    MontantParSéance = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalSéances = table.Column<string>(type: "text", nullable: true),
                    MontantTotale = table.Column<double>(type: "double precision", nullable: false),
                    Statut = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Factures", x => x.FactureId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Factures");
        }
    }
}

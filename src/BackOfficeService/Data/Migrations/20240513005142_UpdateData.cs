using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Statut",
                table: "Factures");

            migrationBuilder.RenameColumn(
                name: "TotalSéances",
                table: "Factures",
                newName: "TotalHeures");

            migrationBuilder.RenameColumn(
                name: "MontantParSéance",
                table: "Factures",
                newName: "MontantParHeure");

            migrationBuilder.AddColumn<string>(
                name: "CIN",
                table: "Factures",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CNE",
                table: "Factures",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CIN",
                table: "Étudiant",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CNE",
                table: "Étudiant",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CIN",
                table: "Factures");

            migrationBuilder.DropColumn(
                name: "CNE",
                table: "Factures");

            migrationBuilder.DropColumn(
                name: "CIN",
                table: "Étudiant");

            migrationBuilder.DropColumn(
                name: "CNE",
                table: "Étudiant");

            migrationBuilder.RenameColumn(
                name: "TotalHeures",
                table: "Factures",
                newName: "TotalSéances");

            migrationBuilder.RenameColumn(
                name: "MontantParHeure",
                table: "Factures",
                newName: "MontantParSéance");

            migrationBuilder.AddColumn<int>(
                name: "Statut",
                table: "Factures",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}

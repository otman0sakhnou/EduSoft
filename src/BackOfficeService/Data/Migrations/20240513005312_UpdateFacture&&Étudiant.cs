using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFactureÉtudiant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CIN",
                table: "Factures");

            migrationBuilder.DropColumn(
                name: "CNE",
                table: "Factures");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}

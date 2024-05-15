﻿// <auto-generated />
using System;
using BackOfficeService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    [DbContext(typeof(BackOfficeDbContext))]
    partial class BackOfficeDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.17")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BackOfficeService.Absence", b =>
                {
                    b.Property<Guid>("IdAbsence")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateOnly>("DateAbsence")
                        .HasColumnType("date");

                    b.Property<string>("NomGroupe")
                        .HasColumnType("text");

                    b.Property<string>("NomModule")
                        .HasColumnType("text");

                    b.Property<string>("NomProfesseur")
                        .HasColumnType("text");

                    b.Property<string>("NomÉtudiant")
                        .HasColumnType("text");

                    b.HasKey("IdAbsence");

                    b.ToTable("Absences");
                });

            modelBuilder.Entity("BackOfficeService.Facture", b =>
                {
                    b.Property<Guid>("FactureId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Mois")
                        .HasColumnType("text");

                    b.Property<decimal>("MontantParHeure")
                        .HasColumnType("numeric");

                    b.Property<double>("MontantTotale")
                        .HasColumnType("double precision");

                    b.Property<string>("NomProfesseur")
                        .HasColumnType("text");

                    b.Property<string>("TotalHeures")
                        .HasColumnType("text");

                    b.HasKey("FactureId");

                    b.ToTable("Factures");
                });

            modelBuilder.Entity("BackOfficeService.Filière", b =>
                {
                    b.Property<Guid>("IdFilière")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.Property<string>("NomFilière")
                        .HasColumnType("text");

                    b.HasKey("IdFilière");

                    b.ToTable("Filières");
                });

            modelBuilder.Entity("BackOfficeService.Groupe", b =>
                {
                    b.Property<Guid>("GroupeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("IdFilière")
                        .HasColumnType("uuid");

                    b.Property<string>("NomGroupe")
                        .HasColumnType("text");

                    b.HasKey("GroupeID");

                    b.HasIndex("IdFilière");

                    b.ToTable("Groupe");
                });

            modelBuilder.Entity("BackOfficeService.Module", b =>
                {
                    b.Property<Guid>("ModuleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("IdFilière")
                        .HasColumnType("uuid");

                    b.Property<string>("NomModule")
                        .HasColumnType("text");

                    b.HasKey("ModuleId");

                    b.HasIndex("IdFilière");

                    b.ToTable("Module");
                });

            modelBuilder.Entity("BackOfficeService.Séance", b =>
                {
                    b.Property<Guid>("IdSéance")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateOnly>("DateSéance")
                        .HasColumnType("date");

                    b.Property<string>("HeureDébut")
                        .HasColumnType("text");

                    b.Property<string>("HeureFin")
                        .HasColumnType("text");

                    b.Property<string>("NomGroupe")
                        .HasColumnType("text");

                    b.Property<string>("NomModule")
                        .HasColumnType("text");

                    b.Property<string>("NomProfesseur")
                        .HasColumnType("text");

                    b.HasKey("IdSéance");

                    b.ToTable("Séances");
                });

            modelBuilder.Entity("BackOfficeService.Étudiant", b =>
                {
                    b.Property<Guid>("EtudiantId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Adresse")
                        .HasColumnType("text");

                    b.Property<string>("CIN")
                        .HasColumnType("text");

                    b.Property<string>("CNE")
                        .HasColumnType("text");

                    b.Property<DateOnly?>("DateDeNaissance")
                        .HasColumnType("date");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<Guid>("IdGroupe")
                        .HasColumnType("uuid");

                    b.Property<string>("LieuDeNaissance")
                        .HasColumnType("text");

                    b.Property<string>("Nom")
                        .HasColumnType("text");

                    b.Property<string>("Prenom")
                        .HasColumnType("text");

                    b.Property<string>("Telephone")
                        .HasColumnType("text");

                    b.HasKey("EtudiantId");

                    b.HasIndex("IdGroupe");

                    b.ToTable("Étudiant");
                });

            modelBuilder.Entity("BackOfficeService.Groupe", b =>
                {
                    b.HasOne("BackOfficeService.Filière", "Filière")
                        .WithMany()
                        .HasForeignKey("IdFilière")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Filière");
                });

            modelBuilder.Entity("BackOfficeService.Module", b =>
                {
                    b.HasOne("BackOfficeService.Filière", "Filière")
                        .WithMany()
                        .HasForeignKey("IdFilière")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Filière");
                });

            modelBuilder.Entity("BackOfficeService.Étudiant", b =>
                {
                    b.HasOne("BackOfficeService.Groupe", "Groupe")
                        .WithMany()
                        .HasForeignKey("IdGroupe")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Groupe");
                });
#pragma warning restore 612, 618
        }
    }
}

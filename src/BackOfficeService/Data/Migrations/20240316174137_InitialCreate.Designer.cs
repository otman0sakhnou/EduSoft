﻿// <auto-generated />
using System;
using BackOfficeService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackOfficeService.Data.Migrations
{
    [DbContext(typeof(BackOfficeDbContext))]
    [Migration("20240316174137_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.17")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

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

            modelBuilder.Entity("BackOfficeService.Étudiant", b =>
                {
                    b.Property<Guid>("EtudiantId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Adresse")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<Guid>("IdGroupe")
                        .HasColumnType("uuid");

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

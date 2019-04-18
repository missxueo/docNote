using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using System;
using System.Collections.Generic;
using System.Text;

namespace EFCoreOnDDD.Entities.EntityTypeConfigurations
{
    class BookEntityTypeConfiguration : IEntityTypeConfiguration<BookEntity>
    {
        public void Configure(EntityTypeBuilder<BookEntity> builder)
        {
            builder.Property<string>("Id").HasColumnName("_id_").HasValueGenerator<StringGuidValueGenerator>();
            builder.HasKey("Id");

            builder.Property(x => x.Name);

            builder.Property(x => x.Type)
                .HasConversion<string>(k => k.ToString(), v => Enum.Parse<EnumBookType>(v));

            builder.OwnsOne(x => x.Author, b => {
                b.Property(v => v.Name).HasColumnName("AuthorName");
            });

            var prop = builder.Metadata.FindNavigation("Author");
            prop.SetPropertyAccessMode(PropertyAccessMode.FieldDuringConstruction);

            builder.OwnsOne(x => x.Catalog, b =>
            {
                b.ToTable("BookCatalog");
                b.Property<int>("Id").HasColumnName("_id_");
                b.Property(x => x.Name);

                b.HasForeignKey("BookId");
            });

            var catalogProp = builder.Metadata.FindNavigation("Catalog");
            catalogProp.SetPropertyAccessMode(PropertyAccessMode.FieldDuringConstruction);


            builder.HasMany(x => x.Chapters)
                .WithOne()
                .HasForeignKey("BookId");

            builder.Metadata.FindNavigation(nameof(BookEntity.Chapters))
                .SetPropertyAccessMode(PropertyAccessMode.Field);


            builder.OwnsMany(x => x.KeyWords, b =>
            {
                b.ToTable("BookKeyWords");
                b.Property<int>("Id").HasColumnName("_id_");
                b.HasKey("Id");

                b.Property(x => x.Word);
                b.HasForeignKey("BookId");
            });

            builder.Metadata.FindNavigation(nameof(BookEntity.KeyWords))
                .SetPropertyAccessMode(PropertyAccessMode.Field);

        }
    }

    class StringGuidValueGenerator : ValueGenerator<string>
    {
        public override bool GeneratesTemporaryValues => false;

        public override string Next(EntityEntry entry)
        {
            return Guid.NewGuid().ToString("N");
        }
    }
}

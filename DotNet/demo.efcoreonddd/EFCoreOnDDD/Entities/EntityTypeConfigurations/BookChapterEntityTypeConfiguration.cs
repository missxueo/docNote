using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace EFCoreOnDDD.Entities.EntityTypeConfigurations
{
    class BookChapterEntityTypeConfiguration : IEntityTypeConfiguration<BookChapterEntity>
    {
        public void Configure(EntityTypeBuilder<BookChapterEntity> builder)
        {
            builder.Property(x => x.Title);
            builder.Property(x => x.Index);

            builder.Property<string>("Id");
        }
    }
}

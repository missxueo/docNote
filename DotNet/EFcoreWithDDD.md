# EFCore在DDD中的使用

在DDD中，我们对聚合根的操作都会通过仓储去获取聚合实例。
因为聚合根中可能会含有实体属性，值对象属性，并且，在DDD中，我们所设计的领域模型都是充血模型。所以，在对聚合根的持久化中，最方便的还是Mangodb这种KEY-VALUE存储的NOSQL。

不过，关系型数据库通过EF也能方便的解决复杂模型的数据库映射。

本文使用EFCore，部分API不适用于EF；本文不谈DDD。

以下引出几个知识点：

* backing field
* releation
* lazy load
* data binding
* navigation property
* converter

## 定义模型

我们首先定义一个复杂关系的 对象模型;

```c#
    class BookEntity
    {
        private BookEntity(string name)
        {
            Name = name;
        }

        public BookEntity(string name, AuthorInfo author,BookCatalogEntity catalog)
        {
            Name = name;
            Author = author;
            Catalog = catalog;
        }

        public string Name { get; }

        public AuthorInfo Author { get; private set; }

        public BookCatalogEntity Catalog { get; private set; }

        public EnumBookType Type { get; private set; }


        private IList<BookChapterEntity> _chapters = new List<BookChapterEntity>(); // back filed

        public IEnumerable<BookChapterEntity> Chapters => _chapters;


        private List<KeyWordInfo> _keyWords = new List<KeyWordInfo>();

        public IEnumerable<KeyWordInfo> KeyWords => _keyWords;

        public string BookCoverImage { get; private set; }

        //...

    }

    class AuthorInfo
    {
        public AuthorInfo(string name)
        {
            Name = name;
        }
        public string Name { get; }
    }

    enum EnumBookType
    {
        History,
        Law,
        IT,
    }

    class KeyWordInfo
    {
        public KeyWordInfo(string word)
        {
            Word = word;
        }

        public string Word { get; }
    }

    class BookChapterEntity
    {
        public BookChapterEntity(string title, int index)
        {
            Title = title;
            Index = index;
        }

        public string Title { get; }

        public int Index { get; }
    }

    class BookCatalogEntity
    {
        public BookCatalogEntity(string name)
        {
            Name = name;
        }
        public string Name { get; }
        public string Description { get; private set; }

        public void Mark(string desc)
        {
            Description = desc;
        }
    }

```

## 配置数据库的映射

配置关系映射，我们主要使用以下几个Fluent Api

* OwnsOne ( ...args )
* OwnsMany ( ...args )
* HasOne ( ...args )
* HasMany ( ...args )

```c#
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

    class BookChapterEntityTypeConfiguration : IEntityTypeConfiguration<BookChapterEntity>
    {
        public void Configure(EntityTypeBuilder<BookChapterEntity> builder)
        {
            builder.Property(x => x.Title);
            builder.Property(x => x.Index);

            builder.Property<string>("Id");
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
```






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

大致上描述下这个`BookEntity`根实体类的几个定义:

* 拥有只读的属性 `Name`
* 拥有两个对象属性`Author`和`Catalog`
* 枚举`EnumBookType`类型属性`Type`
* 拥有两个私有的列表字段 `_chapters` 和 `_keyWords`

大致的映射目标:

* 将`Name`通过构造函数绑定
* 将`Author`的字段映射到与`BookEntity`同一张表
* 将`Catalog`保存到单独的一张表
* 将枚举属性`Type`保存为字符串
* 将`Chapters`属性绑定到`_chapters`，并懒加载
* 将`KeyWords`属性绑定到`_keyWords`，关实时加载

### 简单映射

```c#
class BookEntity{
    private BookEntity(string name){
        Name = name;
    }
    public string Name { get; }
    public string BookCoverImage { get; private set; }
    public EnumBookType Type { get; private set; }
    //...
}

class BookEntityTypeConfiguration : IEntityTypeConfiguration<BookEntity>{
    public void Configure(EntityTypeBuilder<BookEntity> builder){
        builder.Property<string>("Id").HasColumnName("_id_")
            .HasValueGenerator<StringGuidValueGenerator>();
            
        builder.Property(x => x.Name);
        builder.Property(x => x.Type)
                .HasConversion<string>(k => k.ToString(), v => Enum.Parse<EnumBookType>(v));
    }
}
```

在上述代码中，我们定义了一个简单对象类及它的配置项。
* `BookEntity`中未定义`Id`主键，我们通过 *阴影属性* 的方式指定了一个主键，并将它映射到db的`_id_`列；
* EF中默认绑定 有 *setter* 方法的 *public getter* 属性，而我们的`Name`没有setter方法，我们必须通过在配置中显示调用 `Property()` 将其加入到绑定中。
* EF中可以通过构造函数将字段绑定到实体上。
* 可以能过调用 `HasConversion()` 方法显示指定使用的转换方法。比如将`IDictionary<string,string>` 保存为 `string`

那么我们如何根据 主键 查询呢？

EF 为我们提供了静态方法`EF.Property()`

```c#
var entity = ctx.Set<BookEntity>().FirstOrDefault(x=>EF.Property<string>(x,"Id") == "1");

```

### 关系与固有类型

在官方文档中，关系主要使用以下几种方法来配置的。

* `HasOne()`
* `HasMany()`
* `WithOne()`
* `WithMany()`

而 *OwnsType* （固有类型）是新近推出的API。

* `OwnsOne()`
* `OwnsMany()`

```c#



```



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

        //...
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

大致解释下配置项。




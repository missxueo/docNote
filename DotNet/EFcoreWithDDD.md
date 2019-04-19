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

## 让我们开始吧

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

虽然都会创建导航属性，但是从定义和使用上来看
，还是有很大区别的。

> 经过测试，导航属性不能通过构造函数绑定，所以以下配置中，均使用 *private setter* 。
>> （如果有读者发现错误，欢迎指正。）


下面我们就对两种API进行配置。

#### OwnsType的配置

从使用上的角度上来看，`OwnsType`像其名字一样,强调的是*A拥有B*，这个属性是这个类固有的，没有懒加载的配置。

扩展我们之前写义的实体类。

```c#
class BookEntity{
    //...略
    public AuthorInfo Author { get; private set; }

    private List<KeyWordInfo> _keyWords = new List<KeyWordInfo>();
    public IEnumerable<KeyWordInfo> KeyWords => _keyWords;
}

class AuthorInfo
{
    public AuthorInfo(string name){
        Name = name;
    }
    public string Name { get; }
}
class KeyWordInfo
{
    public KeyWordInfo(string word){
        Word = word;
    }
    public string Word { get; }
}

```
扩展配置类

```c#
class BookEntityTypeConfiguration : IEntityTypeConfiguration<BookEntity>{
    builder.OwnsOne(x => x.Author, b => {
        b.Property(v => v.Name).HasColumnName("AuthorName");
    });
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
```

默认情况下,`OwnsOne()`会与实体映射在同一张表,`OwnsMany()`没有做具体测试。

这里我们对导航属性`KeyWords`进行了配置，因为它是只读的，所以我们将它配置为绑定为字段，这个私有字段叫做`backing field`(支持字段??)，在EF中默认有以下4种格式，当然这是支持自定义的:

- _< camel-cased property name >
- _< property name >
- m_< camel-cased property name >
- m_< property name >

> 那什么是`backing field` ???

#### ReleationShip 配置

如`HasOne()`这种关系API，更适合于*A与B*之前的关系，比如 1-* （一对多）的关系、1-1（一对一）的关系等等，所以这种配置必须在不同表中。

```c#
class BookEntity{
    //...略
    private IList<BookChapterEntity> _chapters = new List<BookChapterEntity>(); 
    public IEnumerable<BookChapterEntity> Chapters => _chapters;
}

```
```c#
class BookEntityTypeConfiguration : IEntityTypeConfiguration<BookEntity>
{
    public void Configure(EntityTypeBuilder<BookEntity> builder)
    {
        //...略
        builder.HasMany(x => x.Chapters).WithOne().HasForeignKey("BookId");

        builder.Metadata.FindNavigation(nameof(BookEntity.Chapters))
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
```

从配置上来看，我们的两个实体都是分开配置的，而从实体类角度上看，这里是两个类体的关系，我们配置的是 1-*的关系。
使用`HasOne()`等*ReleationShip* Api配置的属性，默认是不加载的，我们可以通过配置进行立即加载或延迟加载。

> 我们可以查看官方文档查看懒加载的方式。
> > https://docs.microsoft.com/en-us/ef/core/querying/related-data

### backing field (支持字段)

我们都知道C#中有这样子的写法。

```c#
class Foo{
    public string Name{get;set;}
}
```
写完整了是这样的。
```c#
class Foo{
    private string _name;
    public string Name{
        get{return _name;}
        set{_name = value;}
    }
}
```
而在其它语言中，可能是这样的。
```c#
class Foo{
    private string _name;
    public string GetName(){
        return _name;
    }
    public void SetName(value){
        _name = value;
    }
}
```
我认为以上的`_name`就是一个*backing field*; 以字面意思解释就是属性底层的字段。

### 查询过滤器 Query Filter

我们公司的业务设计上，数据不能真删，通过一个 *IsDeleted* 字段进行控制。这样在有必要的情况下，我们可以将数据进行还原。

```c#
class BookEntityTypeConfiguration : IEntityTypeConfiguration<BookEntity>
{
    public void Configure(EntityTypeBuilder<BookEntity> builder)
    {
        //...略
        builder.Property<bool>("IsDeleted");
        builder.HasQueryFilter(x=>!EF.Property<bool>(x,"IsDeleted"));
    }
}
```
我们通过`HasQueryFilter()`配置一个全局过滤器。

什么？你说又要查询的时候要查询`IsDeleted == true`的数据？？
```c#
var allBooks = ctx.Set<BookEntity>()
    .IgnoreQueryFilters()
    .ToList();
//通过 IgnoreQueryFilters 忽视掉全局过滤器;
```

> 更多的查看官方文档
>> https://docs.microsoft.com/en-us/ef/core/querying/filters


## 结尾总结

在我们项目切换到DDD模式下开发的时候，使用关系型数据库作为仓储的实现真是头疼。还好，我们有EF，但是如果对EF的API和映射不熟悉的话，会导致出现因技术原因修改领域模型的情况，而这种情况是我们应该避免的。

> 如发现文中有误，欢迎指正。

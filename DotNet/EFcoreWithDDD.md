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



```

## 配置数据库的映射

配置关系映射，我们主要使用以下几个Fluent Api

* OwnsOne ( ...args )
* OwnsMany ( ...args )
* HasOne ( ...args )
* HasMany ( ...args )

```c#

```






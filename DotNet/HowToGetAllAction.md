# 在ASPNETCORE中获得所有Action

本文旨在记录自己在aspnetcore工作中需要获取所有Action，在查询了资料后进行了几种方法的记录。后期有发现其它方式再进行追加。

## 通过 反射获取 

> (略)

## 通过 `ApplicationPartManager`

1. 通过构造函数注入`ApplicationPartManager`；
2. 通过 `PopulateFeature()` 方法将数据设置到`ControllerFeature`实例中；
3. 

```C#

public class ListController : Controller
{
    public ListController(ApplicationPartManager applicationPartManager)
    {
        _applicationPartManager = applicationPartManager;
    }
    private ApplicationPartManager _applicationPartManager;

    public IEnumerable<dynamic> List()
    {
        var controllerFeature = new ControllerFeature();
        _applicationPartManager.PopulateFeature(controllerFeature);
        var data = controllerFeature.Controllers.Select(x => new
            {
                Namespace = x.Namespace,
                Controller = x.FullName,
                ModuleName = x.Module.Name,
                Actions = x.DeclaredMethods.Where(m=>m.IsPublic && !m.IsDefined(typeof(NonActionAttribute))).Select(y => new
                {
                    Name = y.Name,
                    ParameterCount = y.GetParameters().Length,
                    Parameters = y.GetParameters()
                    .Select(z => new
                    {
                        z.Name,
                        z.ParameterType.FullName,
                        z.Position,
                        Attrs = z.CustomAttributes.Select(m => new
                        {
                            FullName = m.AttributeType.FullName,
                        })
                    })
                }),
            });
        return data;
    }
}

```

**方法优缺点:**

* 优点：

使用方便；
能直接获取所有注册的Controller；

* 缺点：

不能获取action信息；
不能方便的获取路由信息；

## 通过 `IActionDescriptorCollectionProvider`

1. 通过构造函数注入`IActionDescriptorCollectionProvider` 实例；

```C#

private IActionDescriptorCollectionProvider _actionProvider;

public IEnumerable<dynamic> List()
{
    var actionDescs = _actionProvider.ActionDescriptors.Items.Cast<ControllerActionDescriptor>().Select(x => new 
    {
        ControllerName = x.ControllerName,
        ActionName = x.ActionName,
        DisplayName = x.DisplayName,
        RouteTemplate = x.AttributeRouteInfo.Template,
        Attributes = x.MethodInfo.CustomAttributes.Select(z=>new {
            TypeName = z.AttributeType.FullName,
            ConstructorArgs = z.ConstructorArguments.Select(v => new {
                ArgumentValue = v.Value
            }),
            NamedArguments = z.NamedArguments.Select(v => new {
                v.MemberName,
                TypedValue = v.TypedValue.Value,
            }),
        }),
        ActionId = x.Id,
        x.RouteValues,
        Parameters = x.Parameters.Select(z => new {
            z.Name,
            TypeName = z.ParameterType.Name,
        })
    });

    return actionDescs;
}

```

**方法优缺点**

* 优点:

能快速查看所有的acton详细信息及其路由信息，包括参数信息，特性等等；

* 缺点:

不能方便得查看Controller的信息；


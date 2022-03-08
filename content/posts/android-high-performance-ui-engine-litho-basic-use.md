---
title: "Android声明式UI框架 Litho 初探——基础使用"
slug: "android-high-performance-ui-engine-litho-basic-use"
date: 2020-09-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
### 初衷
Litho作为一个高性能的UI引擎，学习曲线还是比较高的，但是在国内能用的资料非常少（大部分都是相互复制的”Hello Word“教程），国外除了Litho自己的文档外，也没有太多教程。这几篇教程也是我边学边写。如果有那里理解不到位的地方，欢迎指正。

### Litho 是什么

Litho是一个用于在Android上构建高效用户界面（UI）的声明性框架。但不同以往的UI框架，它的底层是[Yoga](https://yogalayout.com/),它通过将不需要交互的UI转换为Drawable来渲染视图，通过Yoga来完成组件布局的异步或同步（可根据场景定制）测量和计算，实现了布局的扁平化。加速了UI渲染速度

在Litho中，使用组件（Component）来构建UI，而不是直接与传统的Android视图进行交互。组件本质上是一个函数，它接受不可变的输入（称为属性 props），并返回描述用户界面的组件层次结构。

如果有Flutter开发经验，那么Litho的开发方式有点类似

接下来的教程都将结合代码进行讲解

### 基础配置
`gradle`
```gradle

apply plugin: 'kotlin-kapt'

dependencies 中加入

    // Litho
    implementation 'com.facebook.litho:litho-core:0.37.1'
    implementation 'com.facebook.litho:litho-widget:0.37.1'
    kapt 'com.facebook.litho:litho-processor:0.37.1'
    // SoLoader
    implementation 'com.facebook.soloader:soloader:0.9.0'
    // For integration with Fresco
    implementation 'com.facebook.litho:litho-fresco:0.37.1'
    // Sections
    implementation 'com.facebook.litho:litho-sections-core:0.37.1'
    implementation 'com.facebook.litho:litho-sections-widget:0.37.1'
    compileOnly 'com.facebook.litho:litho-sections-annotations:0.37.1'
    kapt 'com.facebook.litho:litho-sections-processor:0.37.1'
```

初始化`SoLoader.Litho`依赖，`SoLoader`用于加载底层布局引擎Yoga
```java
SoLoader.init(this, false);
```
### 使用基础Component

#### Component Specs

Litho中的视图单元叫做`Component`，可以直观的翻译为`组件`

组件分为两种类型 ：
Layout Spec：将其他组件组合到特定的布局中。这相当于 Android 上的 ViewGroup 。

Mount Spec：可以渲染 View 或 Drawable 组件。
现在，让我们来看看 Layout Spec 的整体结构：

**Component的类名必须以Spec结尾，不然会报错**

```Java
/**
 * Component
 * 组件 Spec 只是一个普通的java类，带有一些特殊的注解。
 * 组件 Spec 是完全无状态的，没有任何类成员。
 * 使用 @Prop 标注的参数将自动成为组件构建器的一部分。
 */
@LayoutSpec // 将其他组件组合到特定的布局中。这相当于 Android 上的 ViewGroup
class MainLithoViewSpec {
    /**
     * @OnCreateLayout 注解的方法必须具有 ComponentContext 作为其第一个参数
     * 后跟使用 @Prop 标注的参数列表。注解处理器将在构建时对参数列表以及API中其他约束条件进行验证。
     */
    @OnCreateLayout
    fun onCreateLayout(
        context: ComponentContext,
        @Prop color: Int,
        @Prop title: String
    ): Component {
        return Column.create(context)
            .paddingDip(YogaEdge.ALL, 16f)
            .backgroundColor(Color.DKGRAY)
            .child(
                Text.create(context).text(title)
                    .textColor(color)
                    .textSizeDip(25f)
            )
            .child(
                Text.create(context).text("这是小标题")
                    .textColor(Color.GREEN)
                    .textSizeDip(16f)
            )
            .build()

    }
}
```
在Activity中使用
``` Java
···
 override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val c = ComponentContext(this);
        // 这两方式都可以，但是第一种方式需要编译
        val component2 = MainLithoView.create(c).color(Color.WHITE).title("这是一个Title")
        
        val component = MainLithoViewSpec.onCreateLayout(c, Color.WHITE, "这是一个Title")
        // 这里不在使用xml，使用 Litho的Component
        setContentView(LithoView.create(c, component));
    }
···
```

组件 Spec 类在编译时期会生成与 Spec 名相同但没有 Spec 后缀的ComponentLifecycle 子类。例如，MainLithoViewSpec 类会生成一个 MainLithoView 类。

生成的类种暴露的唯一 API 是 create（...）方法，它为 spec 类中声明的 @Props 返回相应的Component.Builder。
*在运行时，特定类型的所有组件实例共享相同的 ComponentLifecycle 引用。这意味着每个组件类型只有一个spec实例，而不是每个组件实例。*

MountSpec相比于Layout Spec更复杂一些，它拥有自己的生命周期，在下篇文章中单独讲解。

目前我自己的理解是LayoutSpec中你可以使用官方提供的一些组件来构建UI，但是官方组件毕竟数量有限不可能全部实现UI设计。这时候`MountSpec`的作用就凸显出来了。`MountSpec`把Android上的View转化为一个符合Litho要求的`Component`。



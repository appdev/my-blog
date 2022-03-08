---
title: "Android声明式UI框架 Litho 初探 —— MountSpec的使用"
slug: "android-high-performance-ui-engine-litho-basic-use-1"
date: 2020-09-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
### Mount Specs
Mount Specs 用来生成渲染具体View或者Drawable的组件。
Mount spec 必须使用@MountSpec注解来标注，并至少实现一个标注了@onCreateMountContent的方法。

Mount Spec相比于Layout Spec更复杂一些，它拥有自己的生命周期：

- @OnPrepare，准备阶段，进行一些初始化操作。
- @OnMeasure，负责布局的计算。
- @OnBoundsDefined，在布局计算完成后挂载视图前做一些操作。
- @OnCreateMountContent，创建需要挂载的视图。
- @OnMount，挂载视图，完成布局相关的设置。
- @OnBind，绑定视图，完成数据和视图的绑定。
- @OnUnBind，解绑视图，主要用于重置视图的数据相关的属性，防止出现复用问题。
- @OnUnmount，卸载视图，主要用于重置视图的布局相关的属性，防止出现复用问题

Android 小伙伴应该对上面这几个状态比较熟悉

这里引用一张[美团技术博客][1]的图:

![1697f2d29373ad9d.jpg][2]

下面这个代码，只是一个单纯的ColorDrawable，你也可以替换成你需要实习的View 例如 ImageView:

```java

/**
 * 挂载操作有一个非常类似于Android的RecyclerView Adapter的API。
 * 它有一个 onCreateMountContent 方法，用于在回收池为空时创建和初始化 View 和 Drawable 内容 onMount 使用当前信息对复用的内容进行更新。
 *
 * 预分配
 * 当挂载 MountSpec 组件时，其 View 或 Drawable 内容需要从回收池中初始化或重用。
 * 如果池为空，那么将创建一个新实例，这可能会使UI线程过于繁忙并丢弃一个或多个帧。为了缓解这种情况，Litho 可以预先分配一些实例并放入回收池中。
 *
 */
@MountSpec(poolSize = 0, canPreallocate = true, isPureRender = true)
class MainColorViewSpec {
    private const val TAG = "MainColorViewSpec"


    // onCreateMountContent 的返回类型应该始终与 onMount 的第二个参数的类型匹配。它们必须是 View 或 Drawable 子类。参数在构建时进行校验。
    // onCreateMountContent 不能接收 @Prop 或任何带有其他注解的参数。
    @OnCreateMountContent
    fun onCreateMountContent(context: Context): ColorDrawable {
        Log.d(TAG, "OnCreateMountContent() 在组件挂接到宿主 View 之前运行")
        return ColorDrawable()
    }

    /**
     * 挂载必须在主线程，因为需要处理 Android View。
     * @OnMount 方法不知执行耗时操作，原因跟上面类似，Android 主线程不能执行耗时操作
     * 在任何 @MountSpec 方法中使用Output <？> 会自动为之后的阶段创建一个输入。在这种情况下，@OnPrepare 输出为 @OnMount 的输入。
     */
    @OnMount
    fun onMount(
        context: ComponentContext,
        colorDrawable: ColorDrawable,
        @FromPrepare color: Int // 名称必须对应
    ) {
        Log.d(TAG, "OnMount() 在组件挂接到宿主 View 之前运行")
        colorDrawable.color = color
    }


    // 该方法在执行布局计算之前只运行一次，并且可以在后台线程中执行。
    @OnPrepare
    fun onPrepare(
        context: ComponentContext,
        @Prop colorName: Int,
        color: Output<Int> // 名称必须对应
    ) {
        Log.d(TAG, "onPrepare() 在布局测量之前运行")
        color.set(colorName)
    }


    /**
     * 如果要在布局计算过程中自定义组件的测量，就要实现 @OnMeasure 方法。
     * 假设想要 ColorComponent 具有默认宽度，并在其高度未定义时强制执行特定的高宽比。
     */
    @OnMeasure
    fun onMeasure(
        context: ComponentContext,
        layout: ComponentLayout,
        widthSpec: Int,
        heightSpec: Int,
        size: Size
    ) {
        Log.d(TAG, "onMeasure() 在布局测量期间选择性运行")
        if (SizeSpec.getMode(widthSpec) == SizeSpec.UNSPECIFIED) {
            size.width = 40
        } else {
            size.width = SizeSpec.getSize(widthSpec)
        }

        // If height is undefined, use 1.5 aspect ratio.
        if (SizeSpec.getMode(heightSpec) == SizeSpec.UNSPECIFIED) {
            size.height = (size.width * 1.5).toInt()
        } else {
            size.height = SizeSpec.getSize(heightSpec)
        }
    }


    @OnBoundsDefined
    fun onBoundsDefined(c: ComponentContext, layout: ComponentLayout) {
        Log.d(TAG, "onBoundsDefined() 在布局测量之后运行")
    }


    @OnBind
    fun onBind(c: ComponentContext, view: ColorDrawable) {
        Log.d(TAG, "onBind() 在组件挂接到宿主 View 后运行")
    }

    @OnUnbind
    fun onUnbind(c: ComponentContext, view: ColorDrawable) {
        Log.d(TAG, "onUnbind() 在将组件从宿主 View 分离之前运行")
    }

    @OnUnmount
    fun onUnmount(context: ComponentContext, mountedView: ColorDrawable) {
        Log.d(TAG, "OnUnmount() 在组件从宿主 View 分离后，选择性运行")
    }

    /**
     * Mount Spec可以使用@ShouldUpdate注释定义一个方法来避免在更新时进行重新测试和重新挂载。
     * @ShouldUpdate 的调用的前提是component是"纯渲染函数'。
     * 一个组件如果是纯渲染函数,那么它的渲染结果只取决于它的prop和状态.
     * 这意味着在@OnMount期间，组件不应该访问任何可变的全局变量。
     * 一个@MountSpec可以通过使用@MountSpec注释的pureRender参数来定自己为"纯渲染的"。
     * 只有纯渲染的Component可以假设当prop不更改时就不需要重新挂载
     */
    @ShouldUpdate(onMount = true)
    fun shouldUpdate(@Prop(optional = true) someStringProp: Diff<String>): Boolean {
        return someStringProp.previous.equals(someStringProp.next)
    }
}
```
使用:
```Java
val component2  = MainColorView.create(c)
            .widthDip(26f)
            .heightDip(46f)
            //colorName 就是我们定义的属性
            .colorName(Color.GREEN).build()
```
运行后打印的log:

```java
MainColorViewSpec: onPrepare() 在布局测量之前运行
MainColorViewSpec: onBoundsDefined() 在布局测量之后运行
MainColorViewSpec: OnCreateMountContent() 在组件挂接到宿主 View 之前运行
MainColorViewSpec: OnMount() 在组件挂接到宿主 View 之前运行
MainColorViewSpec: onBind() 在组件挂接到宿主 View 后运行
MainColorViewSpec: onUnbind() 在将组件从宿主 View 分离之前运行
```

到这里 MountSpec 的基本用法就讲完了。有了这两个Component 就乐意做很多事了。下篇讲一下如何实现一个滑动的View


  [1]: https://tech.meituan.com/
  [2]: https://static.apkdv.com/usr/uploads/2020/09/2536037639.jpg#mirages-width=1791&mirages-height=1628&mirages-cdn-type=2
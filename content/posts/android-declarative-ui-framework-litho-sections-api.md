---
title: "Android 声明式 UI 框架 Litho 初探 —— Sections API"
slug: "android-declarative-ui-framework-litho-sections-api"
date: 2020-09-09T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                

在最开始入门介绍中，我们曾经用`SingleComponentSection`完成了一个简单的列表，当时的做法是使用 for 构造出了多个子Component。其实在 Litho 中提供了一个性能更好的方式，专门处理这种数据（这种数据其实就是类似于Android 中的adapter 与其绑定的数据）。

Litho中专门处理这种模板与列表支持的组件叫做

### `DataDiffSection`的使用

`DataDiffSection`。下面用`DataDiffSection`我们重构一下之前写的`MainListViewSpec`。

* 首先生成我们的数据:
```java
 val data = arrayListOf<Int>()
        for (i in 0 until 32) {
            data.add(i)
        }
```
* 在`MainListViewSpec`中增加一个创建`ListItemView`组件的方法:
```java
    @OnEvent(RenderEvent::class)
    fun onRender(c: SectionContext, @FromEvent model: Int): RenderInfo {
        return ComponentRenderInfo.create().component(
            ListItemView.create(c)
                .color(if (model % 2 == 0) Color.WHITE else Color.LTGRAY)
                .title(if (model % 2 == 0) "hello word" else model.toString())
                .build()
        ).build()
    }
```

* 接下来改造一下`onCreateChildren`方法：
```java
    @OnCreateChildren
    fun createChildren(c: SectionContext, @Prop listData: ArrayList<Int>):Children {
        return Children.create()
            .child(
                DataDiffSection.create<Int>(c)
                    .data(listData)
                    .renderEventHandler(MainListView.onRender(c))
            )
            .build()
    }
```
* 最后运行一下:
```java
···
 val recycleView = RecyclerCollectionComponent.create(c).disablePTR(false)
            .section(MainListView.create(SectionContext(this)).listData(data)).build()
        setContentView(LithoView.create(c, recycleView))
···
```

可能大部分到这里都有点蒙，`DataDiffSection`到底是从哪里来的呢？
`DataDiffSection`有点类似于Android的`DiffUtil` 它是一个内置的一个事件:
1. 每当一个Item被渲染的时候，DataDiffSection会产生一个RenderEvent。
1. 创建DataDiffSection的时候，我们要传入自己的`renderEventHandler`，就是上面代码中的`MainListView.onRender(c)`。

可以看到效果跟之前的没有区别:
![20200909_111944.gif][1]
### 嵌套一个横向滚动的列表
在最开始我们是使用 `SingleComponentSection`构建列表的。这里如果需要嵌套一个横向滚动的列表，同样也可以用 `SingleComponentSection` 来完成：

```java
val config =  ListRecyclerConfiguration.create()
            .orientation(LinearLayoutManager.HORIZONTAL)
            .reverseLayout(false)
            .snapMode(SnapUtil.SNAP_TO_CENTER)
            .build()

 RecyclerCollectionComponent.create(c)
    .disablePTR(true)
    .recyclerConfiguration(config)
    .section(DataDiffSection.create<Int>(c)
        .data(listData)
        .renderEventHandler(SectionItem.onRender(c)))
    .canMeasureRecycler(true)
```
![Video_20200909_112127_733.gif][2]


  [1]: https://static.apkdv.com/usr/uploads/2020/09/3312191397.gif#mirages-width=432&mirages-height=864&mirages-cdn-type=2
  [2]: https://static.apkdv.com/usr/uploads/2020/09/1475673005.gif#mirages-width=432&mirages-height=864&mirages-cdn-type=2
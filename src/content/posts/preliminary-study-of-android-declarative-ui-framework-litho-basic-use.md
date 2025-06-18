---
title: "Android 声明式 UI 框架 Litho 初探 —— Layout"
slug: "preliminary-study-of-android-declarative-ui-framework-litho-basic-use"
published: 2020-09-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
Litho 底层使用的是 Yoga,Yoga 是 Facebook 的另一个开源项目，它是一个跨 iOS、Android、Windows 平台在内的布局引擎，兼容 Flexbox 布局方式。
所以只要熟悉 Flexbox 布局，那么在使用 Litho 进行 UI 布局时基本毫无压力。
如果熟悉 Flutter 开发，那在使用 Litho 时，会有一些似曾相识的感觉，Litho 中的 Row 与 Column 相关属性与 Flutter 中的 Row 与 Column 几乎无二。
本来想写一点示例代码，但是感觉没什么可写的。下面这个链接是 Yoga 官网的 playground。   
https://yogalayout.com/playground  
你可以通过它可视化的调整 UI，构建你需要的 layout。同时可以生成相应的 Litho 代码
在线可视化构建 UI:
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268538543844186644.png)
直接生成的 Litho 代码:
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726854374910837438.png)
在 Flexbox 中可以通过 positionType(ABSOLUTE) 属性来实现 Android 中的 `FrameLayout` 效果：
```java
    @OnCreateLayout
    fun createLayout(c: ComponentContext): Component {
        return Column.create(c)
            .child(
                SolidColor.create(c)
                    .color(Color.MAGENTA)
                    .widthDip(100f)
                    .heightDip(100f)
            )
            .child(
                Text.create(c)
                    .text("FrameLayout")
                    .marginDip(YogaEdge.TOP, 30f)
                    .positionType(YogaPositionType.ABSOLUTE)
            )
            .build();
    }
```
运行效果： 
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268547972346767400.png)
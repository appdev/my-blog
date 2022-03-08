---
title: "Android 声明式 UI 框架 Litho 初探 —— Layout"
slug: "preliminary-study-of-android-declarative-ui-framework-litho-basic-use"
date: 2020-09-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "Litho底层使用的是Yoga,Yoga是Facebook的另一个开源项目，它是一个跨iOS、Android、Windows平台在内的布局引"
cover: 
    image: "https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268538543844186644.png"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                

Litho底层使用的是Yoga,Yoga是Facebook的另一个开源项目，它是一个跨iOS、Android、Windows平台在内的布局引擎，兼容Flexbox布局方式。

所以只要熟悉Flexbox布局，那么在使用Litho进行UI布局时基本毫无压力。

如果熟悉Flutter开发，那在使用Litho时，会有一些似曾相识的感觉，Litho中的 Row 与 Column 相关属性与Flutter中的 Row 与 Column 几乎无二。

本来想写一点示例代码，但是感觉没什么可写的。下面这个链接是Yoga 官网的playground。   
https://yogalayout.com/playground  
你可以通过它可视化的调整UI，构建你需要的layout。同时可以生成相应的Litho代码

在线可视化构建UI:
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268538543844186644.png)

直接生成的Litho代码:
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726854374910837438.png)


在 Flexbox 中可以通过 positionType(ABSOLUTE)属性来实现Android 中的 `FrameLayout`效果：
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

运行效果:  
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268547972346767400.png)
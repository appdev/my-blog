---
title: "RelativeLayout与LinearLayout性能上的比较"
slug: "comparison-of-performance-between-relativelayout-and-linearlayout"
date: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "首先必须明确：RelativeLayout性能可未必比LinearLayout高LinearLayout性能也未必比RelativeLa"

---
                
首先必须明确：
RelativeLayout 性能可未必比LinearLayout高
LinearLayout 性能也未必比RelativeLayout高

不同场景下，性能各有差异。

RelativeLayout在onMeasure 的时候，每个子View都得测量两次的。 所以View树越顶部，越不应该使用RelativeLayout，当然也不应该使用LinearLayout的权重(weight)属性，因为它也会导致测量两次以上。

如果当前布局在View树的底部，那就可以遵循扁平化布局的设计原则。
所以没有绝对的，得根据你的UI设计的结构来决定到底使用哪个。

为什么有些人说，LinearLayout的性能好，另一些人说RelativeLayout好，当然这是有前提的。LinearLayout在不使用weight属性的情况下，越靠近树的顶部，子View越多，性能比RelativeLayout越高。

那么如何选择：其实就围绕着 1、子View数量，嵌套关系。 2、该节点在View树的位置。这两点来综合考虑
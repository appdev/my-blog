---
title: "RelativeLayout与LinearLayout性能上的比较"
slug: "comparison-of-performance-between-relativelayout-and-linearlayout"
published: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
首先必须明确：
RelativeLayout 性能可未必比 LinearLayout 高
LinearLayout 性能也未必比 RelativeLayout 高
不同场景下，性能各有差异。
RelativeLayout 在 onMeasure 的时候，每个子 View 都得测量两次的。所以 View 树越顶部，越不应该使用 RelativeLayout，当然也不应该使用 LinearLayout 的权重 (weight) 属性，因为它也会导致测量两次以上。
如果当前布局在 View 树的底部，那就可以遵循扁平化布局的设计原则。
所以没有绝对的，得根据你的 UI 设计的结构来决定到底使用哪个。
为什么有些人说，LinearLayout 的性能好，另一些人说 RelativeLayout 好，当然这是有前提的。LinearLayout 在不使用 weight 属性的情况下，越靠近树的顶部，子 View 越多，性能比 RelativeLayout 越高。
那么如何选择：其实就围绕着 1、子 View 数量，嵌套关系。2、该节点在 View 树的位置。这两点来综合考虑
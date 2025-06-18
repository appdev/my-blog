---
title: "解决RecyclerView嵌套ScollView5.0以上失去惯性"
slug: "solving-inertia-loss-above-recyclerview-nested-scollview50"
published: 2018-07-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
&emsp;&emsp;项目中发现，RecyclerView 在 5.0 以上版本滑动不流畅，滑动的手指一离开屏幕，列表就不动了，没有惯性效果。调查原因，发现应该是与 ScrollView 的有关。  
&emsp;&emsp;在网上找了找解决方案，有人说把 targetSDK 改成 21 可以解决问题，但是并不好用。  
解决：  
&emsp;&emsp;为 recyclerView 设置禁止嵌套滑动
```java
setNestedScrollingEnabled(false);  
```

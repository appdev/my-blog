---
title: "解决RecyclerView嵌套ScollView5.0以上失去惯性"
slug: "solving-inertia-loss-above-recyclerview-nested-scollview50"
date: 2018-07-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "&emsp;&emsp;项目中发现，RecyclerView在5.0以上版本滑动不流畅,滑动的手指一离开屏幕，列表就不动了，没有惯性效果。调"

---
                
&emsp;&emsp;项目中发现，RecyclerView在5.0以上版本滑动不流畅,滑动的手指一离开屏幕，列表就不动了，没有惯性效果。调查原因，发现应该是与ScrollView的有关。  
&emsp;&emsp;在网上找了找解决方案，有人说把targetSDK改成21可以解决问题，但是并不好用。  

解决：  
&emsp;&emsp;为recyclerView设置禁止嵌套滑动
```java
setNestedScrollingEnabled(false);  
```

---
title: "tools:context=“.MainActivity”的作用"
slug: "the-role-of-toolscontext-mainactivity"
date: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
```xml
<TextView    
        android:layout_width=“wrap_content”    
        android:layout_height=“wrap_content”    
        android:layout_centerHorizontal=“true”    
        android:layout_centerVertical=“true”    
        android:text=“@string/hello_world”    
        tools:context=“.MainActivity” />  
```
一直对于 tools:context=”.MainActivity”这句不懂，今天查了下，发现是这样的：

tools:context=”activity name”这一句不会被打包进APK。只是ADT的Layout Editor在你当前的Layout文件里面设置对应的渲染上下文，说明你当前的Layout所在的渲染上下文是activity name对应的那个activity，如果这个activity在manifest文件中设置了Theme，那么ADT的Layout Editor会根据这个Theme来渲染你当前的Layout。就是说如果你设置的MainActivity设置了一个Theme.Light（其他的也可以），那么你在可视化布局管理器里面看到的背景阿控件阿什么的就应该是Theme.Light的样子。仅用于给你看所见即所得的效果而已。
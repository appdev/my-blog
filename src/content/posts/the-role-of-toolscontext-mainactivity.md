---
title: "tools:context=“.MainActivity”的作用"
slug: "the-role-of-toolscontext-mainactivity"
published: 2018-07-01T17:16:07+08:00
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
tools:context=”activity name”这一句不会被打包进 APK。只是 ADT 的 Layout Editor 在你当前的 Layout 文件里面设置对应的渲染上下文，说明你当前的 Layout 所在的渲染上下文是 activity name 对应的那个 activity，如果这个 activity 在 manifest 文件中设置了 Theme，那么 ADT 的 Layout Editor 会根据这个 Theme 来渲染你当前的 Layout。就是说如果你设置的 MainActivity 设置了一个 Theme.Light（其他的也可以），那么你在可视化布局管理器里面看到的背景阿控件阿什么的就应该是 Theme.Light 的样子。仅用于给你看所见即所得的效果而已。
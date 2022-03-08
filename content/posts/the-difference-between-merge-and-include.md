---
title: "merge和include的区别"
slug: "the-difference-between-merge-and-include"
date: 2018-07-02T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
merge和include的区别是
```xml
<merge xmlns:android="http://schemas.android.com/apk/res/android"  
    android:layout_width="match_parent"  
    android:layout_height="match_parent" >  
  
    <LinearLayout  
        android:id="@+id/view_content"  
        android:layout_width="match_parent"  
        android:layout_height="100dp"  
        android:background="#4169E1"  
        android:orientation="horizontal" >  
    </LinearLayout>  

<!--more-->

    <RelativeLayout  
        android:id="@+id/view_todo"  
        android:layout_width="100dp"  
        android:layout_height="match_parent"  
        android:background="#800080" >  
    </RelativeLayout>  
</merge>  
```
引用必须是这样的：
==View v = inflater.inflate(R.layout.el_marge, itemGroup, true);  ==
 否则报错：`<merge /> can be used only with a valid ViewGroup root and attachToRoot=true`
 也就是说：merge是为了减少include里的根ViewGroup，那么inflate的marge必须放到ViewGroup中。
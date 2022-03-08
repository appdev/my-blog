---
title: "ButterKnife和dagger2同时引用的小问题"
slug: "Small-problems-cited-by-ButterKnife-and-dagger2-at-the-same-time"
date: 2018-07-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "同时使用parceler、butterknife和dagger2这几个库时，可能是因为都用到了annotation，gradle报错：Er"

---
                
同时使用parceler、butterknife和dagger2这几个库时，可能是因为都用到了annotation，gradle报错：
```java
Error:Execution failed for task ':app:transformResourcesWithMergeJavaResForDebug'.
> com.android.build.api.transform.TransformException: com.android.builder.packaging.DuplicateFileException: Duplicate files copied in APK META-INF/services/javax.annotation.processing.Processor
    File1: /Volumes/Android/gradle/gradle/caches/modules-2/files-2.1/com.google.dagger/dagger-compiler/2.0.2/1170f75c1ce293f80755bbc9fcd60e0765022bd0/dagger-compiler-2.0.2.jar
    File2: /Volumes/Android/gradle/gradle/caches/modules-2/files-2.1/com.jakewharton/butterknife/7.0.1/d5d13ea991eab0252e3710e5df3d6a9d4b21d461/butterknife-7.0.1.jar
```
解决方法：
```java
packagingOptions {
        exclude 'META-INF/services/javax.annotation.processing.Processor' // butterknife
    }
```
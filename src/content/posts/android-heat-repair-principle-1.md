---
title: "Android热修复——原理"
slug: "android-heat-repair-principle-1"
published: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
### 1.是用场景    
&emsp;&emsp;当一个应用上线发布首，突然发现了一个 bug 需要进行修复，如果真个 bug 不是严重，或者可以通过服务端进行避免还好说。但是如果这个 bug 很严重，影响了主功能，必须更新才行，那重新打包，重新上传市场和渠道（近百的渠道）。这些还不是主要问题，用户刚刚升级现在又提示升级大大影响了用户体验。
<!--more-->
### 2.解决方案：
&emsp;&emsp;java 的 JVM 中加载类的都是 `ClassLoader`这个类，查看`ClassLoader` 这个类的源代码：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268210240a01f6a2c2c5b237a032db35b7084.png)
可以看到在 `ClassLoader` 中会先检查这个类是不是已经被 loaded 过，没有的话则去他的 parent 去找，如此递归。  
再来看看 Android 的类加载器 `BaseDexClassLoader` 它继承自`ClassLoader`,位置在：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726821421954905ce06782ca5f696a3888498c.png)  
它的子类有两个 `PathClassLoader` 和`DexClassLoader`。  
先来看 `PathClassLoader` 的官方文档的注释 [源代码在这里](https://android.googlesource.com/platform/libcore-snapshot/+/ics-mr1/dalvik/src/main/java/dalvik/system/PathClassLoader.java)：
> Provides a simple {@link ClassLoader} implementation that operates on a list
  of files and directories in the local file system, but does not attempt to
  load classes from the network. Android uses this class for its system class
  loader and for its application class loader(s).
从这里（`uses this class for its system class
  loader and for its application class loader(s).`）可以看出 Android 是使用这个类作为其系统和应用的加载器。并且对于这个类，它只能去加载已经安装到 Android 系统中的 apk 文件。
再来看 `DexClassLoader` 的官方文档的注释 [源代码在这里](http://developer.android.com/reference/dalvik/system/DexClassLoader.html#DexClassLoader(java.lang.String, java.lang.String, java.lang.String, java.lang.ClassLoader))，这个类中只有一个方法 DexClassLoader 说明如下： 
> A class loader that loads classes from .jar and .apk files containing a classes.dex entry. This can be used to execute code not installed as part of an application.  
> This class loader requires an application-private, writable directory to cache optimized classes. Use Context.getCodeCacheDir() to create such a directory:
从这里（`This can be used to execute code not installed as part of an application.`）可以看出他可以从.jar 和.apk 类型的文件内部加载 classes.dex 文件。可以用来执行非安装的程序代码。
看到这里应该已经明白 Android 使用 PathClassLoader 作为其 app 的加载器，DexClassLoader 则可以从.jar 和.apk 类型的文件内部加载 classes.dex 文件。
### 3.代码分析  
`DexClassLoader` 中只有个简单的方法，所以来看它的基类的 BaseDexClassLoader [源代码](https://android.googlesource.com/platform/libcore-snapshot/+/ics-mr1/dalvik/src/main/java/dalvik/system/BaseDexClassLoader.java),可以看到有一个方法 findClass，这个方法中一个 pathList 对象，所有的类都从 pathList 查找
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/164672682175491d63e48f8ad9ae7c93f4e7a5b190.png)
查看 `pathList`[这个对象的源码](https://android.googlesource.com/platform/libcore-snapshot/+/ics-mr1/dalvik/src/main/java/dalvik/system/DexPathList.java):  
从源代码中可以看到，这个类中存在一个对象 dexElements，他是一个 Element 数组。Element 是 DexPathList 的静态内部类。关于 Element 的注释已已经说的很清楚了：
`Element of the dex/resource file path`，再来看看这个方法 makeDexElements：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268221308e1a0a0cdf6a4d6a1f844306327aa.png)
从这个方法可以看到，系统会先对文件进行遍历分类，然后将分类后的文件添加到 elements 这个 ArrayList 中，最后将 ArrayList 转为数组。  
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726823479b397bf35715a45fc3999b01ed5a7d.png)
这个就是在 BaseDexClassLoader 中调用到的 findClass 方法，这个方法返回一个 Class，它通过类名进行加载，内部是遍历上面的 Element 数组。
### 4.基本步骤
经过上面一大段的分析，应该已经大致的实现线步骤了：  
1.将需要修复的类单独达到为一个独立的 dex 文件。
2.在程序启动的时候加载这个 dex 文件。
3.将加载到的 dex 文件放入 DexPathList 中 Element[] 的第一个元素。
经过分析可以知道，当 findClass 的时候会遍历 Element[]，由于我们的 dex 是第一个元素，这样的话，当遍历 findClass 的时候，我们修复的类就会被查找到，从而替代有 bug 的类。  
这样，基本达到了修复的目的，在接下来的文章中，将介绍如何将上面的步骤通过代码实现。
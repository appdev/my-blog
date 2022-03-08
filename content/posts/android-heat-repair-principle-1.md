---
title: "Android热修复——原理"
slug: "android-heat-repair-principle-1"
date: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
cover: 
    image: "https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268210240a01f6a2c2c5b237a032db35b7084.png"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
### 1.是用场景    

&emsp;&emsp;当一个应用上线发布首，突然发现了一个bug需要进行修复，如果真个bug不是严重，或者可以通过服务端进行避免还好说。但是如果这个bug很严重，影响了主功能，必须更新才行，那重新打包，重新上传市场和渠道（近百的渠道）。这些还不是主要问题，用户刚刚升级现在又提示升级大大影响了用户体验。


<!--more-->


### 2.解决方案：

&emsp;&emsp;java的JVM中加载类的都是`ClassLoader`这个类，查看`ClassLoader`这个类的源代码：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268210240a01f6a2c2c5b237a032db35b7084.png)
可以看到在`ClassLoader`中会先检查这个类是不是已经被 loaded 过，没有的话则去他的 parent 去找，如此递归。  

再来看看Android的类加载器`BaseDexClassLoader`它继承自`ClassLoader`,位置在：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726821421954905ce06782ca5f696a3888498c.png)  

它的子类有两个`PathClassLoader`和`DexClassLoader`。  

先来看`PathClassLoader` 的官方文档的注释 [源代码在这里](https://android.googlesource.com/platform/libcore-snapshot/+/ics-mr1/dalvik/src/main/java/dalvik/system/PathClassLoader.java)：
> Provides a simple {@link ClassLoader} implementation that operates on a list
  of files and directories in the local file system, but does not attempt to
  load classes from the network. Android uses this class for its system class
  loader and for its application class loader(s).

从这里（`uses this class for its system class
  loader and for its application class loader(s).`）可以看出Android是使用这个类作为其系统和应用的加载器。并且对于这个类，它只能去加载已经安装到Android系统中的apk文件。

再来看`DexClassLoader` 的官方文档的注释 [源代码在这里](http://developer.android.com/reference/dalvik/system/DexClassLoader.html#DexClassLoader(java.lang.String, java.lang.String, java.lang.String, java.lang.ClassLoader))，这个类中只有一个方法DexClassLoader说明如下： 
> A class loader that loads classes from .jar and .apk files containing a classes.dex entry. This can be used to execute code not installed as part of an application.  

> This class loader requires an application-private, writable directory to cache optimized classes. Use Context.getCodeCacheDir() to create such a directory:

从这里（`This can be used to execute code not installed as part of an application.`）可以看出他可以从.jar和.apk类型的文件内部加载classes.dex文件。可以用来执行非安装的程序代码。

看到这里应该已经明白Android使用PathClassLoader作为其app的加载器，DexClassLoader则可以从.jar和.apk类型的文件内部加载classes.dex文件。

### 3.代码分析  

`DexClassLoader`中只有个简单的方法，所以来看它的基类的BaseDexClassLoader [源代码](https://android.googlesource.com/platform/libcore-snapshot/+/ics-mr1/dalvik/src/main/java/dalvik/system/BaseDexClassLoader.java),可以看到有一个方法findClass，这个方法中一个pathList对象，所有的类都从pathList查找
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/164672682175491d63e48f8ad9ae7c93f4e7a5b190.png)

查看`pathList`[这个对象的源码](https://android.googlesource.com/platform/libcore-snapshot/+/ics-mr1/dalvik/src/main/java/dalvik/system/DexPathList.java):  
从源代码中可以看到，这个类中存在一个对象dexElements，他是一个Element数组。Element是DexPathList的静态内部类。关于Element的注释已已经说的很清楚了：
`Element of the dex/resource file path`，再来看看这个方法makeDexElements：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268221308e1a0a0cdf6a4d6a1f844306327aa.png)
从这个方法可以看到，系统会先对文件进行遍历分类，然后将分类后的文件添加到elements这个ArrayList中，最后将ArrayList转为数组。  
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726823479b397bf35715a45fc3999b01ed5a7d.png)
这个就是在BaseDexClassLoader中调用到的findClass方法，这个方法返回一个Class，它通过类名进行加载，内部是遍历上面的Element数组。


### 4.基本步骤

经过上面一大段的分析，应该已经大致的实现线步骤了：  
1.将需要修复的类单独达到为一个独立的dex文件。
2.在程序启动的时候加载这个dex文件。
3.将加载到的dex文件放入DexPathList中Element[]的第一个元素。

经过分析可以知道，当findClass的时候会遍历Element[]，由于我们的dex是第一个元素，这样的话，当遍历findClass的时候，我们修复的类就会被查找到，从而替代有bug的类。  

这样，基本达到了修复的目的，在接下来的文章中，将介绍如何将上面的步骤通过代码实现。
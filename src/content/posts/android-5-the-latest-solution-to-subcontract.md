---
title: "Android 5.0一下分包最新解决办法"
slug: "android-5-the-latest-solution-to-subcontract"
published: 2018-08-29T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
建议参照 [最新官方提供的分包方式](https://developer.android.com/studio/build/multidex#mdex-gradle) (科学上网) 进行分包，具体配置方式在 `multiDexKeepProguard` 属性下
第一步、新建文件
app Module 下，新建一个名为 `multidex-config.pro` 的文件
文件内具体内容实例：
```
-keep class me.passin.pmvp.app.GlobalConfiguration
```
即想把哪个类分在主 Dex 则 -keep class 类名。
如果您想要指定包中的所有类，文件将如下所示：
```
-keep class com.example.** { *; }
```
第二步、App 模块的 build.gradle 添加配置参数
```
android {
    buildTypes{
        release{
            multiDexKeepProguard file('multidex-config.pro')
        }
    }
}
```

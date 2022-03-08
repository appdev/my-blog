---
title: "在非主module中引用aar的问题"
slug: "the-problem-of-referring-to-aar-in-android-studio-module"
date: 2019-02-18T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "引用aar的方法把aar文件放到libs目录下面，并且在对应的module项目下面build.gralde中添加如下配置:"

---
                
引用aar的方法

把aar文件放到 libs 目录下面，并且在对应的 module 项目下面 build.gralde 中添加如下配置:
```java
 repositories {
    flatDir {
        dirs 'libs'
    }


dependencies {
    // 其中aar-file-name不用文件后缀名
    compile(name: 'aar-file-name', ext: 'aar')  
}
```
编译提示:
```
Error:Unable to resolve dependency for ':app@debug/compileClasspath': Could not find :XXXX:.
```
解决:
在主（一般就是app）module下同样配置aar的目录
```java
/**子模块含有aar*/
    repositories {
        flatDir {
            dirs 'libs','../yourmodule/libs' //aar所在的路径
        }
    }
```
同样 在其他module下如果需要使用这个aar，同样需要配置路径
这种方式最方便，但是在使用和查阅起来也不是很清晰。

---

将aar作为module使用。
具体做法，打开Project Structure(`CMD+;` 或者 `ctrl+;`)选择添加新的module然后选择import aar/jar
![QQ20190218-131402.png][1]
然后在需要的module这种引入即可。在主module中不需要在申明路径

推荐使用这种方式,简单、清晰。同时避免了aar终不能引入第三方lib的问题。

  [1]: https://static.apkdv.com/usr/uploads/2019/02/1542228624.png#mirages-width=1007&mirages-height=690&mirages-cdn-type=2
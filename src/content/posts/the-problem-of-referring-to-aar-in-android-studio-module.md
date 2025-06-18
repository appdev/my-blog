---
title: "在非主module中引用aar的问题"
slug: "the-problem-of-referring-to-aar-in-android-studio-module"
published: 2019-02-18T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
引用 aar 的方法
把 aar 文件放到 libs 目录下面，并且在对应的 module 项目下面 build.gralde 中添加如下配置:
```java
 repositories {
    flatDir {
        dirs 'libs'
    }
dependencies {
    // 其中 aar-file-name 不用文件后缀名
    compile(name: 'aar-file-name', ext: 'aar')  
}
```
编译提示:
```
Error:Unable to resolve dependency for ':app@debug/compileClasspath': Could not find :XXXX:.
```
解决:
在主（一般就是 app）module 下同样配置 aar 的目录
```java
/**子模块含有 aar*/
    repositories {
        flatDir {
            dirs 'libs','../yourmodule/libs' //aar 所在的路径
        }
    }
```
同样 在其他 module 下如果需要使用这个 aar，同样需要配置路径
这种方式最方便，但是在使用和查阅起来也不是很清晰。
---
将 aar 作为 module 使用。
具体做法，打开 Project Structure(`CMD+;` 或者 `ctrl+;`) 选择添加新的 module 然后选择 import aar/jar
然后在需要的 module 这种引入即可。在主 module 中不需要在申明路径
推荐使用这种方式，简单、清晰。同时避免了 aar 终不能引入第三方 lib 的问题。

---
title: "Gradle自定义你的BuildConfig"
slug: "gradle-customize-your-buildconfig"
published: 2018-07-02T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
### BuildConfig.DEBUG  
首先在 Gradle 脚本中默认的 debug 和 release 两种模式 BuildCondig.DEBUG 字段分别为 true 和 false，而且不可更改。该字段编译后自动生成，在 Studio 中生成的
<!--more-->
目录在 app/build/source/BuildConfig/Build Varients/package name/BuildConfig 文件下。release 模式下该文件的内容：
```java
public final class BuildConfig {
public static final boolean DEBUG = false;
public static final String APPLICATION_ID = “com.storm.9gag”;
public static final String BUILD_TYPE = “release”;
public static final String FLAVOR = “wandoujia”;
public static final int VERSION_CODE = 1;
public static final String VERSION_NAME = “1.0”;
// Fields from build type: release
public static final boolean LOG_DEBUG = false;
}
```
### 自定义 BuildConfig 字段
大家看到上述内容的时候发现莫名的有个 LOG_DEBUG 字段，这个完全是我自定义的一个字段，我来用它控制 Log 的输出，而没有选择用默认的 DEBUG 字段。举例一
个场景，我们在 App 开发用到的 api 环境假设可能会有测试、正式环境，我们不可能所有的控制都通过 DEBUG 字段来控制，而且有时候环境复杂可能还会有两个以
上的环境，这个时候就用到了 Gradle 提供了自定义 BuildConfig 字段，我们在程序中通过这个字段就可以配置我们不同的开发环境。
语法很简单：
`buildConfigField“boolean”, “API_ENV”, “true”`
上述语法就定义了一个 boolean 类型的 API_ENV 字段，值为 true，之后我们就可以在程序中使用 BuildConfig.API_ENV 字段来判断我们所处的 api 环境。例如:
```java
public class BooheeClient {
public static final boolean DEBUG = BuildConfig.API_ENV;
public static String getHost {
if (DEBUG) {
return“your qa host”;
}
return“your production host”;
}
}
```
不仅如此，如果遇到复杂的环境，你也可能自定义一个 String 类型的字段，这种方式免去了发布之前手动更改环境的麻烦，减少出错的可能性，只需要在
Gradle 配置好 debug、release 等模式下的环境就好了，打包的之后毫无顾虑。
使用方法很简单，大家如果有问题或者疑问可以直接博客留言。
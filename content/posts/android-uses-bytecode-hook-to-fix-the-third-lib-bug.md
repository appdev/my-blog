---
title: "Android  使用字节码 hook 修复第三发 bug"
slug: "android-uses-bytecode-hook-to-fix-the-third-lib-bug"
date: 2021-11-09T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
今天分享一下如何简单方便的实现代码插装~

### 修复第三方 bug

事情是这样的，大概在上个月，公司的 Android 项目使用了一个阿里云提供的功能（真就独一份）。因为开发测试机一直是 wifi 情况下使用，完全正常，再快上线前在使用流量的情况下会崩溃。
最后发现是阿里的这个 SDK 使用的网络判断方法还是旧版本的方式(使用了`getActiveNetworkInfo`，该方法已经废弃)，在`targetSdkVersion`30 的时候回直接崩溃。询问了阿里客服，答复是下周修复，我们肯定是等不到了。（事实是现在也没修复）

#### 如何修复是个问题

上线时间已经确定了，不可能等第三方修复了。只能自己想办法：
比如我们有这么段代码


```
public class Utils {

    public static void evil() {
        int a = 1 / 0;
    }

}
```

我们项目在打包的时候经历了：`.java -> .class -> dex -> apk`，假设我们在打包的时候这么做 `.java -> .class -> 拿到 Utils.class，修正里面的方法 evil 方法 -> dex -> apk`。这个时机，其实构建过程中也给我们提供了，也就是传说的 Transform 阶段。（类似的 arouter、butterknife 都是同样的原理实现代码插装的）

如何修改 Utils.class 呢？可以看看鸿阳大神的 [ ASM 修改字节码，这样学就对了！](https://juejin.cn/post/6999646242125529096)

### 轻量级 aop 框架 lancet 出现

饿了么，很早的时候就开源了一个框架，叫[lancet](https://github.com/eleme/lancet)。

这个框架可以支持你，在不懂字节码的情况下，也能够完成对对应方法字节码的修改。

代入到我们刚才的思路：

`.java -> .class -> lancet 拿到 Utils.class，修正里面的方法 evil 方法 -> dex -> apk`

#### 引入框架

在项目的根目录添加：

```

classpath 'me.ele:lancet-plugin:1.0.6'

```
在 module 的 build.gradle 添加依赖和 apply plugin：
```

apply plugin: 'me.ele.lancet'

dependencies {
implementation 'me.ele:lancet-base:1.0.6'
}

```


#### 开始使用

然后，我们做一件事情，把 Tools 里面的 evil 方法：

```
public static void evil() {
    int a = 1 / 0;
}
```
里面的这个代码给去掉，让它变成空方法。

我们编写代码：

```
public class ToolsLancet {

    @TargetClass("com.aokdv.Utils")
    @Insert("evil")
    public static void evil() {

    }

}
```

我们编写一个新的方法，保证其是个空方法，这样就完成让原有的 evil 中调用没有了。

其中：

* TargetClass 注解：标识你要修改的类名；
* Insert 注解：表示你要往 evil 这个方法里面注入下面的代码
* 下面的方法声明需要和原方法保持一致，如果有参数，参数也要保持一致（方法名、参数名不需要一致）

然后我们打包，看看背后发生了什么神奇的事情。

在打包完成后，我们反编译，看看 Utils.class

```
public class Utils {	
   //... 
    public static void evil() {
        Utils._lancet.com_apkdv_UtilsLancet_evil();
    }

    private static void evil$___twin___() {
        int a = 1 / 0;
    }

    private static class _lancet {
        private _lancet() {
        }

        @TargetClass("com.apkdv.Utils")
        @Insert("evil")
        static void com_apkdv_UtilsLancet_evil() {
        }
    }
}
```

可以看到，原本的 evil 方法中的校验，被换成了一个生成的方法调用，而这个生成的方法和我们编写的非常类似，并且其为空方法。

而原来的 evil 逻辑，放在一个 `evil$___twin___()` 方法中，可惜这个方法没地方调用。

这样原有的 evil 逻辑就变成了一个空方法了。

我们可以大致梳理下原理：

lancet 会将我们注明需要修改的方法调用中转到一个临时方法中，这个临时方法你可以理解为和我们编写的方法逻辑基本保持一致。

然后将该方法的原逻辑也提取到一个新方法中，以备使用。
很多时候，可能原有逻辑只是个概率很低的问题，比如发送请求，只有在超时等情况才发生错误，你不能粗暴的把人家逻辑移除了，你可能更想加个 try-catch 然后给个提示什么的。

这个时候你可以这么改：

```
public class ToolsLancet {

    @TargetClass("com.aokdv.Utils")
    @Insert("evil")
    public static void evil() {
        try {
            Origin.callVoid();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

我们再来看下反编译代码：

```
public class Tools {

    public static void evil() {
        Tools._lancet.com_apkdv_UtilsLancet_evil();
    }

    private static void evil$___twin___() {
        int a = 1 / 0;
    }

    private static class _lancet {
        @TargetClass("com.aokdv.Utils")
        @Insert("evil")
        static void com_apkdv_UtilsLancet_evil() {
            try {
                Tools.evil$___twin___();
            } catch (Exception var1) {
                var1.printStackTrace();
            }

        }
    }
}
```

中转方法内部调用了原有方法，然后外层包了个 try-catch。相对于运行时反射相关的 hook 更加稳定，其实他就像你写的代码，只不过是直接改的 class。

### hook 系统方法

某天群里摸鱼的时候，有人问以前项目的 log 全部用的是系统的，`Log` 现在快发版了，有办法全部关闭吗？，

这不就是同样的功能吗？开始编码：

```
@Proxy("d")
    @TargetClass("android.util.Log")
    public static int anyName(String tag, String msg) {
        return LogUtils.d(tag, msg);
    }
```

我们使用 `@Proxy`代理了系统方法,这样我们就代理了 系统的 `Log.d`方法

### 收工

其实字节码 hook 在 Android 开发过程中更为强大，比我们传统的找 Hook 点（单例，静态变量），然后反射的方式方便太多了，还有个最大的优势就是稳定。

当然 lancet hook 有个前提就是要明确知道方法调用，如果你想 hook 一个类的所有调用，那么写起来就有点费劲了，可能并不如动态代理那么方便。




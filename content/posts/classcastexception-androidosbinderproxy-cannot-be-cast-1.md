---
title: "ClassCastException: android.os.BinderProxy cannot be cast"
slug: "classcastexception-androidosbinderproxy-cannot-be-cast-1"
date: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "在使用bindService时遇到这个问题，反复对比网上的别人的代码，没有任何问题，直接把网上的代码复制到我的项目里也没有人任何问题，但是"

---
                
在使用bindService时遇到这个问题，反复对比网上的别人的代码，没有任何问题，直接把网上的代码复制到我的项目里也没有人任何问题，但是

直接使用我的Service就有问题，提示


<!--more-->


```java
03-27 13:16:36.873  10403-10403/com.sample.android:bdservice_v1 E/AndroidRuntime﹕ FATAL EXCEPTION: main
    java.lang.ClassCastException: android.os.BinderProxy cannot be cast to com.octo.android.robospice.SpiceService$SpiceServiceBinder
            at com.octo.android.robospice.SpiceManager$SpiceServiceConnection.onServiceConnected(SpiceManager.java:1084)
            at android.app.LoadedApk$ServiceDispatcher.doConnected(LoadedApk.java:1131)
            at android.app.LoadedApk$ServiceDispatcher$RunConnection.run(LoadedApk.java:1148)
            at android.os.Handler.handleCallback(Handler.java:725)
            at android.os.Handler.dispatchMessage(Handler.java:92)
            at android.os.Looper.loop(Looper.java:153)
            at android.app.ActivityThread.main(ActivityThread.java:5297)
            at java.lang.reflect.Method.invokeNative(Native Method)
            at java.lang.reflect.Method.invoke(Method.java:511)
            at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:833)
            at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:600)
            at de.robv.android.xposed.XposedBridge.main(XposedBridge.java:126)
            at dalvik.system.NativeStart.main(Native Method)
```

搜了半天，在Stack Overflow找到答案

原文：

I know it’s old, but thought I’d answer as I’ve just solved this myself. This (for me) is due to having android:process in my Service declaration of the application manifest. Simply removing that solved my issue immediately.

大意是在manifest里加了 android:process时Service运行在另外的进程中，想起了之前为了让servic保持存活，所以将service运行在了独立的进程，去掉后 android:process 就正常了！如果想跨进程通信 只能用广播，或者AIDL了
---
title: "Connection with adb was interrupted.解决办法"
slug: "connection-with-adb-was-interrupted-solution"
published: 2018-06-27T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
```java
[2012-10-16 10:49:35 – My First App]
[2012-10-16 10:49:35 – My First App] Android Launch!
[2012-10-16 10:49:35 – My First App] Connection with adb was interrupted.
[2012-10-16 10:49:35 – My First App] 0 attempts have been made to reconnect.
[2012-10-16 10:49:35 – My First App] You may want to manually restart adb from the Devices view.
```
<!--more-->
出现上述错误，解决办法，手动打开 AVD，运行相关的 AVD 设备即可。
```java
[2012-10-16 10:52:59 – My First App] ——————————
[2012-10-16 10:52:59 – My First App] Android Launch!
[2012-10-16 10:52:59 – My First App] adb is running normally.
[2012-10-16 10:52:59 – My First App] Performing com.androidapp.my.first.app.MainActivity activity launch
[2012-10-16 10:52:59 – My First App] Automatic Target Mode: using existing emulator’emulator-5554′ running compatible AVD‘Android2.2′
[2012-10-16 10:52:59 – My First App] Uploading My First App.apk onto device’emulator-5554′
[2012-10-16 10:53:01 – My First App] Installing My First App.apk…
[2012-10-16 10:53:06 – My First App] Success!
[2012-10-16 10:53:06 – My First App] Starting activity com.androidapp.my.first.app.MainActivity on device emulator-5554
[2012-10-16 10:53:08 – My First App] ActivityManager: Starting: Intent { act=android.intent.action.MAIN cat=[android.intent.category.LAUNCHER] cmp=com.androidapp.my.first.app/.MainActivity }
```

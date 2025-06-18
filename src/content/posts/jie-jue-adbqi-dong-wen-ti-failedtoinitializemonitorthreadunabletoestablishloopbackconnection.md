---
title: "解决ADB启动问题(Failed to initialize Monitor Thread: Unable to establish loopback connection)"
slug: "jie-jue-adbqi-dong-wen-ti-failedtoinitializemonitorthreadunabletoestablishloopbackconnection"
published: 2018-06-27T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
问题
```
Failed to initialize Monitor Thread: Unable to establish loopback connection
ADB server didn’t ACK
failed to start daemon *
```
<!--more-->
解决办法：
dos 下进入 SDK 目录下的 tools 目录，执行以下命令：
```
adb kill-server
adb start-server
```
如果还有这个问题，请关闭你的防火墙，OK！
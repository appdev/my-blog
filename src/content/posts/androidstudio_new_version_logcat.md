---
title: "AndroidStudio新版本Logcat"
slug: "androidstudio_new_version_logcat"
published: 2022-03-22T16:34:12+08:00
categories: [Android]
tags: [AndroidStudio]
showToc: true
TocOpen: true
draft: false
---
我一直使用的是预览版的 AndroidStudio，今天更新到 2021.3.1 Canary 6，发现 logcat 变样子了。
现在是这个样子了。
![16_mjBqws](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/2022_03_22/16_mjBqws.png)
嗯，就是这样子，外观到是好看多了，不过对于使用习惯的我们还是需要适应下，过滤还是可以的，就是你要显示自己应用时候不想之前那样可以选择了
需要你 使用正则过滤 `package:mine`，当然你默认安装时候这里就会这样显示了，mine 就是当前安装的应用，你也可以指定自己的包名的应用进行过滤。如果你想在增加其他过滤的表达式，增加一个空格在输入就可以，例如过滤 Debug 可以输入`package:mine level:DEBUG`
大家可以注意下左边的工具栏，方便我们配置查询日志信息。
一次往下说明下；
清空日志
新版本的 Logcat 你在日志面板右键没有 clear 了，只有 close，所以点击这个按钮清空吧
自动滑动到日志面板的最新的日志记录位置
自动折行，就是日志一屏展示，超过的折行显示，其实这个感觉没啥用，我不喜欢折行看
第 4 个比较常用  
![16_5WgMNi](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/2022_03_22/16_mjBqws.png)
如图，有几个选项，Standard View 就是默认的展示包含了所有的信息，时间，包名，类名，进程 ID 等
Compact View 这个模式比较不多，日志值显示时间，日志级别，具体信息
00:53:25.837 W maxLineHeight should not be -1. maxLines:1 lineCount:1
Custom View，自己配置
5 左边剩下的大家都常用就不说了
希望可以帮助大家。。。。。

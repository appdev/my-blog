---
title: "android金币掉落动画"
slug: "gold-coin-drop-animation"
published: 2018-07-02T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
手机截图不是很流畅实际使用会流畅很多
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268093899a4e68488147a361365d6fa77d916.gif)
声音文件保存在/res/raw 中，可以自己替换
使用方法
使用 PopupWindow 来弹出 主题布局和文字都可以很方便的修改 直接调用
```java
showPopWindows(View, 现实的金币数);
showPopWindows(imUserHead2, "20");
```
github 地址：https://github.com/huclengyue/GoldDemo

---
title: "android金币掉落动画"
slug: "gold-coin-drop-animation"
date: 2018-07-02T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "手机截图不是很流畅实际使用会流畅很多声音文件保存在/res/raw中，可以自己替换使用方法使用PopupWindow来弹出主题布局"
cover: 
    image: "https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268093899a4e68488147a361365d6fa77d916.gif"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
手机截图不是很流畅实际使用会流畅很多
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268093899a4e68488147a361365d6fa77d916.gif)

声音文件保存在/res/raw 中，可以自己替换

使用方法

使用PopupWindow来弹出 主题布局和文字都可以很方便的修改 直接调用
```java
showPopWindows(View, 现实的金币数);
showPopWindows(imUserHead2, "20");
```
github 地址：https://github.com/huclengyue/GoldDemo

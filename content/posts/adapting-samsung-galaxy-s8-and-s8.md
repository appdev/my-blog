---
title: "适配三星Galaxy S8及S8+"
slug: "adapting-samsung-galaxy-s8-and-s8"
date: 2018-08-14T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

cover: 
    image: "https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726847420894ba9c34f8370b95a7d7e10e627d.jpg"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
高达84%的屏幕占比为Galaxy S8及S8+在游戏娱乐、观看视频时带来深度沉浸式视觉体验。但是与此同时S8却有着一个奇葩的屏幕比例：18.5比9，屏幕分辨率：2960×1440。通常我们在开发过程中android的标准设计图为1920×1080，ios为1334×750，默认采用16比9的比例来设计效果图。

这是未适配的网易新闻  

![](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726847420894ba9c34f8370b95a7d7e10e627d.jpg)

其实解决APP显示问题，除了第三方应用自行适配S8之外，S8自己也可以进行调节，S8有一个功能叫做“全屏应用程序”  

打开全屏应用之后，效果显而易见：

![](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726847864cabf626bbb375ab93ce5247ef8869.jpg)

下面我们以开发者的身份去分析下这个问题，究其根本这个适配不过是个显示的问题，我们只需要让APP充满全屏就可以，所以我做了如下尝试：

> 1：给Activity设置各种noTitlebar，FullScreen，不起作用；
2：替换各种style样式，不起作用；
3：修改targetSdkVersion， compileSdkVersion为高版本，依然不起作用。


通过观察发现，凡是完美适配了18.5比9屏幕的App，在系统中已经默认是全屏应用程序了，选择框灰掉无法点击。

![](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726848243f40d7d3e57426334566bd32fa3c5c.jpg)

而没有做好适配的App默认是没有打开全屏应用的，用户可以自行随意选择打开或者关闭

![](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/164672684853378e05bb0bcd0898a7f25790c749ed.jpg)
  

所以判断系统应该是通过检测某个属性或者权限来区分当前App是否做好了适配。最后我们找到了"android.max_aspect"这个属性。


开发者只需在App的AndroidManifest.xml文件<application> </application>中添加如下代码：   
`<meta-data android:name="android.max_aspect" android:value="2.1" />`  
对只要这一行代码就搞定三星S8的适配，所以前面都是废话，你要的代码就这一行

Android 标准接口中，支持应用声明其支持的最大屏幕高宽比（maximum aspect ratio）。具体声明如下，其中的 ratio_float 被定义为是高除以宽，以16:9为例，ratio_float = 16/9 = 1.778 (18.5:9则为2.056)。


若开发者没有声明该属性，ratio_float 的默认值为1.86，小于2.056，因此这类应用在三星S8上，默认不会全屏显示，屏幕两边会留黑。
---
title: "Android P 跳过Gapps开机引导"
slug: "android-p-skip-gapps-boot-boot"
date: 2018-08-19T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
### Android P跳过Gapps开机引导

Android手机在刷了Gapps之后，在开机进入系统时会进入Gapps的开机引导（也就是设置Google帐号神马的）。但是这需要连Google进行验证，于是。。。。。。。。

对于这种情况，可以通过以下方法解决：

- 连Google进行验证
- 断网
- 顺时针点屏幕四角
- 更改`USER_SETUP_COMPLETE`和`DEVICE_PROVISIONED`

### 连Google进行验证
这个方法就不多说了，只要能连上Google，就不会卡在这里了。至于怎么连Google，请自行寻找科学上网。

### 断网
这个Gapps的开机引导是需要连网进行的，默认的情况下如果不连网的情况下是会自动跳过的。但是许多系统在默认情况下Wifi和数据是会自动打开，就算把卡取了，也还会有Wifi，一样无法跳过。对此，可选择先不刷Gapps，进入系统后将Wifi的数据关闭，再刷Gapps，此方法有一定弊端，有可能会导致Gapps某些应用发生某些玄学问题。。。。。

### 顺时针点屏幕四角
这可能是最玄学的一个方法了，据传连点屏幕四角就可跳过此引导（顺时针方向，从左上角开始）。但是！！！但是！！！这是检验血统的时刻，时灵时不灵。别问我是怎么知道的。 (╯‵□′)╯︵┻━┻

### 更改USER_SETUP_COMPLETE和DEVICE_PROVISIONED
敲黑板！！！ 这是我所试过最科学的方法。在开机情况下，将手机连上电脑，使用adb工具来修改USER_SETUP_COMPLETE和DEVICE_PROVISIONED的值。具体操作如下：

打开命令行，输入命令：
```shell
adb shell settings put secure user_setup_complete 1
adb shell settings put global device_provisioned 1
```
重启，搞定。

一般的类原生系统 ADB默认是打开的，及时没有进入系统，依旧可以通过ADB设置，手机官方系统一般ADB默认关闭的

注：
在WINDOWS下，如果未将adb.exe文件所在路径添加至环境变量中，则需要在adb.exe文件所在目录下打开命令行，而后将上述命令中的adb更改为./adb.exe。
上述命令运行错误时会有提示，而成功则没有。

---
title: "Flutter的需要与原生交互的一些常用库"
slug: "some-common-libraries-for-flutters-need-to-interact-with-native"
published: 2018-12-06T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
---
# Flutter 的需要与原生交互的一些常用库
**【说明】由于这些库一直在更新，请自己选择合适的稳定版本下载。**
----
## 谷歌官方的针对 Dart 语言的一些实用性的功能以及扩展的库 -- Quiver
Quiver 是一组针对 Dart 的实用程序库，它使使用许多 Dart 库变得更容易、更方便，或者增加了额外的功能。
github 地址  https://github.com/google/quiver-dart
使用方式：
```
dependencies:
  quiver: '>=2.0.0 <3.0.0'
```
----
## 根据 pubspec.yaml 中设置的目录模板自动向其中添加文件记录的脚本 `asset_generator`
好多人都说 Flutter 中的资源引用很头疼，手写很麻烦，最近找到了一个脚本刚好卡呀解决这个问题。
 **这个脚本的作用：利用 `asset_generator` 脚本生成 r.dart 资源文件，方便在代码中引用资源。**
github 地址：https://github.com/flutter-dev/asset_generator
使用方式：
```
1.下载 asset_generator.dart 脚本文件。
2.找到自己 Flutter 的安装目录，将脚本放在 Flutter 的根目录下。
```
#### :point_right:  另外关于 pubspec.yaml 文件，它很严格，很多人会写错，多一个或者少一个空格都会报错。刚好我找到了一个在线监测工具 https://www.bejson.com/validators/yaml/   把你的 yaml 文件复制进去 就可以自动帮你找出错误了。
----
## 常用开源包：
> 网络请求
库名 | 版本号 | 链接 | 描述
-|-|-|-
http|0.11.3+16|https://pub.dartlang.org/packages/http|该软件包包含一组高级函数和类，可以轻松使用 HTTP 资源。它与平台无关，可以在命令行和浏览器上使用。
dio|0.0.14|https://pub.dartlang.org/packages/dio|Dart 的一个强大的 Http 客户端，支持拦截器、全局配置、FormData、请求取消、文件下载、超时等。
http_multi_server|2.0.5|https://pub.dartlang.org/packages/http_multi_server|dart:io HttpServer 包装器，用于处理来自多个服务器的请求
----
> 类型编解码的库：
库名 | 版本号 | 链接 | 描述
-|-|-|-
html_unescape|1.0.0|https://pub.dartlang.org/packages/html_unescape|用于解决 HTML 编码字符串的 Dart 库。支持所有命名字符引用（如 `&nbsp;`），小数字符引用（如`&#225;`）和十六进制字符引用（如`&#xE3;`）。
gbk2utf8||https://github.com/jzoom/gbk2utf8|官方的 http 还不能支持中文 gbk 的解析，这个项目就是为了解决 gbk 转成 utf-8 编码的。
----
> 序列化
* 手动序列化：
使用 `dart:convert` 的内置解码器。包括传入 JSON 原始字符串给 JSON.decode() 方法，然后从 Map<String, dynamic> 中查询你需要的数据。
* 自动序列化：
库名 | 版本号 | 链接 | 描述
-|-|-|-
json_serializable|0.5.7|https://pub.dartlang.org/packages/json_serializable|
built_value|5.5.1|https://pub.dartlang.org/packages/built_value|runtime 依赖项
built_value_generator|5.5.1|https://pub.dartlang.org/packages/built_value_generator|dev 依赖项
built_value_test|5.5.1|https://pub.dartlang.org/packages/built_value_test|test 依赖项
----
> json 解析
库名 | 版本号 | 链接 | 描述
-|-|-|-
codable |1.0.0-beta.2|https://pub.dartlang.org/packages/codable|用于将动态结构化数据（JSON，YAML）转换为 Dart 类型的库。
* https://github.com/javiercbk/json_to_dart  根据 json 生成 Dart 实体类
* https://github.com/debuggerx01/JSONFormat4Flutter   这是一个 AS 的辅助插件，将 JSONObject 格式的 String 解析成 Dart 的实体类
* Dson 0.13.2 下载地址 https://pub.dartlang.org/packages/dson  
描述：Dson 的 github 地址 https://github.com/drails-dart/dson
DSON 是一个将 Dart 对象转换为 JSON 的库。(用于 web) 这个库是 Dartson 的一个分支，但又有不同。
* Dartson 是一个 Dart 库，可用于将 Dart 对象转换为 JSON 字符串。
https://github.com/eredo/dartson（用于 web）
* **几个 Json 库的比较：[https://github.com/drails-dart/dart-serialise](https://github.com/drails-dart/dart-serialise)**
|方式 |	大小 (js)	| 序列化 (dart)	| 反序列化 (dart)	| 序列化 (js)	| 反序列化 (js)|
|----|----|----|----|----|----|
|json_serializable|	80 KB	|9.09 ms	|6.61 ms|8.23 ms|8.12 ms|
|Serializable	|79 KB	|6.1 ms	|6.92 ms|4.37 ms|8.38 ms|
|DSON	|94 KB|12.72 ms	|11.15 ms	|16.64 ms	|17.94 ms|
|Dartson	|86 KB	|9.61 ms	|6.81 ms	|8.58 ms	|7.01 ms|
|Manual|	86 KB	|8.29 ms|	5.78 ms	|10.7 ms	|7.9 ms|
|Interop	|70 KB	|61.55 ms	|14.96 ms	|2.49 ms	|2.93 ms|
|Jaguar_serializer|	88 KB	|8.57 ms	|6.58 ms	|10.31 ms	|8.59 ms|
|Jackson (Groovy)	||	496 ms|	252 ms	|n/a|	n/a|
----
**编解码、加密解密有关的库**
库名 | 版本号 | 链接 | 描述
-|-|-|-
ninja |1.0.0|https://pub.dartlang.org/packages/ninja|在 Dart 的 Converter 和 Codec 接口上完善的 AES 以及 RSA 加密解密算法的库。
archive |2.0.0|https://pub.dartlang.org/packages/archive|为各种存档和压缩格式提供编码器和解码器，如 zip，tar，bzip2，gzip 和 zlib。（不知道移动端能否用得到，文档说服务端和 web 端可以用。）
----
> 系统平台有关的库：
库名 | 版本号 | 链接 | 描述
-|-|-|-
**分享（官方的库）**|||
share |0.5.2|https://pub.dartlang.org/packages/share|用于通过平台共享 UI 共享内容，使用 Android 上的 ACTION_SEND 意图和 iOS 上的 UIActivityViewController。
**获取本地文件**|||
path_provider|0.4.1|https://pub.dartlang.org/packages/path_provider|用于获取 Android 和 iOS 文件系统上的常用位置，例如 temp 和 app 数据目录。
**读写 sp 文件**|||
shared_preferences|0.4.2|https://pub.dartlang.org/packages/shared_preferences|用于读写简单键值对的 Flutter 插件。包装 iOS 上的 NSUserDefaults 和 Android 上的 SharedPreferences。
**网络状态有关**|||
connectivity|0.3.1|https://pub.dartlang.org/packages/connectivity|用于发现 Android 和 iOS 上的网络状态（WiFi 和移动/蜂窝）连接。
**设备信息**|||
device_info|0.2.1|https://pub.dartlang.org/packages/device_info|提供有关设备（品牌，型号等）的详细信息，以及应用程序正在运行的 Android 或 iOS 版本。
**蓝牙**|||
flutter_blue|0.3.3|https://pub.dartlang.org/packages/flutter_blue|这是跨平台的蓝牙 sdk.
flutter_ble_lib|1.0.0|https://pub.dartlang.org/packages/flutter_ble_lib|这是一个支持蓝牙连接的 flutter 库。它里面使用 RxAndroidBle 和 RxBluetoothKit 作为本地库。
----
> 国际化和本地化：
库名 | 版本号 | 链接 | 描述
-|-|-|-
intl|0.15.6|https://pub.dartlang.org/packages/intl|这个包提供国际化和本地化功能，包括消息翻译、复数和性别、日期/数字格式和解析以及双向文本。
----
> 图片加载和缓存
使用 `Image.network`，或者使用下面这个库：
库名 | 版本号 | 链接 | 描述
-|-|-|-
cached_network_image|0.4.1+1|https://pub.dartlang.org/packages/cached_network_image|Flutter 库来加载和缓存网络图像。也可以与占位符和错误小部件一起使用。
----
> 数据存储、缓存有关的库
库名 | 版本号 | 链接 | 描述
-|-|-|-
sqflite|sqflite0.10.0|https://pub.dartlang.org/packages/sqflite|SQLite 的 Flutter 插件，一个自包含的高可靠性嵌入式 SQL 数据库引擎。
file_cache|0.0.1|https://pub.dartlang.org/packages/file_cache|为 flutter package 项目缓存 Json,Buffer,FileCacheImage。
----
> UI 库：
库名 | 版本号 | 链接 | 描述
-|-|-|-
font_awesome_flutter|7.0.0|https://pub.dartlang.org/packages/font_awesome_flutter|图标字体的一个库
fluttertoast|2.0.3|https://pub.dartlang.org/packages/fluttertoast|用于 Android 和 ios 的 toast 库。
image_picker|0.4.5|https://pub.dartlang.org/packages/image_picker|用于从 Android 和 iOS 图像库中选择图像，并使用相机拍摄新照片。
camera|0.2.1|https://pub.dartlang.org/packages/camera|用于在 Android 和 iOS 上获取有关和控制相机的信息。支持预览相机馈送和捕捉图像。
**图标有关的开源库 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
cupertino_icons|0.1.2|https://pub.dartlang.org/packages/cupertino_icons|Cupertino 的图标组件库
flutter_launcher_icons |0.6.0|https://pub.dartlang.org/packages/flutter_launcher_icons  或者 github 地址 https://github.com/fluttercommunity/flutter_launcher_icons|一个命令行工具，简化了更新 Flutter 应用程序启动图标的任务。完全灵活，您可以选择要更新启动图标的平台，如果需要，可以选择保留旧的启动图标，以防将来某个时候还原旧图标。
**富文本 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_html_view|0.5.2|https://pub.dartlang.org/packages/flutter_html_view|Flutter 没有默认的支持来显示 html，所以需要三方的包来显示。这个包可以将 html 呈现给原生的 Widget。（目前支持的标签比较少）
flutter_html_textview|0.2.6|https://pub.dartlang.org/packages/flutter_html_textview|将 html 呈现为一个 Widget，在 textview 中呈现 html。
**MarkDown ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_markdown|0.1.3|https://github.com/flutter/flutter_markdown|官方的 MarkDown 库，它支持原始 MarkDown 格式，但没有内联 Html 格式。
markdown|2.0.0|https://pub.dartlang.org/packages/markdown|用 Dart 编写的便携式 Markdown 库。它可以在客户端和服务器上将 Markdown 解析为 HTML。
html2md|0.1.7|https://pub.dartlang.org/packages/html2md|将 html 转换为 Dart 中的 MarkDown.
**动画 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_villains|1.0.1|https://pub.dartlang.org/packages/flutter_villains|页面切换动画的一个库，简化动画操作，你只需要管理好 UI 就可以了。
**针对 Android 和 ios 平台的 UI 适配库 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
platform_aware|0.4.0|https://pub.dartlang.org/packages/platform_aware|为自动适应当前平台而包装的 Flutter 组件，不需要对 iOS 和 Android 进行代码更改。所有小部件都依赖于 Theme.of(context).platform 来确定当前活动平台的平台。你可以使用 Flutter Inspector 动态地更改平台。
native_widgets |0.0.3| https://pub.dartlang.org/packages/native_widgets|为避免重复代码，只编写一次代码就可以支持两个平台并自动根据平台自动使用对应风格组件，Android将使用材料设计，iOS将使用Cupertino风格的小部件。
**日历库（主要是用于显示和操作日历）**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_calendar |0.0.4|https://pub.dartlang.org/packages/flutter_calendar|适用于 Flutter 的日历小组件。
calendarro| 0.0.1|https://pub.dartlang.org/packages/calendarro|Flutter 的日历组件库。这个库提供了多种自定义组件的方法。
**日期，时间，日期时间，icon，自定义数据的选择器（很全面） ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_picker |0.0.3 |https://pub.dartlang.org/packages/flutter_picker |一个日期，时间，日期时间，icon，自定义数据的选择器，可以居中弹窗，也可以在底部弹出。（目前来看是最全面的一个选择器控件。该插件支持 ios 和 android 平台，使用的是 ios 的风格的 UI 效果。）
**图片选择的库 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
image_picker |0.4.5 | https://pub.dartlang.org/packages/image_picker   |适用于 iOS 和 Android 的 Flutter 插件，用于从图像库中拾取图像，并使用相机拍摄新照片。（功能正在完善中）
flutter_multiple_image_picker |0.0.1 |  https://pub.dartlang.org/packages/flutter_multiple_image_picker|一个新的Flutter插件，用于从图库中选择多个图像。
**联系人选择的库 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
contact_picker |0.0.2| https://pub.dartlang.org/packages/contact_picker|使用此插件，Flutter应用程序可以地址簿中选择联系人，并将联系人信息返回给应用程序，并且不需要用户的任何特殊权限。目前该插件仅支持选择电话号码。
**颜色选择的库 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_color_picker |0.0.1   | https://pub.dartlang.org/packages/flutter_color_picker|  一个简单的颜色选择器，类似于安卓的 selector 的功能，可以在点击控件时，给控件设置选择器效果。
material_color_picker| 0.0.1|  https://pub.dartlang.org/packages/material_color_picker（这个是旧版本）|这个是Flutter的颜色选择器，基于Google Docs 颜色选择器。这个用于选择颜色，你想用哪一个颜色，可以弹窗自由选择。
material_pickers| 0.0.2| https://pub.dartlang.org/packages/material_pickers（这个是新版本）|这个是Flutter的颜色选择器，基于Google Docs 颜色选择器。这个用于选择颜色，你想用哪一个颜色，可以弹窗自由选择。
flutter_colorpicker| 0.0.5|  https://pub.dartlang.org/packages/flutter_colorpicker|这是一个HSV的颜色选择器
**轮播图有关的库 (以及 Tab PagerView 有关的库) ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_swiper |1.0.4|https://pub.dartlang.org/packages/flutter_swiper 对应的 github 地址 https://github.com/best-flutter/flutter_swiper |Flutter 最强大的 siwiper, 多种布局方式，无限轮播，Android 和 IOS 双端适配.
infinity_page_view |1.0.0|https://pub.dartlang.org/packages/infinity_page_view|Flutter 无限页面视图。
carousel|0.1.0|https://pub.dartlang.org/packages/carousel|一个简单的轮播组件 (待完善)。
page_transformer |0.0.1|https://pub.dartlang.org/packages/page_transformer|用于在 Flutter 中创建漂亮的 PageView 视差效果的示例项目。
**导航栏有关的库 (库) ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
navigation_bar| 0.0.1|https://pub.dartlang.org/packages/navigation_bar|一个简易的底部导航栏。
**列表有关的库 ↓**
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_pagewise |0.2.0|https://pub.dartlang.org/packages/flutter_pagewise|一次加载一页（或批处理）内容（也称为延迟加载）
lazy_load_scrollview |0.0.2|https://pub.dartlang.org/packages/lazy_load_scrollview|ScrollView 的包装器，可以启用延迟加载，当到达页面底部时将触发回调。
----
> 路由：
库名 | 版本号 | 链接 | 描述
-|-|-|-
fluro|1.3.1|https://pub.dartlang.org/packages/fluro|最好用的路由导航框架。功能：简单的路线导航；函数处理程序（映射到函数而不是路径）；通配符参数匹配；查询字符串参数解析；内置常用转换；简单的定制转换创建。
----
> 消息传递通信有关：
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_local_notifications|0.3.0|https://pub.dartlang.org/packages/flutter_local_notifications|一个跨平台的显示本地 notifications 的插件。
local_notifications|0.0.6|https://pub.dartlang.org/packages/local_notifications|这个库能让你在 Android 和 iOS 上创建 Notifications 很简单。
url_launcher|3.0.2|https://pub.dartlang.org/packages/url_launcher|用于在 Android 和 iOS 上启动 URL。支持网络，电话，短信和电子邮件方案。
firebase_messaging|1.0.2|https://pub.dartlang.org/packages/firebase_messaging|一款跨平台的消息传递解决方案，可让您在 Android 和 iOS 上可靠地传递消息。
event_bus|0.4.1|https://pub.dartlang.org/packages/event_bus|一个使用 Dart 流进行解耦应用程序的简单事件总线的库。
----
> 视频 & 音频：
库名 | 版本号 | 链接 | 描述
-|-|-|-
video_player|0.6.5|https://pub.dartlang.org/packages/video_player|Flutter 官方的视频库（也可以用于直播），用于在 Android 和 iOS 上与其他 Flutter 窗口小部件一起显示内嵌视频。**支持主流直播流**。该库底层使用的 ExoPlayer 播放器。更多关于 ExoPlayer 播放器支持的视频格式资料请看官方文档 [ExoPlayer 播放器支持的视频格式](https://google.github.io/ExoPlayer/supported-formats.html)
video_launcher|0.3.0|https://pub.dartlang.org/packages/video_launcher|视频播放器
flute_music_player|0.0.6|https://pub.dartlang.org/packages/flute_music_player|基于 Flutter 的材料设计音乐播放器与音频插件播放本地音乐文件.
audioplayer|0.5.0|https://pub.dartlang.org/packages/audioplayer|一个播放远程或本地音频文件 Flutter 音频插件
audioplayers|0.5.2|https://pub.dartlang.org/packages/audioplayers|这是 rxlabz 的 audioplayer 的一个分支，不同之处在于它支持同时播放多个音频并显示音量控制。
----
> rx 系列：
库名 | 版本号 | 链接 | 描述
-|-|-|-
rxdart|0.17.0|https://pub.dartlang.org/packages/rxdart|RxDart 是一种基于 ReactiveX 的谷歌 Dart 反应性函数编程库。谷歌 Dart 自带了一个非常不错的流 API;RxDart 没有尝试提供这个 API 的替代方案，而是在它上面添加了一些功能。
rx_widgets|1.0.3|https://pub.dartlang.org/packages/rx_widgets|rx_widgets 是一个包含基于流的 Flutter Widgets 和 Widget 帮助程序/便利类的程序包，它们有助于反应式编程风格，特别是与 RxDart 和 RxCommands 结合使用。
rx_command|2.0.0|https://pub.dartlang.org/packages/rx_command|RxCommand 是针对事件处理程序的基于 Reactive Extensions（Rx）的抽象。它基于 ReactiveUI 框架的 ReactiveCommand。它大量使用了 RxDart 包。
----
## 三方 sdk 有关的：
**由于开发中会用到一些三方的 sdk，但是国内的 sdk 目前还没有支持 Flutter，我在 pub 上面收集了一些相关的三方库，也不知道效果如何，待检验，欢迎各位试用给出反馈。**
> 地图（地图显示、定位、经纬度等）
库名 | 版本号 | 链接 | 描述
-|-|-|-
map_view|0.0.12|https://pub.dartlang.org/packages/map_view|一个用于在 iOS 和 Android 上显示谷歌地图的 Flutter 插件
flutter_map|0.0.10|https://pub.dartlang.org/packages/flutter_map|基于 leaflet 的 Flutter 地图包 
location|1.3.4|https://pub.dartlang.org/packages/location|这个插件 处理 Android 和 iOS 上的位置。它还提供位置更改时的回调。 
latlong|0.5.3|https://pub.dartlang.org/packages/latlong|LatLong 是一个计算通用的纬度和经度的轻量级库。
----
> 二维码
库名 | 版本号 | 链接 | 描述
-|-|-|-
qr_flutter|1.1.3|https://pub.dartlang.org/packages/qr_flutter|QR.Flutter 是一个 Flutter 库，可通过 Widget 或自定义 Paint 进行简单快速的 QR 码渲染。
barcode_scan|0.0.4|https://pub.dartlang.org/packages/barcode_scan|用于扫描 2D 条形码和 QRCodes 的 Flutter 插件。
qrcode_reader|0.3.3|https://pub.dartlang.org/packages/qrcode_reader|使用相机读取二维码的 Flutter 插件。
----
> WebView
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_webview_plugin|0.1.6|https://pub.dartlang.org/packages/flutter_webview_plugin|允许 Flutter 与原生 Webview 进行通信的插件。 
----
> 图表库
库名 | 版本号 | 链接 | 描述
-|-|-|-
charts-common|0.3.0|https://pub.dartlang.org/packages/charts_flutter|Material Design 风格的图表库
charts-flutter|0.3.0|https://pub.dartlang.org/packages/charts_common|通用的图表库组件
flutter_circular_chart|0.0.3|https://pub.dartlang.org/packages/flutter_circular_chart|一个让你使用 flutter 轻松创建的动画圆形图控件的库。
----
> 权限库
库名 | 版本号 | 链接 | 描述
-|-|-|-
simple_permissions|0.1.5|https://pub.dartlang.org/packages/simple_permissions|用于 android 和 ios 的请求权限的库
flutter_simple_permissions|0.0.1|https://pub.dartlang.org/packages/flutter_simple_permissions|权限申请的库
----
> 分享
库名 | 版本号 | 链接 | 描述
-|-|-|-
share|0.5.1|https://pub.dartlang.org/packages/share|支持分享的 flutter 插件
----
> 统计
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_umeng_analytics|0.0.1|https://pub.dartlang.org/packages/flutter_umeng_analytics|这个库集成了友盟统计 sdk
----
> 登陆
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_qq|0.0.1|https://pub.dartlang.org/packages/flutter_qq|这个库集成了 QQ 登录、QQ 分享、QQ 空间分享。
flutter_wechat|0.1.2|https://pub.dartlang.org/packages/flutter_wechat|这个库集成了微信，支持微信登录、分享、支付。
> 支付
库名 | 版本号 | 链接 | 描述
-|-|-|-
flutter_alipay|0.1.0|https://pub.dartlang.org/packages/flutter_alipay|这个库继承了支付宝，兼容 android 和 ios
> 视频播放（本地视频、网上视频、或者 rtmp 源格式）
https://github.com/hyz1992/my_aliplayer    集成了阿里云播放器，可以用来播放视频，也可以播放 rtmp 格式。
----
**以下几个暂未找到相关的三方库**
* 推送
----
## 一个好玩的库：
库名 | 版本号 | 链接 | 描述
-|-|-|-
pwa|0.1.10|https://pub.dartlang.org/packages/pwa|基于 Dart 的 PWA 应用程序的库
---
title: "Flutter Error: Not found: ‘dart:html‘"
slug: "flutter_error_not_found_dart_html"
date: 2022-04-18 17:30:14
categories: [Flutter]
tags: [Flutter]
showToc: true
TocOpen: true
draft: false


---


场景：同一个项目，打包成 Flutter web 和 Flutter App。
问题：Error: Not found: ‘dart:html’。

产生上面问题的原因其实就是Flutter web使用了dart:html包的类，而Flutter App没有dart:html相关类。相应的 dart.io 这个包，在 web 中也是不存在。像类似的情况有很多。


要解决上面的问题也很简单。写一个类似 MVC 的调用文件就可以了。Flutter 开发中网络请求使用最多的应该就是 dio 了。我们就以 dio 为例子，写一个调用的实例：
 
dio 初始化的时候需要指定`HttpClientAdapter`。在app 上为 `DefaultHttpClientAdapter` web 上为 `BrowserHttpClientAdapter`，如果全部用`DefaultHttpClientAdapter` web 
端会提示不支持。如果这么写：

```dart
idWeb? BrowserHttpClientAdapter() else DefaultHttpClientAdapter
```
就会出现跟上面一样的。 提示 package:dio/adapter_browser.dart not found。

解决： 

- http_client_adapter：用于中间承接转化工具。
- http_client_adapter_io.dart：如果是Flutter App就引入这个包
- http_client_adapter_web.dart：如果是Flutter web就引入这个包

http_client_adapter：
```dart
export './http_client_adapter_web.dart' if (dart.library.io) './http_client_adapter_io.dart';

```

http_client_adapter_io：
```dart
import 'package:dio/adapter.dart';
import 'package:dio/dio.dart';

HttpClientAdapter getHttpClientAdapter() {
  return DefaultHttpClientAdapter();
}
```
http_client_adapter_web
```dart
import 'package:dio/adapter_browser.dart';
import 'package:dio/dio.dart';

HttpClientAdapter getHttpClientAdapter() {
  return BrowserHttpClientAdapter();
}

```

调用：
```dart
import 'http_client_adapter.dart' as adapter;
httpClientAdapter = adapter.getHttpClientAdapter();
```




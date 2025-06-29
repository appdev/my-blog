---
title: "Android中使用FutterView的相关问题（一）"
slug: "problems-related-to-using-futterview-in-android-i"
published: 2018-12-13T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
---
Flutter 从 Main 开始启动，启动的时候需要最外层是 `MaterialApp`
```java
void main() => runApp(_widgetForRoute(window.defaultRouteName));
Widget _widgetForRoute(String route) {
  return MaterialApp(
    color: Colors.white,
    theme: ThemeData(
      primarySwatch: Colors.blue,
    ),
    home: findHome(route),
  );
}
Widget findHome(String route) {
  switch (route) {
    case 'index':
      return IndexMain();
    case 'detail':
      return ProductDetail();
    default:
      return Center(
        child: Text('Unknown route: $route', textDirection: TextDirection.ltr),
      );
  }
}
```
---
- 如果背景是黑色的使用 `caffold` 嵌套
- 如果文字有黄色下划线，原因是 theme 的问题，两种方式：
 1. 使用顶层 `Material` 嵌套 (推荐，使用这种方式，原生端页面展示会比其他的好看的)
 2. 对 Text 添加 Style:
```java
  style: new TextStyle(decoration: TextDecoration.none)
```
---
FlutterView 黑色背景：
```xml
 <style name="FlutterTheme" parent="@android:style/Theme.Translucent.NoTitleBar">
        <!-- Show a splash screen on the activity. Automatically removed when
             Flutter draws its first frame -->
        <item name="android:windowBackground">@android:color/white</item>
    </style>
```
---
如果是连贯的 Flutter 页面，Flutter 任务栈可以使用（FlutterView 初始化比较慢，release 后初始化仍会消耗时间，Flutter 内部跳转比较快。）`flutterView.popRoute()`
--- 
跳转动画
```java
Navigator.push(
      context,
      new PageRouteBuilder(pageBuilder: (BuildContext context,
          Animation<double> animation, Animation<double> secondaryAnimation) {
        // 跳转的路由对象
        return ProductDetail();
      }, transitionsBuilder: (
        BuildContext context,
        Animation<double> animation,
        Animation<double> secondaryAnimation,
        Widget child,
      ) {
        return createTransition(animation, child);
      }));
```
```java
SlideTransition createTransition(Animation<double> animation, Widget child) {
  return new SlideTransition(
    position: new Tween<Offset>(
      begin: const Offset(1.0, 0.0),
      end: const Offset(0.0, 0.0),
    ).animate(animation),
    child: child,
  );
}
```
---
调试 Flutter:
```
$ cd some/path/my_flutter
$ flutter attach
Waiting for a connection from Flutter on Nexus 5X...
```
启动到 Flutter 相关代码，显示：
```
Done.
Syncing files to device Nexus 5X...                          5.1s
```
---
手势处理：有部分 Widget 提供了 onPressed 事件，还有一部分没有提供。这时候就需要使用 `GestureDetector` 或者`InkWell`、`InkResponse`
`InkWell`和 `InkResponse`还会添加一个水波纹的点击效果，`InkResponse`还可以设置水波纹的形状。但是，`InkWell`和`InkResponse` 都不会做任何的渲染工作，它们只是更新了父级 Material Widget。
> 一个简单的例子就是 image，如果你将一个 image 用 `InkWell` 包裹住，那么你会发现，水波纹效果不见了。这是因为水波纹是被绘制在 image 的下层的，所以被遮挡住了。如果想要水波纹可见，那么请使用`Ink.Image`。
  但是如果你想要捕捉更多的触摸事件，比如用户的拖拽行为，那么你就必须使用 `GestureDetector` 来实现了。
 **似乎需要使用 `Material`嵌套`InkWell` 才会有效果**
`InkWell` 的使用方法如下：
```java
 new InkWell(
    child: new Text("Click me!"),
    onTap: () {
      // 单击
    },
    onDoubleTap: () {
      // 双击
    },
    onLongPress: () {
      // 长按
    }
  );
```
----
TarBarView 每次切换时其条目 Widget 都会执行 initState()
网上很多说使用 `AutomaticKeepAliveClientMixin`，在其条目 Widget 的 xxxState 方法扩展`AutomaticKeepAliveClientMixin`，并返回 true  
然而：
慎用！！！如果大于等于 3 个 tab，这个有 bug，最好不用
当前 tab 切到任意非相邻 tab(如：第一个 tab 切换到第三个)，会报错
```java
class ArticleListPageState extends State<ArticleListPage>
    with AutomaticKeepAliveClientMixin {
  //  with AutomaticKeepAliveClientMixin 并且 get wantKeepAlive 返回 true,tab 切换时，不会每次执行 initState
  @override
  bool get wantKeepAlive => true;
}
```

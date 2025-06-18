---
title: "Flutter中嵌入Native组件"
slug: "embedding-native-components-in-flutter"
published: 2018-12-07T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
---
Flutter 官方提供的控件 `AndroidView`、`UiKitView`就是一种比较优雅的解决方案了。这里做了一个简单的嵌入`TextView` 的 demo(使用这种方式会增加性能上的开销，应该尽量避免使用)
### 使用方式
#### native 端
跟 `MethodChannel` 的使用方法类似，在 native 侧，我们实现一个`PlatformViewFactory`(iOS 是`FlutterPlatformViewFactory`),在 create 方法中，使用平台方法创建 View 返回。
---
```java
    override fun create(context: Context?, i: Int, any: Any?): PlatformView {
        return object : PlatformView {
            override fun getView(): View {
                val text = TextView(context)
                text.layoutParams = ViewGroup.LayoutParams(SizeUtils.dp2px(200f), SizeUtils.dp2px(200f))
                text.apply {
                    setText("Android View")
                    setTextColor(Color.BLUE)
                    setBackgroundColor(Color.RED)
                }
                return text
            }
            override fun dispose() {
            }
        }
    }
```
---
```swif
 func create(withFrame frame: CGRect, viewIdentifier viewId: Int64, arguments args: Any?) -> FlutterPlatformView {
    }
```
#### Flutter
使用 `AndroidView`、`UiKitView` 时需要传入一个 viewType，这个 String 将用于唯一标识该 Widget，用于和 Native 的 View 建立关联。
```
var VIEWCREATE = "TextView";
 Center(
        child: AndroidView(
          viewType: VIEWCREATE,
        ),
      )
```
### View 最终的显示尺寸由谁决定？
我们尝试修改 Native 端 View 的大小:
同时修改 Flutter 的大小
可以看到，Flutter 端的大小是小于 Native 端的
实际显示效果：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/2022-1-19%2014-50-24/c10e1f71-c89f-4a9c-897d-83b5c35e0d53.png)
---
如果 Flutter 端大小大于 Native 端呢？
我们修改 Flutter 代码将大小设置为宽、高 100，Native 端 20：
打开布局边界，看以看到：
---
#### 结论：
AndroidView 的大小是由其父节点所决定的，我们可以使用 Container、SizedBox 等控件控制 AndroidView 的大小。
如果在 Native 中渲染的 View 的实际大小大于 AndroidView 的大小时，Flutter 会使用裁切的方式进行展示
当这个 Native 端 View 的实际像素小于 AndroidView 的时候，会发现 AndroidView 并不会相应地变小（Container 的背景色并没有显露出来），没有内容的地方会被白色填充。
### 触摸事件
Android 中事件流，自顶向下传递，自底向上处理或回流。Flutter 同样是使用这一规则，但是其中 AndroidView 通过两个类来去处理手势：
`MotionEventsDispatcher`：负责将事件封装成 Native 的事件并向 Native 传递；
`AndroidViewGestureRecognizer`：负责识别出相应的手势，其中有两个属性：
```
  // Maps a pointer to a list of its cached pointer events.
  // Before the arena for a pointer is resolved all events are cached here, if we win the arena
  // the cached events are dispatched to the view, if we lose the arena we clear the cache for
  // the pointer.
  final Map<int, List<PointerEvent>> cachedEvents = <int, List<PointerEvent>> {};
  // Pointer for which we have already won the arena, events for pointers in this set are
  // immediately dispatched to the Android view.
  final Set<int> forwardedPointers = Set<int>();
```
使用（`EagerGestureRecognizer` 传递到 Android 端是 Touch 事件，不清楚 Click 事件没有，还是使用方法不对）：
![WX20181207-130621.png][1]
详情可以看官网文档：
[https://docs.flutter.io/flutter/widgets/AndroidView/gestureRecognizers.html](https://docs.flutter.io/flutter/widgets/AndroidView/gestureRecognizers.html)
  [4]: https://github.com/appdev/gallery/blob/main/img/2022-1-19%2014-50-24/c10e1f71-c89f-4a9c-897d-83b5c35e0d53.pngmirages-height=175&mirages-cdn-type=2

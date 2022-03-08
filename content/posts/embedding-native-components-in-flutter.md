---
title: "Flutter中嵌入Native组件"
slug: "embedding-native-components-in-flutter"
date: 2018-12-07T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "Flutter官方提供的控件AndroidView、UiKitView就是一种比较优雅的解决方案了。这里做了一个简单的嵌入TextView的"

---
                
Flutter官方提供的控件`AndroidView`、`UiKitView`就是一种比较优雅的解决方案了。这里做了一个简单的嵌入`TextView`的demo(使用这种方式会增加性能上的开销，应该尽量避免使用)


### 使用方式
#### native端
跟`MethodChannel`的使用方法类似，在native侧，我们实现一个`PlatformViewFactory`(iOS是`FlutterPlatformViewFactory`),在create方法中，使用平台方法创建View返回。

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

使用`AndroidView`、`UiKitView`时需要传入一个viewType，这个String将用于唯一标识该Widget，用于和Native的View建立关联。
```
var VIEWCREATE = "TextView";
 Center(
        child: AndroidView(
          viewType: VIEWCREATE,
        ),
      )
```


### View最终的显示尺寸由谁决定？

我们尝试修改Native端View的大小:

![WX20181207-114031.png][6]

同时修改Flutter的大小

![WX20181207-144627.png][5] 

可以看到，Flutter端的大小是小于Native端的

实际显示效果：

![WX20181207-120014.png][4]
---
如果Flutter端大小大于Native端呢？
我们修改Flutter代码将大小设置为宽、高100，Native端20：
打开布局边界，看以看到：

![WX20181207-124328.png][3]

---

#### 结论：

AndroidView的大小是由其父节点所决定的，我们可以使用Container、SizedBox等控件控制AndroidView的大小。

如果在Native中渲染的View的实际大小大于AndroidView的大小时,Flutter会使用裁切的方式进行展示

当这个Native端View的实际像素小于AndroidView的时候，会发现AndroidView并不会相应地变小（Container的背景色并没有显露出来），没有内容的地方会被白色填充。

### 触摸事件

Android中事件流，自顶向下传递，自底向上处理或回流。Flutter同样是使用这一规则，但是其中AndroidView通过两个类来去处理手势：

`MotionEventsDispatcher`：负责将事件封装成Native的事件并向Native传递；

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

使用（`EagerGestureRecognizer`传递到Android端是Touch事件，不清楚Click事件没有，还是使用方法不对）：
![WX20181207-130621.png][1]

详情可以看官网文档：
[https://docs.flutter.io/flutter/widgets/AndroidView/gestureRecognizers.html](https://docs.flutter.io/flutter/widgets/AndroidView/gestureRecognizers.html)



  [1]: https://static.apkdv.com/usr/uploads/2018/12/3772514580.png#mirages-width=643&mirages-height=331&mirages-cdn-type=2
  [2]: https://static.apkdv.com/usr/uploads/2018/12/982531011.png#mirages-width=976&mirages-height=351&mirages-cdn-type=2
  [3]: https://static.apkdv.com/usr/uploads/2018/12/3527885193.png#mirages-width=306&mirages-height=180&mirages-cdn-type=2
  [4]: https://static.apkdv.com/usr/uploads/2018/12/2704704328.png#mirages-width=276&mirages-height=175&mirages-cdn-type=2
  [5]: https://static.apkdv.com/usr/uploads/2018/12/362967709.png#mirages-width=343&mirages-height=254&mirages-cdn-type=2
  [6]: https://static.apkdv.com/usr/uploads/2018/12/4063670088.png#mirages-width=896&mirages-height=179&mirages-cdn-type=2
---
title: "Flutter ListView嵌套不显示布局解决方案"
slug: "flutter-listview-nested-nondisplay-layout-solution"
date: 2019-03-19T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "在Flutter中如果使用listview嵌套listview(gridView)的方式（其实不是很推荐这么写）直接写会发现布局"

---
                
   在Flutter中 如果使用 listview 嵌套 listview(gridView) 的方式（其实不是很推荐这么写）直接写 会发现布局不显示。
搜索一下基本上解决方法都是给内部的 listview 设置一个高度，但是针对高度不固定的listview这种方式基本无效，而且设置固定高度后 listview 的性能会有额外开销（因为不可见的item不能被回收了）

### 解决方法
其实查找一下源码，就可以发现官方已经给出了解决方法，在注释里：
```java
/// Here are two brief snippets showing a [ListView] and its equivalent using
/// [CustomScrollView]:
///
/// ```dart
/// ListView(
///   shrinkWrap: true,
///   padding: const EdgeInsets.all(20.0),
///   children: <Widget>[
///     const Text('I\'m dedicating every day to you'),
///     const Text('Domestic life was never quite my style'),
///     const Text('When you smile, you knock me out, I fall apart'),
///     const Text('And I thought I was so smart'),
///   ],
/// )
/// ```
```
所以比较简单了，直接在子listview中加上`shrinkWrap: true`属性：
```java
ListView childListView = ListView.builder(
      itemCount: 10,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemBuilder: (BuildContext context, int index) {
        return Container(
          color: Colors.primaries[index % Colors.primaries.length],
          child: SizedBox(
            width: 100.0,

            /// 利用index创建伪随机高度的条目
            height: 50.0 + ((27 * index) % 15) * 3.14,
            child: Center(
              child: Text('$index'),
            ),
          ),
        );
      },
    );
```
OK，运行一下发现已经可以显示出正常布局了，是不是很高兴呢。@(滑稽)，然而。。。滚动一下发现不能滚动。@(汗)原因是因为 子listview自带滚动属性，使得页面无法随着父控件滚动，所以我们需要禁用 listview的滚动属性。
使用：` physics: NeverScrollableScrollPhysics(),`即可禁用listview的滚动，(physics属性在所有滚动空间中均有，系统提供了两个子类，`AlwaysScrollableScrollPhysics`，`NeverScrollableScrollPhysics`有兴趣可以了解一下[ScrollPhysics][1])

至此，我们运行一下，发现布局正确显示，滑动也没什问题了！

完整代码：
```java
···
  ListView childListView = ListView.builder(
      itemCount: 10,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemBuilder: (BuildContext context, int index) {
        return Container(
          color: Colors.primaries[index % Colors.primaries.length],
          child: SizedBox(
            width: 100.0,
            height: 50.0 + ((27 * index) % 15) * 3.14,
            child: Center(
              child: Text('$index'),
            ),
          ),
        );
      },
    );
    var listView = ListView.builder(
      itemCount: 5,
      itemBuilder: (BuildContext context, int index) {
        return childListView;
      },
    );
···
```


  [1]: https://docs.flutter.io/flutter/widgets/ScrollPhysics-class.html
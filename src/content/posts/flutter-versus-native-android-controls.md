---
title: "Flutter和原生Android控件对比"
slug: "flutter-versus-native-android-controls"
published: 2018-12-06T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
---
Flutter 和原生 Android 控件对比：
Flutter 控件|Android 控件
-|-
AppBar|ActionBar/ToolBar
ListView|ListView/RecyclerView
Text|TextView
Center|ViewGroup
FloatingActionButton|FloatingActionButton(design 库里面的)
BottomNavigationBar|BottomNavigation(design 库里面的)
RaisedButton/Button|Button
Column|LinearLayout 的 android:orientation="vertical"
Row|android:orientation="horizontal"
DecorationImage|ImageView
Image|ImageView
Stack|FrameLayout/RelativeLayout
Container|RelativeLayout
CustomMultiChildLayout|RelativeLayout
Algin|alginParentXXX 属性
resizeToAvoidBottomPadding|android:windowSoftInputMode=”adjustResize 属性
SingleChildScrollView|ScrollView
CustomScrollerView|Recyclerview
----
Image 里面的 BoxFit 参数介绍：（相当于 Android 的 ImageView 的 scaleType 参数）
// fill 通过篡改原始宽高比来填充目标 box
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726849227box_fit_fill.png)
/// contain 在尽可能大的情况下，仍然将源完全包含在目标框中。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726849629box_fit_contain.png)
/// cover 尽可能小，同时仍然覆盖整个目标框。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726850041box_fit_cover.png)
/// fitWidth 确保显示源的全部宽度，而不管这是否意味着源垂直溢出目标框。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726850409box_fit_fitWidth.png)
/// fitHeight 确保显示源的全部高度，而不管这是否意味着源水平地溢出目标框。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726850878box_fit_fitHeight.png)
  /// none 在目标框中对齐源（默认为居中），并放弃位于框外的源的任何部分。源图像未调整大小。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726851592box_fit_none.png)
/// scaleDown 在目标框中对齐源 (默认为居中)，如果需要，将源缩小以确保源适合该框。这与 contain 的内容相同，如果该内容会收缩图像，那么它就是 none。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726852084box_fit_scaleDown.png)
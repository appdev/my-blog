---
title: "在AndroidManifest.xml文件中的android:windowSoftInputMode属性使用｜ keyboard,squeezing,layout"
slug: "Android-windowSoftInputMode-property-to-use"
date: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "TheAndroidManifest.xmlFile&lt;activityandroid:windowSoftInputMode="

---
                

The AndroidManifest.xml File
```java
<activity android:windowSoftInputMode=["stateUnspecified",
"stateUnchanged", "stateHidden",
"stateAlwaysHidden", "stateVisible",
"stateAlwaysVisible", "adjustUnspecified",
"adjustResize", "adjustPan"] …… >
</activity>
```


<!--more-->


attributes:

android:windowSoftInputMode

活动的主窗口如何与包含屏幕上的软键盘窗口交互。这个属性的设置将会影响两件事情 :

1.软键盘的状态——是否它是隐藏或显示——当活动 (Activity)成为用户关注的焦点。

2.活动的主窗口调整——是否减少活动主窗口大小以便腾出空间放软键盘或是否当活动窗口的部分被软键盘覆盖时它的内容的当前焦点是可见的。

它的设置必须是下面列表中的一个值，或一个 ”state…”值加一个 ”adjust…”值的组合。在任一组设置多个值——多个 ”state…”values，例如＆ mdash有未定义的结果。各个值之间用 |分开。例如 : &lt;activity android:windowSoftInputMode="stateVisible|adjustResize" . . . &gt;

在这设置的值 (除 "stateUnspecified"和 "adjustUnspecified"以外 )将覆盖在主题中设置的值
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="134">值</td>
<td valign="top" width="434">描述</td>
</tr>
<tr>
<td valign="top" width="134">"stateUnspecified"</td>
<td valign="top" width="434">软键盘的状态 (是否它是隐藏或可见 )没有被指定。系统将选择一个合适的状态或依赖于主题的设置。

这个是为了软件盘行为默认的设置。</td>
</tr>
<tr>
<td valign="top" width="134">"stateUnchanged"</td>
<td valign="top" width="434">软键盘被保持无论它上次是什么状态，是否可见或隐藏，当主窗口出现在前面时。</td>
</tr>
<tr>
<td valign="top" width="134">"stateHidden"</td>
<td valign="top" width="434">当用户选择该 Activity时，软键盘被隐藏——也就是，当用户确定导航到该 Activity时，而不是返回到它由于离开另一个 Activity。</td>
</tr>
<tr>
<td valign="top" width="134">"stateAlwaysHidden"</td>
<td valign="top" width="434">软键盘总是被隐藏的，当该 Activity主窗口获取焦点时。</td>
</tr>
<tr>
<td valign="top" width="134">"stateVisible"</td>
<td valign="top" width="434">软键盘是可见的，当那个是正常合适的时 (当用户导航到 Activity主窗口时 )。</td>
</tr>
<tr>
<td valign="top" width="134">"stateAlwaysVisible"</td>
<td valign="top" width="434">当用户选择这个 Activity时，软键盘是可见的——也就是，也就是，当用户确定导航到该 Activity时，而不是返回到它由于离开另一个Activity。</td>
</tr>
<tr>
<td valign="top" width="134">"adjustUnspecified"</td>
<td valign="top" width="434">它不被指定是否该 Activity主 窗口调整大小以便留出软键盘的空间，或是否窗口上的内容得到屏幕上当前的焦点是可见的。系统将自动选择这些模式中一种主要依赖于是否窗口的内容有任何布局 视图能够滚动他们的内容。如果有这样的一个视图，这个窗口将调整大小，这样的假设可以使滚动窗口的内容在一个较小的区域中可见的。这个是主窗口默认的行为 设置。</td>
</tr>
<tr>
<td valign="top" width="134">"adjustResize"</td>
<td valign="top" width="434">该 Activity主窗口总是被调整屏幕的大小以便留出软键盘的空间</td>
</tr>
<tr>
<td valign="top" width="134">"adjustPan"</td>
<td valign="top" width="434">该 Activity主窗口并不调整屏幕的大小以便留出软键盘的空间。相反，当前窗口的内容将自动移动以便当前焦点从不被键盘覆盖和用户能总是看到输入内容的部分。这个通常是不期望比调整大小，因为用户可能关闭软键盘以便获得与被覆盖内容的交互操作。</td>
</tr>
</tbody>
</table>
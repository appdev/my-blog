---
title: "flutter 日常采坑"
slug: "flutter-daily-pit-mining"
published: 2019-04-30T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
---
记录一下用 flutter 开发过程中遇到的问题，随缘更新~
### DropdownButton 去掉分割线
`DropdownButton`的默认分割线，在自身是没办法取消的。在我怀疑 Google 硬编码的时候，发现了 `DropdownButtonHideUnderline`,`DropdownButton`的分割线就是通过`DropdownButtonHideUnderline`实现的，灵机一动用`DropdownButtonHideUnderline`包裹`DropdownButton`同时取消了颜色属性，果然`DropdownButton` 的分割线没有了。
```dart
 DropdownButtonHideUnderline(
        child: DropdownButton(
          iconSize: 0,
          items: itemList,
          hint: hit,
          isExpanded: true,
          onChanged: change,
        ),
      )
```
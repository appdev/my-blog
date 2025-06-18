---
title: "于Fragment和Activity之间onCreateOptionsMenu的问题"
slug: "the-problem-of-oncreateoptionsmenu-between-fragment-and-activity-1"
published: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
Fragment 和 Activity 一样，可以重写 onCreateOptionsMenu 方法来设定自己的菜单，其实这两个地方使用 onCreateOptionsMenu 的目的和效果都是完全一样的，但是由于 Fragment 是从属于 activity 的，因此第一次使用 onCreateOptionsMenu 的时候需要注意以下知识点。
一、在 Activity 和 Fragment 中 onCreateOptionsMenu 的实现是有细微差别的：
在 activity 中：
```java
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    getMenuInflater().inflate(R.menu.main, menu);
    return super.onCreateOptionsMenu(menu);
}
``` 
在 Fragment 中：
```java
@Override
public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.pictrue_list, menu);
        super.onCreateOptionsMenu(menu,inflater);
}
```
两者不同的地方在于
（1）一个有返回值（boolean 类型），一个没有返回值。
（2）Fragment 中 onCreateOptionsMenu 的参数多了一个 MenuInflater
二、想让 Fragment 中的 onCreateOptionsMenu 生效必须先调用 setHasOptionsMenu 方法
一般我们是在 nCreate 中调用
`setHasOptionsMenu(true);`
三、如果 Fragment 和 Activity 都同时 inflate 了一个 menu 资源文件，那么 menu 资源所包含的菜单会出现两次
为什么呢，因为 inflater.inflate(R.menu.pictrue_list, menu) 方法的作用其实就是将第一个参数中包括的菜单项追加到 menu 中。一开始，在 activity 中 menu 是空的，当调用了`getMenuInflater().inflate(R.menu.main, menu)`
menu 中便有了菜单项，而在执行到 Fragment 的 (Menu menu, MenuInflater inflater) 时，activity 的 menu 就传递下来，作为第一个参数。activity 和 Fragment 中的 menu 其实是一个对象。
我还可以从上面的分析中得出，Fragment 的菜单项会显示在 Activity 菜单项的后面。
为了解决 menu 资源所包含的菜单会出现两次这个问题，一般我们让 Activity 和 Fragment inflate 两个不同的菜单（就如上面的例子），Fragment 会继承 Activity 的所有菜单。
四、如果在 Fragment 和 Activity 中有相同的菜单元素，并且 activity 和 fragment 都对此菜单有响应的话，那么将执行两次响应事件。
除此之外，该菜单元素会显示两次。
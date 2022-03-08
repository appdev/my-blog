---
title: "于Fragment和Activity之间onCreateOptionsMenu的问题"
slug: "the-problem-of-oncreateoptionsmenu-between-fragment-and-activity-1"
date: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "Fragment和Activity一样，可以重写onCreateOptionsMenu方法来设定自己的菜单，其实这两个地方使用onCreat"

---
                
Fragment和Activity一样，可以重写onCreateOptionsMenu方法来设定自己的菜单，其实这两个地方使用onCreateOptionsMenu的目的和效果都是完全一样的，但是由于Fragment是从属于activity的，因此第一次使用onCreateOptionsMenu的时候需要注意以下知识点。

一、在Activity和Fragment中onCreateOptionsMenu的实现是有细微差别的：

在activity中：
```java
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    getMenuInflater().inflate(R.menu.main, menu);
    return super.onCreateOptionsMenu(menu);
}
``` 

在Fragment中：
```java
@Override
public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.pictrue_list, menu);
        super.onCreateOptionsMenu(menu,inflater);
}
```

两者不同的地方在于

（1）一个有返回值（boolean类型），一个没有返回值。

（2）Fragment中onCreateOptionsMenu的参数多了一个MenuInflater

二、想让Fragment中的onCreateOptionsMenu生效必须先调用setHasOptionsMenu方法

一般我们是在nCreate中调用

`setHasOptionsMenu(true);`

三、如果Fragment和Activity都同时inflate了一个menu资源文件，那么menu资源所包含的菜单会出现两次

为什么呢，因为inflater.inflate(R.menu.pictrue_list, menu)方法的作用其实就是将第一个参数中包括的菜单项追加到menu中。一开始，在activity中menu是空的，当调用了`getMenuInflater().inflate(R.menu.main, menu)`

menu中便有了菜单项，而在执行到Fragment的(Menu menu, MenuInflater inflater)时，activity的menu就传递下来，作为第一个参数。activity和Fragment中的menu其实是一个对象。

我还可以从上面的分析中得出，Fragment的菜单项会显示在Activity菜单项的后面。

为了解决menu资源所包含的菜单会出现两次这个问题，一般我们让Activity和Fragment inflate两个不同的菜单（就如上面的例子），Fragment会继承Activity的所有菜单。

四、如果在Fragment和Activity中有相同的菜单元素，并且activity和fragment都对此菜单有响应的话，那么将执行两次响应事件。

除此之外，该菜单元素会显示两次。
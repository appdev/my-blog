---
title: "Android ListView 与 RecyclerView 对比浅析—缓存机制"
slug: "comparison-between-android-listview-and-recyclerview-cache-mechanism"
date: 2018-07-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "一，背景RecyclerView是谷歌官方出的一个用于大量数据展示的新控件，可以用来代替传统的ListView，更加强大和灵活。最近，自"
cover: 
    image: "https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726827962b3735a3644d67283acc73d5a83869.png"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                

## 一，背景

RecyclerView是谷歌官方出的一个用于大量数据展示的新控件，可以用来代替传统的ListView，更加强大和灵活。

最近，自己负责的业务，也遇到这样的一个问题，关于是否要将ListView替换为RecyclerView？

秉承着实事求是的作风，弄清楚RecyclerView是否有足够的吸引力替换掉ListView，我从性能这一角度出发，研究RecyclerView和ListView二者的缓存机制，并得到了一些较有益的”结论”，待我慢慢道来。

同时也希望能通过本文，让大家快速了解RecyclerView与ListView在缓存机制上的一些区别，在使用上也更加得心应手吧。

PS：相关知识：
ListView与RecyclerView缓存机制原理大致相似，如下图所示：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726827962b3735a3644d67283acc73d5a83869.png)

过程中，离屏的ItemView即被回收至缓存，入屏的ItemView则会优先从缓存中获取，只是ListView与RecyclerView的实现细节有差异.（这只是缓存使用的其中一个场景，还有如刷新等）

PPS：本文不贴出详细代码，结合源码食用更佳！

## 二. 正文

2.1 缓存机制对比

1. 层级不同：
RecyclerView比ListView多两级缓存，支持多个离ItemView缓存，支持开发者自定义缓存处理逻辑，支持所有RecyclerView共用同一个RecyclerViewPool(缓存池)。

具体来说：
ListView(两级缓存)：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268283485df7b0f9973beafc9170ba19b8fff.png)

RecyclerView(四级缓存)：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268290132b7f523b2830ef84a022fe384ea51.jpg)

ListView和RecyclerView缓存机制基本一致：

1). mActiveViews和mAttachedScrap功能相似，意义在于快速重用屏幕上可见的列表项ItemView，而不需要重新createView和bindView；

2). mScrapView和mCachedViews + mReyclerViewPool功能相似，意义在于缓存离开屏幕的ItemView，目的是让即将进入屏幕的ItemView重用.

3). RecyclerView的优势在于a.mCacheViews的使用，可以做到屏幕外的列表项ItemView进入屏幕内时也无须bindView快速重用；b.mRecyclerPool可以供多个RecyclerView共同使用，在特定场景下，如viewpaper+多个列表页下有优势.客观来说，RecyclerView在特定场景下对ListView的缓存机制做了补强和完善。

2. 缓存不同：
1). RecyclerView缓存RecyclerView.ViewHolder，抽象可理解为：
View + ViewHolder(避免每次createView时调用findViewById) + flag(标识状态)；
2). ListView缓存View。

缓存不同，二者在缓存的使用上也略有差别，具体来说：  
ListView获取缓存的流程：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/164672682938879662fad46ac51b3dc4c3e36597cb.jpg)

RecyclerView获取缓存的流程：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/164672682979998e122b0f932a92ec6d20941d54f5.jpg)

1). RecyclerView中mCacheViews(屏幕外)获取缓存时，是通过匹配pos获取目标位置的缓存，这样做的好处是，当数据源数据不变的情况下，无须重新bindView：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726830205a65bf7fc187b93d06aacb0bea2692.jpg)

而同样是离屏缓存，ListView从mScrapViews根据pos获取相应的缓存，但是并没有直接使用，而是重新getView（即必定会重新bindView），相关代码如下：

 //AbsListView源码：line2345
 //通过匹配pos从mScrapView中获取缓存
 final View scrapView = mRecycler.getScrapView(position);
 //无论是否成功都直接调用getView,导致必定会调用createView
 final View child = mAdapter.getView(position, scrapView, this);
 if (scrapView != null) {
     if (child != scrapView) {
         mRecycler.addScrapView(scrapView, position);
     } else {
         ...
     }
 }
2). ListView中通过pos获取的是view，即pos→view；
RecyclerView中通过pos获取的是viewholder，即pos → (view，viewHolder，flag)；
从流程图中可以看出，标志flag的作用是判断view是否需要重新bindView，这也是RecyclerView实现局部刷新的一个核心.

2.2 局部刷新

由上文可知，RecyclerView的缓存机制确实更加完善，但还不算质的变化，RecyclerView更大的亮点在于提供了局部刷新的接口，通过局部刷新，就能避免调用许多无用的bindView.
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268307159ea9e7af7a385950be78bf4dd2430.jpg)
注：点击顶部原文链接可查看动态图
(RecyclerView和ListView添加，移除Item效果对比)

结合RecyclerView的缓存机制，看看局部刷新是如何实现的：
以RecyclerView中notifyItemRemoved(1)为例，最终会调用requestLayout()，使整个RecyclerView重新绘制，过程为：
onMeasure()→onLayout()→onDraw()

其中，onLayout()为重点，分为三步：

dispathLayoutStep1()：记录RecyclerView刷新前列表项ItemView的各种信息，如Top,Left,Bottom,Right，用于动画的相关计算；
dispathLayoutStep2()：真正测量布局大小，位置，核心函数为layoutChildren()；
dispathLayoutStep3()：计算布局前后各个ItemView的状态，如Remove，Add，Move，Update等，如有必要执行相应的动画.
其中，layoutChildren()流程图：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/164672683113279dfac2a1b9238b49d8ed6ace10fd.jpg)
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726831547baea2ebbadc744adac35fec5dd9a8.png)
当调用notifyItemRemoved时，会对屏幕内ItemView做预处理，修改ItemView相应的pos以及flag(流程图中红色部分)：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726831903d6f6180f900c4fd27e05165b65024.png)

当调用fill()中RecyclerView.getViewForPosition(pos)时，RecyclerView通过对pos和flag的预处理，使得bindview只调用一次.

需要指出，ListView和RecyclerView最大的区别在于数据源改变时的缓存的处理逻辑，ListView是”一锅端”，将所有的mActiveViews都移入了二级缓存mScrapViews，而RecyclerView则是更加灵活地对每个View修改标志位，区分是否重新bindView。

## 三.结论

在一些场景下，如界面初始化，滑动等，ListView和RecyclerView都能很好地工作，两者并没有很大的差异：

文章的开头便抛出了这样一个问题，微信Android客户端卡券模块，大部分UI都是以列表页的形式展示，实现方式为ListView，是否有必要将其替换成RecyclerView呢？
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726832293243130df30f1e5310b2ccce03602d.jpg)

答案是否定的，从性能上看，RecyclerView并没有带来显著的提升，不需要频繁更新，暂不支持用动画，意味着RecyclerView优势也不太明显，没有太大的吸引力，ListView已经能很好地满足业务需求。

数据源频繁更新的场景，如弹幕：Recyclerview实现的弹幕 （旧）等RecyclerView的优势会非常明显；

进一步来讲，结论是：
`列表页展示界面，需要支持动画，或者频繁更新，局部刷新，建议使用RecyclerView，更加强大完善，易扩展；其它情况(如微信卡包列表页)两者都OK，但ListView在使用上会更加方便，快捷。`

Ps：仅从一个角度做了对比，盲人摸象，有误跪求指正。

## 四.参考资料   

* ListView  
a. Android-23源码
b. Android ListView工作原理解析，带你从源码的角度彻底理解：Android ListView工作原理完全解析，带你从源码的角度彻底理解
c. Android自己动手写ListView学习其原理：http://blog.csdn.net/androiddevelop/article/details/8734255  

* RecyclerView  
a. RecyclerView-v7-23.4.0源码
b. RecyclerView剖析：RecyclerView剖析
c. RecyclerView剖析：http://blog.csdn.net/qq_23012315/article/details/51096696
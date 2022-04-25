---
title: "为可以滚动的View设置Padding和滚动条时需要注意什么"
slug: "what-should-i-pay-attention-to-when-setting-up-padding-and-scrollbars-for-a-scrollable-view"
date: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
cover: 
    image: "https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/164672680706304b4c437e534e3747335f4f8cfc70.gif"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
这个tips由Android Developers分享自Google+的， 我觉得这个tip对于UI体验确实很有用，所以我自己也写了一个demo来看看效果到底怎样，不过到底要不要这样做，取决于你的app的整体设计了。我们 可能经常为可以滚动的container（容器）设置padding和scrollbar，比如ListView、GridVie和ScrollView 等，但我们却忽略了几个重要的属性，导致这样设置之后效果并不是很好。

 

如何你在具有滚动功能的容器上设置paddingTop 和paddingBottom属性之后，你必须确保你已经设置clipToPadding?属性为false 来保证当内容滚动的时候，paddingTop 和paddingBottom随之“滚掉”，如果你不这样做的话，你的内容就像在很小的地方滚动一样，这可能导致你的app在视觉上出现故障。

如果你设置了paddingLeft 或者paddingRight——很好，paddingTop或者paddingBottom，确保滚动条相对应在内容上面，而应该尽可能地在屏幕的边缘。为了达到这样的效果，只需要简单的设置scrollbarStyle属性为outsideOverlay。
```xml
<ListView
…
android:clipToPadding=”false”
android:scrollbarStyle=”outsideOverlay” />
```
总的来说就是，当你为容器（可以滚动的）设置了padding属性之后，你应该同时也设置 效果图如图所示：
![](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/164672680706304b4c437e534e3747335f4f8cfc70.gif)
原文:

Today’s?#AndroidDev?and?#AndroidDesign?#Protip?from+Roman Nurik?is about padding and scroll indicators for scrollable containers like list views.

We do quite a bit of app UI review here on the Android Developer Relations team and one of the common issues with UI fit-and-finish we come across is improper padding and scroll indicators for padded scroll containers like?ListViews,?GridViews, and?ScrollViews.

If you set top or bottom padding on your scroll container, make sure to set the?clipToPadding attribute to false?to ensure that as content scrolls, the padding scrolls away with it. If you don’t set this attribute, your content will seem to scroll off into thin air, which can lead to a breakdown in your app’s visual depth and hierarchy.

If you set left or right—well, start or end—padding on your scroll container (which you often should, per theMetrics and Grids?section of the Android Design guide [1]), make sure scroll indicators hug the screen edges where possible, rather than the inset content. To do so, simply set the?scrollbarStyle attribute to “outsideOverlay”.?This declutters content visuals and makes scrollbars feel a bit more consistent?across your app.

In summary:

<ListView
…
android:clipToPadding=”false”
android:scrollbarStyle=”outsideOverlay”?/>

An illustration of these issues can be found in the attached animation and diagram.

That’s all for today, but if you have any other fit-and-finish protips, let’s hear them in the comments!

[1] Metrics and Grids: http://goo.gl/4u8LeX
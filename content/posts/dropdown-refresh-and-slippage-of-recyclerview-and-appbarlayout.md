---
title: "RecyclerView与AppBarLayout 组合的下拉刷新、滑动不顺畅的问题"
slug: "dropdown-refresh-and-slippage-of-recyclerview-and-appbarlayout"
date: 2018-07-08T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "滑动有粘性滑动有粘性，需要在拉一次才能生效，解决办法:mRecylerview.addOnScrollListener(newRe"

---
                
## 滑动有粘性
滑动有粘性，需要在拉一次才能生效，解决办法:
```java
mRecylerview.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                    int firstVisiblePosition = layoutManager.findFirstCompletelyVisibleItemPosition();
                    if (firstVisiblePosition == 0) {
                        mAppbar.setExpanded(true, true);
                    }
                }
            }
        });
```
## 下拉刷新
如果appBarLayout中有折叠控件 CollapsingToolbarLayout 或者其他一些控件 在滚动的时候进行判断和刷新事件处理:
第一步:设置appBarLayout的监听:
```
if (appBarLayout != null)  
            appBarLayout.addOnOffsetChangedListener(this);  
```
第二部:
```
@Override  
public void onOffsetChanged(AppBarLayout appBarLayout, int i) {  
    super.onOffsetChanged(appBarLayout, i);  
    if (srlLayout == null) return;  
    srlLayout.setEnabled(i >= 0||isSlideToBottom(recyclerview) ? true : false);  
}  
```
i==0 表示appBarLayout 完全显示:需要开启能够刷新控件的触摸事件。

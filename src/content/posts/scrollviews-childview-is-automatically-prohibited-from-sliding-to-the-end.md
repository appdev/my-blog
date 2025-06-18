---
title: "禁止ScrollView的childview自动滑动到底部"
slug: "scrollviews-childview-is-automatically-prohibited-from-sliding-to-the-end"
published: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
问题描述： 
一个 ScrollView 中包含了好几个 childView，有一个 childview 很大，一个屏幕显示不完，每个 childview 都能获取 focus。当那个很大的 chilvView 获取焦点时，由于一屏显示不完，它就会自动滑动到最后（就是该 childView 的底部）。  
问题原因以及解决方案分析：  
由于该 childView 超过屏幕大小，并且有获取焦点的能力，所以造成了该问题。由于不能改变其大小，只能阻止其获取焦点。基本思路有，取消它获取焦点的能力，让 ScrovView 截获它的焦点等。以下是具体方法：  
### 方法一：简单，方便，快捷，直面关键问题  
将可能自动滑动的 childview 的 focus 禁掉，防止它自动滑动  
           ` mContentTextBox.setFocusable(false);`  
恢复默认状态，允许 childview 的 focus，使它可以自动滑动  
`mContentTextBox.setFocusableInTouchMode(true);
mContentTextBox.setFocusable(true);`
这里要注意，仅仅 setFocusable 为 true 是不够的，需要设置 `setFocusableInTouchMode。`  
### 方法二：绕了一点，副作用不大（推荐）  
让 ScrollView 优先获取 focus，这样 childview 获取不到 focus，就不会滑动  
```java
 private void disableAutoScrollToBottom() {
        mScrollView.setDescendantFocusability(ViewGroup.FOCUS_BEFORE_DESCENDANTS);
        mScrollView.setFocusable(true);
        mScrollView.setFocusableInTouchMode(true);
        mScrollView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                v.requestFocusFromTouch();
                return false;
            }
        });
    }
恢复默认状态，禁掉 scrollview 的 focus，这样就允许 childview 自动滑动
    private void enableChildAutoScrollToBottom() {
        mScrollView.setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
        mScrollView.setFocusable(false);
        mScrollView.setFocusableInTouchMode(false);
        mScrollView.setOnTouchListener(null);
    }
```
### 方法三：这个方法比较死板，不太灵活，虽然能满足基本需求，副作用很大
```java
    @Override
    protected boolean onRequestFocusInDescendants(int direction, Rect previouslyFocusedRect) {
        return true;
    }
```
### 方法四：和方法三类似
```java
    @Override
    protected int computeScrollDeltaToGetChildRectOnScreen(Rect rect) {
        return 0;
    }
```
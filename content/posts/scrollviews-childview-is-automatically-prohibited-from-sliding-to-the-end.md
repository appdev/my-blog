---
title: "禁止ScrollView的childview自动滑动到底部"
slug: "scrollviews-childview-is-automatically-prohibited-from-sliding-to-the-end"
date: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "问题描述:一个ScrollView中包含了好几个childView，有一个childview很大，一个屏幕显示不完，每个childview都"

---
                
问题描述:  
一个ScrollView中包含了好几个childView，有一个childview很大，一个屏幕显示不完，每个childview都能获取focus。当那个很大的chilvView获取焦点时，由于一屏显示不完，它就会自动滑动到最后（就是该childView的底部）。  

问题原因以及解决方案分析：  

由于该childView超过屏幕大小，并且有获取焦点的能力，所以造成了该问题。由于不能改变其大小，只能阻止其获取焦点。基本思路有，取消它获取焦点的能力，让ScrovView截获它的焦点等。以下是具体方法：  

### 方法一：简单，方便，快捷，直面关键问题  

将可能自动滑动的childview的focus禁掉，防止它自动滑动  
           ` mContentTextBox.setFocusable(false);`  

恢复默认状态，允许childview的focus，使它可以自动滑动  
`mContentTextBox.setFocusableInTouchMode(true);
mContentTextBox.setFocusable(true);`
这里要注意，仅仅setFocusable为true是不够的，需要设置`setFocusableInTouchMode。`  

### 方法二： 绕了一点，副作用不大（推荐）  

让ScrollView优先获取focus，这样childview获取不到focus，就不会滑动  
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

恢复默认状态，禁掉scrollview的focus，这样就允许childview自动滑动
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
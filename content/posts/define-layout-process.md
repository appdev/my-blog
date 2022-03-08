---
title: "⾃定义布局流程"
slug: "define-layout-process"
date: 2021-01-25T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "⾃定义布局流程布局过程确定每个View的位置和尺⼨作⽤：为绘制和触摸范围做⽀持绘制：知道往哪⾥绘制触摸反馈：知道⽤户点"

---
                
# ⾃定义布局流程

## 布局过程

- 确定每个 View 的位置和尺⼨
- 作⽤：为绘制和触摸范围做⽀持

- 绘制：知道往哪⾥绘制

- 触摸反馈：知道⽤户点的是哪⾥–

## 流程
#### 从整体看

 
- 测量流程：从根 View 递归调⽤每⼀级⼦ View 的 measure() ⽅法，对它们进⾏测量

- 布局流程：从根 View 递归调⽤每⼀级⼦ View 的 layout() ⽅法，把测量过程得出的⼦ View

的位置和尺⼨传给⼦ View，⼦ View 保存

- 为什么要分两个流程？

#### 从个体看，对于每个 View：

1. 运⾏前，开发者在 xml ⽂件⾥写⼊对 View 的布局要求 layout_xxx

2. ⽗ View 在⾃⼰的 onMeasure() 中，根据开发者在 xml 中写的对⼦ View 的要求，和⾃⼰的可⽤空间，得出对⼦ View 的具体尺⼨要求

3. ⼦ View 在⾃⼰的 onMeasure() 中，根据⾃⼰的特性算出⾃⼰的期望尺⼨

- 如果是 ViewGroup，还会在这⾥调⽤每个⼦ View 的 measure() 进⾏测量

4. ⽗ View 在⼦ View 计算出期望尺⼨后，得出⼦ View 的实际尺⼨和位置

5. ⼦ View 在⾃⼰的 layout() ⽅法中，将⽗ View 传进来的⾃⼰的实际尺⼨位置保存

- 如果是 ViewGroup，还会在 onLayout() ⾥调⽤每个字 View 的 layout() 把它们的尺⼨

位置传给它们

  

### 具体开发

#### 继承已有的 View，简单改写它们的尺⼨：重写 onMeasure()：SquareImageView
1. 重写 onMeasure()
2. ⽤ getMeasuredWidth() 和 getMeasuredSize() 获取到测量出的尺⼨
3. 计算出最终要的尺⼨
4. ⽤ setMeasuredDimension(width, height) 把结果保存

```java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
	super.onMeasure(widthMeasureSpec, heightMeasureSpec);

	int width = getMeasuredWidth();
	int height = getMeasuredHeight();
	int size = Math.min(width, height);

	setMeasuredDimension(size, size);
}
```

###  对⾃定义 View 完全进⾏⾃定义尺⼨计算：重写 onMeasure()：CircleView

1. 重写 onMeasure()
2. 计算出⾃⼰的尺⼨
4. ⽤ resolveSize() 或者 resolveSizeAndState() 修正结果
	- resolveSize() / resolveSizeAndState() 内部实现（⼀定读⼀下代码，这个极少需要⾃⼰写，但⾯试时很多时候会考）：
		- ⾸先⽤ MeasureSpec.getMode(measureSpec) 和MeasureSpec.getSize(measureSpec) 取出⽗ 对⾃⼰的尺⼨限制类型和具体限制尺⼨；
		- 如果 measure spec 的 mode 是 EXACTLY，表示⽗ View 对⼦ View 的尺⼨做出了精确限制，所以就放弃计算出的 size，直接选⽤ measure spec 的 size；
		- 如果 measure spec 的 mode 是 AT_MOST，表示⽗ View 对⼦ View 的尺⼨只限制了上限，需要看情况：
			- 如果计算出的 size 不⼤于 spec 中限制的 size，表示尺⼨没有超出限制，所以选⽤计算出的 size；
			- ⽽如果计算出的 size ⼤于 spec 中限制的 size，表示尺⼨超限了，所以选⽤spec 的 size，并且在 resolveSizeAndState() 中会添加标志
			- MEASURED_STATE_TOO_SMALL（这个标志可以辅助⽗ View 做测量和布局的计算；
		- 如果 measure spec 的 mode 是 UNSPECIFIED，表示⽗ View 对⼦ View 没有任何尺⼨限制，所以直接选⽤计算出的 size，忽略 spec 中的 size。
5. 使⽤ setMeasuredDimension(width, height) 保存结果

```Java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

	int width = (int) ((PADDING + RADIUS) * 2);
	int height = (int) ((PADDING + RADIUS) * 2)
	setMeasuredDimension(resolveSizeAndState(width, widthMeasureSpec,0),
	resolveSizeAndState(height, heightMeasureSpec, 0));

}
```


####  ⾃定义 Layout：重写 onMeasure() 和 onLayout()：TagLayout

1. 重写 onMeasure()
	- 遍历每个⼦ View，⽤ measureChildWidthMargins() 测量⼦ View需要重写 generateLayoutParams() 并返回 MarginLayoutParams 才能使⽤measureChildWithMargins() ⽅法
	- 有些⼦ View 可能需要重新测量（⽐如换⾏处）
	- 测量完成后，得出⼦ View 的实际位置和尺⼨，并暂时保存

```Java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

for (int i = 0; i < getChildCount(); i++) {
	View child = getChildAt(i);

	Rect childBounds = childrenBounds[i];

	// 测量⼦ View

	measureChildWithMargins(child, widthMeasureSpec,

	widthUsed,

	heightMeasureSpec, heightUsed);

	// 保存⼦ View 的位置和尺⼨

	childBounds.set(childlLeft, childTop, childLeft

	+ child.getMeasuredWidth(), chiltTop

	+ child.getMeasuredHeight());

	......

}

// 计算⾃⼰的尺⼨，并保存

int width = ...;

int height = ...;

	setMeasuredDimension(resolveSizeAndState(width,widthMeasureSpec, 0),resolveSizeAndState(height, heightMeasureSpec,0));

}
```


- measureChildWidthMargins() 的内部实现（最好读⼀下代码，这个极少需要⾃⼰写，但⾯试时很多时候会考）：
		- 通过 getChildMeasureSpec(int spec, int padding, int childDimension) ⽅法计算出⼦ View 的 widthMeasureSpec 和 heightMeasureSpec，然后调⽤ child.measure() ⽅法来让⼦ View ⾃我测量；

```Java
protected void measureChildWithMargins(View child,  
 int parentWidthMeasureSpec, int widthUsed,  
 int parentHeightMeasureSpec, int heightUsed) {  
 final MarginLayoutParams lp \= (MarginLayoutParams) child.getLayoutParams();  
  
 final int childWidthMeasureSpec \= getChildMeasureSpec(parentWidthMeasureSpec,  
 mPaddingLeft \+ mPaddingRight \+ lp.leftMargin \+ lp.rightMargin  
                    \+ widthUsed, lp.width);  
 final int childHeightMeasureSpec \= getChildMeasureSpec(parentHeightMeasureSpec,  
 mPaddingTop \+ mPaddingBottom \+ lp.topMargin \+ lp.bottomMargin  
                    \+ heightUsed, lp.height);  
  
 child.measure(childWidthMeasureSpec, childHeightMeasureSpec);  
}
```

- getChildMeasureSpec(int spec, int padding, int childDimension) ⽅法的内部实现是，结合开发者设置的 LayoutParams 中的 width 和 height 与⽗ View ⾃⼰的剩余可⽤空间，综合得出⼦ View 的尺⼨限制，并使⽤`MeasureSpec.makeMeasureSpec(size, mode) `来求得结果：

```Java
    public static int getChildMeasureSpec(int spec, int padding, int childDimension) {
        int specMode = MeasureSpec.getMode(spec);
        int specSize = MeasureSpec.getSize(spec);

        int size = Math.max(0, specSize - padding);

        int resultSize = 0;
        int resultMode = 0;

        switch (specMode) {
        // Parent has imposed an exact size on us
        case MeasureSpec.EXACTLY:
            if (childDimension >= 0) {
                resultSize = childDimension;
                resultMode = MeasureSpec.EXACTLY;
            } else if (childDimension == LayoutParams.MATCH_PARENT) {
                // Child wants to be our size. So be it.
                resultSize = size;
                resultMode = MeasureSpec.EXACTLY;
            } else if (childDimension == LayoutParams.WRAP_CONTENT) {
                // Child wants to determine its own size. It can't be
                // bigger than us.
                resultSize = size;
                resultMode = MeasureSpec.AT_MOST;
            }
            break;

        // Parent has imposed a maximum size on us
        case MeasureSpec.AT_MOST:
            if (childDimension >= 0) {
                // Child wants a specific size... so be it
                resultSize = childDimension;
                resultMode = MeasureSpec.EXACTLY;
            } else if (childDimension == LayoutParams.MATCH_PARENT) {
                // Child wants to be our size, but our size is not fixed.
                // Constrain child to not be bigger than us.
                resultSize = size;
                resultMode = MeasureSpec.AT_MOST;
            } else if (childDimension == LayoutParams.WRAP_CONTENT) {
                // Child wants to determine its own size. It can't be
                // bigger than us.
                resultSize = size;
                resultMode = MeasureSpec.AT_MOST;
            }
            break;

        // Parent asked to see how big we want to be
        case MeasureSpec.UNSPECIFIED:
            if (childDimension >= 0) {
                // Child wants a specific size... let him have it
                resultSize = childDimension;
                resultMode = MeasureSpec.EXACTLY;
            } else if (childDimension == LayoutParams.MATCH_PARENT) {
                // Child wants to be our size... find out how big it should
                // be
                resultSize = View.sUseZeroUnspecifiedMeasureSpec ? 0 : size;
                resultMode = MeasureSpec.UNSPECIFIED;
            } else if (childDimension == LayoutParams.WRAP_CONTENT) {
                // Child wants to determine its own size.... find out how
                // big it should be
                resultSize = View.sUseZeroUnspecifiedMeasureSpec ? 0 : size;
                resultMode = MeasureSpec.UNSPECIFIED;
            }
            break;
        }
        //noinspection ResourceType
        return MeasureSpec.makeMeasureSpec(resultSize, resultMode);
    }
```

> 注意：源码中的分类⽅式是先⽐较⾃⼰的 MeasureSpec 中的 mode，再
⽐较开发者设置的 layout_width 和 layout_height，⽽我给出的判断⽅式
（下⾯的这⼏段内容）是先⽐较 layout_width 和 layout_height，再⽐较
⾃⼰ MeasureSpec 中的 mode。两种分类⽅法都能得出正确的结果，但
源码中的分类⽅法在逻辑上可能不够直观，如果你读源码理解困难，可以
尝试⽤我上⾯的这种⽅法来理解。

-  如果开发者写了具体值（例如 layout_width="24dp"），就不⽤再考虑⽗View 的剩余空间了，直接⽤ LayoutParams.width / height 来作为⼦ View的限制 size，⽽限制 mode 为 EXACTLY（为什么？课堂上说过，因为软件的直接开发者——即 xml 布局⽂件的编写者——的意⻅最重要，发⽣冲突的时候应该以开发者的意⻅为准。换个⻆度说，如果真的由于冲突导致界⾯不正确，开发者可以通过修改 xml ⽂件来解决啊，所以开发者的意⻅是第⼀位，但你如果设计成冲突时开发者的意⻅不在第⼀位，就会导致软件的可配置性严重降低）；  

-  如果开发者写的是 MATCH_PARENT，即要求填满⽗控件的可⽤空间，那么由于⾃⼰的可⽤空间和⾃⼰的两个 MeasureSpec 有关，所以需要根据⾃⼰的 widthMeasureSpec 或 heightMeasureSpec 中的 mode 来分情况判断 
	1. 如果⾃⼰的 spec 中的 mode 是 EXACTLY 或者 AT_MOST，说明⾃⼰的尺⼨有上限，那么把 spec 中的 size 减去⾃⼰的已⽤宽度或⾼度，就是⾃⼰可以给⼦ View 的 size；⾄于 mode，就⽤ EXACTLY（注意：就算⾃⼰的 mode 是 AT_MOST，传给⼦ View 的也是EXACTLY，想不通的话好好琢磨⼀下）
	2. 如果⾃⼰的 spec 中的 mode 是 UNSPECIFIED，说明⾃⼰的尺⼨没有上限，那么让⼦ View 填满⾃⼰的可⽤空间就⽆从说起，因此选⽤退让⽅案：给⼦ View 限制的 mode 就设置为 UNSPECIFIED，size 写 0 就好

- 如果开发者写的是 WRAP_CONTENT，即要求⼦ View 在不超限制的前提下⾃我测量，那么同样由于⾃⼰的可⽤空间和⾃⼰的两个 MeasureSpec 有关，所以也需要根据⾃⼰的 widthMeasureSpec 和 heightMeasureSpec中的 mode 来分情况判断：
	1. 如果⾃⼰的 spec 中的 mode 是 EXACTLY 或者 AT_MOST，说明⾃⼰的尺⼨有上限，那么把 spec 中的 size 减去⾃⼰的已⽤宽度或⾼度，就是⾃⼰可以给⼦ View 的尺⼨上限；⾄于 mode，就⽤AT_MOST（注意，就算⾃⼰的 mode 是 EXACTLY，传给⼦ View 的也是 AT_MOST，想不通的话好好琢磨⼀下；
	2. 如果⾃⼰的 spec 中的 mode 是 UNSPECIFIED，说明⾃⼰的尺⼨没上限，那么也就不必限制⼦ View 的上限，因此给⼦ View 限制的mode 就设置为 UNSPECIFIED，size 写 0 就好

- 测量出所有⼦ View 的位置和尺⼨后，计算出⾃⼰的尺⼨，并⽤setMeasuredDimension(width, height) 保存

- 重写 onLayout()
	- 遍历每个⼦ View，调⽤它们的 layout() ⽅法来将位置和尺⼨传给它们
```java
protected void onLayout(boolean changed, int l, int t, int r, int b) {
	for (int i = 0; i < getChildCount(); i++) {
		View child = getChildAt(i);
		Rect childBounds = childrenBounds[i];
		// 将每个⼦ View 的位置和尺⼨传递给它
		child.layout(childBounds.left, childBounds.top,
		childBounds.right, childBounds.bottom);
	 }
}
```
---
title: "优雅的给显示超长字符串的TextView加上省略号"
slug: "elegant-textview-for-displaying-super-long-strings-plus-ellipsis"
published: 2018-09-22T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
`TextView`应该是 Android 开发中使用频次非常高的一个基础控件。对于长文本，`TextView`默认的处理方案是换行显示，对于只需要单行显示的 `TextView`加上`android:singleLine="true"`即可让`TextView` 单行显示，同时如果文本超过一行自动加上省略号，但是如果 UI 是类似这种呢？再只使用一个控件的情况下，实现的这样的显示目前能想到的有一下几种。
![QQ20180922-180934@2x.png][2]
### 计算文字行数
第一种方法思路很简单，要实现这种效果只需要在还没有进行 `settext`方法之前就先判断一下文本是否超长，如果超过一行的长度就把第一行取出来，进行手动拼接后 (第一行文本+...等 X 人) 设置到`TextView` 上
#### 计算文本是否有多行
`TextView`自身就限制行数的 API 所以，判断文本有几行，这代码 `TextView`肯定已经有了，我们打开`TextView` 的源代码，果不其然
```java
···
 final StaticLayout.Builder layoutBuilder = StaticLayout.Builder.obtain(
                text, 0, text.length(),  mTempTextPaint, Math.round(availableSpace.right));
        layoutBuilder.setAlignment(getLayoutAlignment())
                .setLineSpacing(getLineSpacingExtra(), getLineSpacingMultiplier())
                .setIncludePad(getIncludeFontPadding())
                .setBreakStrategy(getBreakStrategy())
                .setHyphenationFrequency(getHyphenationFrequency())
                .setJustificationMode(getJustificationMode())
                .setMaxLines(mMaxMode == LINES ? mMaximum : Integer.MAX_VALUE)
                .setTextDirection(getTextDirectionHeuristic());
        final StaticLayout layout = layoutBuilder.build();
        // Lines overflow.
        if (maxLines != -1 && layout.getLineCount() > maxLines) {
            return false;
        }
···
```
`layout.getLineCount()` 可以看到 `StaticLayout`([StaticLayout][1] 用法) 这个类来判断文本行数的，我们整理一下代码，结合需求变成
(之所以是 `StaticLayout.Builder`而不直接是`StaticLayout`是因为在 API28 中，`StaticLayout` 已经被标记为 deprecated，而替代它的正是`StaticLayout.Builder`)  
```java
  /**
     * 判断是否有多行 文字处理
     */
    private boolean setLastIndexForLimit() {
        //实例化 StaticLayout 传入相应参数
        StaticLayout staticLayout = new StaticLayout(getText(), getPaint(),
                getMeasuredWidth() - getPaddingLeft() - getPaddingRight(),
                Layout.Alignment.ALIGN_NORMAL, 1, 0, false);
        return staticLayout.getLineCount() > 1;
    }
```
---
下面在介绍一种判断文本是否有多行的方法（感觉不是很准），通过`textview.getPaint().measureText(String text)`方法就可以获取渲染出来的文本的长度了。通过比较 `TextView` 的宽度和渲染出来的文本宽度就可以判断是否超过字符串长度了。
现在已经判断了文本是否有多行了，下一步就是取出第一行了
#### 取出第一行
结合 `StaticLayout` 可以通过取出第一行
```java
   //取出第一行
        String firstLineText =  getText().toString().substring(0,staticLayout.getLineEnd(0));
        firstLineText =  firstLineText .substring(0,firstLineText.length() - endText.length());
```
---
使用 `measureText` 方法可以通过不断测量文字看度的方法获取来判断
```
//测量出最后要加载结尾的字符的长度
val mViewWidth = textview.getMeasuredWidth()
float textWidth = getPaint().measureText(text);
 float ellipsisWidth = getPaint().measureText(“...等 X 人”);
            float authenticTextWidth = mViewWidth - ellipsisWidth;
            for (int i = 0; i < text.length(); i++) {
                if (getPaint().measureText(text.substring(0, i + 1)) > authenticTextWidth) {
                    text = text.substring(0, i) + endText;
                    break;
                }
            }
```
以上两种方法都可以取出第一行需要渲染的字符串，两种方式各有优缺点，但是共同的问题是**渲染出来的实际效果并不能跟 TextView 的长度匹配，有时候会出现明明 TextView 还有空间，但是已经显示...的情况**（原因可能是因为英文、数字跟汉字占得宽度不同的问题）
如果要更方便的使用继承 `TextView`，将以上方法封装到里面即可
### 将结尾文本渲染成图片
这种方法无疑是更方便简单，同时性能和效果上更好，虽然代码实现上没有什么复杂的代码，但是**思路很新颖**，我们做程序最重要的是解决问题的思路，很多时候我们可能换个思路困难就会迎刃而解
简单看看实现代码:
```java
  String sizeLength = “...等 X 人”;
            TextDrawable count = new TextDrawable(sizeLength, SizeUtils.sp2px(16), context.getResources().getColor(R.color.title), Color.TRANSPARENT, 0, 0);
            textView.setCompoundDrawables(null, null, count, null);
textView.setText(text)
```
  [1]: https://developer.android.com/reference/android/text/StaticLayout
  [2]: https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/qiniu/1646804609479QQ20180922-180934@2x.png
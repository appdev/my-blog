---
title: "Glide加载ImageView显示不全的问题(fitxy/centerCrop)"
slug: "glide-loading-imageview-display-incomplete-problem"
date: 2019-08-27T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "简单记录下，用了一个圆角处理，圆角里面了是centerCrop，设置ImageView控件的fitxy属性，也还是几率性的显示不全！代码是这"

---
                
简单记录下，用了一个圆角处理，圆角里面了是centerCrop，设置ImageView控件的fitxy属性，也还是几率性的显示不全！
代码是这样的：

```java
   GlideApp.with(imageView.getContext())
                .load(imgUrl)
                .apply(new RequestOptions().transform(new CircleCrop()).placeholder(placeHolder).error(placeHolder))
                .into(imageView);
```

然后我又网上查了下，发现有网友这样说：
> 由于位图尺寸导致问题:
如果Imageview中默认的占位图片大小没有填满Imageview,比如lmageview10080, 但是给Imageview设置占位图片后图片没有占满控件，例如控件被填了80*80，那么Glide加载图片的时候，会出现加载图片也是填满80*80的情况过一会才恢复正常100*80。

占位的问题？我看了下我自己的占位图片，确实尺寸跟代码设置的控件的尺寸不一样。然后就针对这个情况进行了填充设置 fitCenter
```java
  GlideApp.with(imageView.getContext())
                .setDefaultRequestOptions(new RequestOptions()
                        .centerCrop()
                        .placeholder(placeHolder).error(placeHolder)
                        .fitCenter()
                )
                .load(imgUrl)
                .apply(new RequestOptions().circleCrop())
                .into(imageView);
```


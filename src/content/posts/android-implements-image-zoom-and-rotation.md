---
title: "Android实现图片缩放与旋转"
slug: "android-implements-image-zoom-and-rotation"
published: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
本文使用 Matrix 实现 Android 实现图片缩放与旋转。示例代码如下：
```java
package com.android.matrix;import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ImageView.ScaleType;
/**
 * Android 实现图片缩放与旋转。
 * @author Administrator
 *
 */
public class MatixActivity extends Activity {
    public void onCreate(Bundle icicle) {
        super.onCreate(icicle);
        setTitle("Android 实现图片缩放与旋转。");
        LinearLayout linLayout = new LinearLayout(this);
        //加载需要操作的图片，这里是一张图片
        Bitmap bitmapOrg = BitmapFactory.decodeResource(getResources(),R.drawable.r);
        //获取这个图片的宽和高
        int width = bitmapOrg.getWidth();
        int height = bitmapOrg.getHeight();
        //定义预转换成的图片的宽度和高度
        int newWidth = 200;
        int newHeight = 200;
        //计算缩放率，新尺寸除原始尺寸
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        // 创建操作图片用的 matrix 对象
        Matrix matrix = new Matrix();
        // 缩放图片动作
        matrix.postScale(scaleWidth, scaleHeight);
        //旋转图片 动作
        matrix.postRotate(45);
        // 创建新的图片
        Bitmap resizedBitmap = Bitmap.createBitmap(bitmapOrg, 0, 0,
        width, height, matrix, true);
        //将上面创建的 Bitmap 转换成 Drawable 对象，使得其可以使用在 ImageView, ImageButton 中
        BitmapDrawable bmd = new BitmapDrawable(resizedBitmap);
        //创建一个 ImageView
        ImageView imageView = new ImageView(this);
        // 设置 ImageView 的图片为上面转换的图片
        imageView.setImageDrawable(bmd);
        //将图片居中显示
        imageView.setScaleType(ScaleType.CENTER);
        //将 ImageView 添加到布局模板中
        linLayout.addView(imageView,
        new LinearLayout.LayoutParams(
        LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT
        )
        );
        // 设置为本 activity 的模板
        setContentView(linLayout);
     }  }
```
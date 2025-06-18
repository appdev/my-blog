---
title: "Android的图片压缩类ThumbnailUtils"
slug: "androids-image-compression-class-thumbnailutils"
published: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
缩放图片目前一共有 3 中方式：
第一种是 BitmapFactory 和 BitmapFactory.Options。
第二种是使用 Bitmap 加 Matrix 来缩放。
第三种是用 2.2 新加的类 ThumbnailUtils 来做。
<!--more-->
之前一直使用第二种 Matrix 来做缩放。但是遇到原图比缩放的图片下的情况就会将图片自动回收报错。
看到新的类 ThumbnailUtils 就试了一下，果真 OK 了。
ThumbnailUtils 类里总共就只有这三个静态方法。下面是他们的一下说明和用法：
```java
1, extractThumbnail (source, width, height):
/**
 * 
 * 创建一个指定大小的缩略图
 * @param source 源文件 (Bitmap 类型)
 * @param width  压缩成的宽度
 * @param height 压缩成的高度
 */
ThumbnailUtils.extractThumbnail(source, width, height);
2, extractThumbnail(source, width, height, options):
/**
 * 创建一个指定大小居中的缩略图
 * 
 * @param source 源文件 (Bitmap 类型)
 * @param width  输出缩略图的宽度
 * @param height 输出缩略图的高度
 * @param options 如果 options 定义为 OPTIONS_RECYCLE_INPUT，则回收@param source 这个资源文件
 * (除非缩略图等于@param source)
 * 
 */
 ThumbnailUtils.extractThumbnail(source, width, height, options);
3, createVideoThumbnail(filePath, kind)
/**
 * 创建一张视频的缩略图
 * 如果视频已损坏或者格式不支持可能返回 null
 * 
 * @param filePath 视频文件路径  如：/sdcard/android.3gp
 * @param kind kind 可以为 MINI_KIND 或 MICRO_KIND
 * 
 */
ThumbnailUtils.createVideoThumbnail(filePath, kind);
```
 注意：此类不向下兼容。最低支持 2.2 版本
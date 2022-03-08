---
title: "Glide4加载图片RoundedCorners跟CenterCrop冲突问题解决"
slug: "RoundedCorners-conflicts-with-CenterCrop"
date: 2018-10-25T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "在glide4.0上面centerCrop和圆角图片有冲突只能显示一个类似这个:Glide.with(TPApplication.get"

---
                
在glide4.0上面 centerCrop和圆角图片有冲突只能显示一个
类似这个:
```java
Glide.with(TPApplication.getAppContext())
                .load(url)
                .centerCrop()
                .transform(glideRoundTransform)
                .placeholder(R.drawable.nearby_online_me_photo)
                .diskCacheStrategy(DiskCacheStrategy.ALL)
                .dontAnimate()
                .into(this);
```
### 分析 

点开`centerCrop()`这个代。
```java
  /**
   * Applies {@link CenterCrop} to all default types and
   * throws an exception if asked to transform an unknown type.
   *
   * <p>this will override previous calls to {@link #dontTransform()} ()}.
   *
   * @see #transform(Class, Transformation)
   * @see #optionalCenterCrop()
   */
  public RequestOptions centerCrop() {
    return transform(DownsampleStrategy.CENTER_OUTSIDE, new CenterCrop());
  }
```
可以看到`CenterCrop`也是调用的 `transform`的方法，在点开 `new Centercrop()`这个方法看看里面的实现
```java

public class CenterCrop extends BitmapTransformation {
  private static final String ID = "com.bumptech.glide.load.resource.bitmap.CenterCrop";
  private static final byte[] ID_BYTES = ID.getBytes(CHARSET);
 
  public CenterCrop() {
    // Intentionally empty.

...
```
不出所料 这里面也是继承了`BitmapTransformation`这个类然后重画了一边，后面我们自己有调用了`transform()`这个方法等于把系统的`Centercrop`这个方法给覆盖了

### 解决

#### 自定义BitmapTransformation
可以直接继承`CenterCrop `修改`transform`方法:
```
  @Override
    protected Bitmap transform(BitmapPool pool, Bitmap toTransform, int outWidth, int outHeight) {
        //glide4.0+
        Bitmap transform = super.transform(pool, toTransform, outWidth, outHeight);
        return roundCrop(pool, transform);
        //glide3.0
        //return roundCrop(pool, toTransform);
    }

    private static Bitmap roundCrop(BitmapPool pool, Bitmap source) {
        if (source == null) return null;

        Bitmap result = pool.get(source.getWidth(), source.getHeight(), Bitmap.Config.ARGB_8888);
        if (result == null) {
            result = Bitmap.createBitmap(source.getWidth(), source.getHeight(), Bitmap.Config.ARGB_8888);
        }

        Canvas canvas = new Canvas(result);
        Paint paint = new Paint();
        paint.setShader(new BitmapShader(source, BitmapShader.TileMode.CLAMP, BitmapShader.TileMode.CLAMP));
        paint.setAntiAlias(true);
        RectF rectF = new RectF(0f, 0f, source.getWidth(), source.getHeight());
        canvas.drawRoundRect(rectF, radius, radius, paint);
        return result;
    }

```
#### 修改顺序
Glide4.7+(低版本未测试)以上，可以使用:
```
val options = RequestOptions()
                .transforms(CenterCrop(),RoundedCorners(SizeUtils.dp2px(rounded)))
```


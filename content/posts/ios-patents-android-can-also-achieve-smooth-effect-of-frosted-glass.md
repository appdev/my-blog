---
title: "IOS的专利？Android也能流畅实现毛玻璃效果效果"
slug: "ios-patents-android-can-also-achieve-smooth-effect-of-frosted-glass"
date: 2018-08-14T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "背景介绍上图就是我们在IOS设备上经常能够见到的毛玻璃(高斯模糊)效果。不得不说，这种效果在适合的场景下使用，能够获得绝佳的美感。但是鉴于"
cover: 
    image: "https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726843423e828301e9bb83ebb14e1396324167.png"
    # alt: "alt text" # image alt text
    caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
![高斯模糊例图](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726843423e828301e9bb83ebb14e1396324167.png)
## 背景介绍
上图就是我们在IOS设备上经常能够见到的毛玻璃(高斯模糊)效果。不得不说，这种效果在适合的场景下使用，能够获得绝佳的美感。但是鉴于Android设备性能和兼容性问题，我们通常很难在Android设备上见到这种效果。
但这并不是IOS的专利效果，Android也能轻松流畅的实现。本篇文章将会详细的讲解如何实现。

## Android中的高斯模糊
### 我为什么选择RenderScript实现高斯模糊
目前Android设备上实现高斯模糊效果的方式通常有：    

1. 云端处理，移动客户端直接从网络获取处理好的图片。这种方式局限性很大。
- FastBlur等开源库。这种方式兼容性不错，但是效率极低。
- c实现。不懂c的理解困难。
- OpenGL实现。效果很好，但电量和内存消耗比较高。
- RenderScript实现。效果略弱于第4种，但是使用方便，速度很快，性能消耗在可接受范围内，加上Google的兼容性解决方案，可以说是能够作为优先考虑的方式。
### RenderScript
> RenderScript主要在android中的对图形进行处理，RenderScript采用C99语法进行编写，主要优势在于性能较高。在Api11的时候被加入到Android中。同时，Google提供了`android.support.v8.renderscript`兼容包，能够实现更低版本的兼容。 

RenderScript提供了一个用于实现高斯模糊的封装类ScriptIntrinsicBlur ，这货在Api17才被收编Android所以在不使用兼容包的情况下只能兼容到4.2的设备。但是，我们有兼容包啊向下兼容不是梦。

## 准备阶段

###引入兼容包

方法很简单，只需在build.gradle中加入:
```
 defaultConfig {
        。
        。
        。
        //就是这么简单
        renderscriptTargetApi 19
        renderscriptSupportModeEnabled true
    }
```
你以为这样就好了？nonono。  
由于一些坑人的厂商会深度定制Android系统，所以一些必要的依赖文件会被它们直接去掉！！这导致一些型号的设备上调用RenderScriptd的部分方法时会报错。所以我们得加上这些可能丢失的文件。  
其实也简单，打开`android_sdk/build-tools/`选择19以上版本`/renderscript/lib/packaged`我们可以看见3个包含.os文件的文件夹。
![SO文件](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268440385c5249ec1623416297fc054bef4e0.png)
直接复制这三个文件加到项目工程的jniLibs 包下。什么？找不见jniLibs包？自己建一个喽。
![jniLibs文件夹](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/164672684444382d27bba64fe05e3d052ff27fa4b6.png)
注意，这时候，我们很可能遇到一个崩溃，找不到.os文件。莫慌莫慌...
在build.gradle的android{}中加入：
```
sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }
```
没完没了!最后一步只针对使用的混淆的同学，需要在混淆中加入：
```
-keep class android.support.v8.renderscript.** { *; }
```
## 实现高斯模糊
终于可以开始写代码了。先来看看效果。下图高斯模糊半径逐渐增大的效果，请忽略渣渣录屏效果
![效果图](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726844970d7f64768e2a9b60a5fbea888cd96a.gif)
- 将ScriptIntrinsicBlur封装成工具类。咱们代码里接着款
```java
import android.support.v8.renderscript.*;  //这句很重要啊，v8包的，不然不能向下兼容啊。

public class RenderScriptGaussianBlur {
  private RenderScript rs;

  public RenderScriptGaussianBlur(Context context) {
    // 创建RenderScript内核对象
    this.rs = RenderScript.create(context);
  }


  /**
   * 将图片高斯模糊化
   * @param radius 模糊半径，由于性能限制，这个值的取值区间为(0,25f]
   * @param bitmapOriginal 源Bitmap
   */
  public Bitmap blur(float radius, Bitmap bitmapOriginal) {
    Bitmap bmp = Bitmap.createBitmap(bitmapOriginal);
    // 由于RenderScript并没有使用VM来分配内存,所以需要使用Allocation类来创建和分配内存空间。
    final Allocation input = Allocation.createFromBitmap(rs, bmp);
    //Type: “一个Type描述了一个Allocation或者并行操作的Element和dimensions ”
    Type type = input.getType();
    final Allocation output = Allocation.createTyped(rs, type);
    //创建一个模糊效果的RenderScript的工具对象
    //第二个参数Element相当于一种像素处理的算法，高斯模糊的话用这个就好
    final ScriptIntrinsicBlur script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
    //设置渲染的模糊程度, 25f是最大模糊度
    script.setRadius(radius);
    // 设置blurScript对象的输入内存
    script.setInput(input);
    // 将输出数据保存到输出刚刚创建的输出内存中
    script.forEach(output);
    // 将数据填充到bitmap中
    output.copyTo(bmp);

    //销毁它们释放内存
    input.destroy();
    output.destroy();
    script.destroy();
    type.destroy();
    return bmp;
  }

  public void destory(){
    this.rs.destroy();
  }
}
```
挺简单的几句，现在我们看看如何使用。

- 降低需要进行高斯模糊的图片质量
虽然说使用RenderScript能够高效的进行图片的高斯模糊，但是对于较大的图片还是显的力不从心。毕竟是要对每一个像素点都要进行处理。况且一般来说，高斯模糊后图片都比较模糊，我为何要用高清图？?
降低图片质量的代码相信大家都倒背如流了，这里就不再重复放码了。

- 图片的高斯模糊化一定要异步进行
```java
//处理化一个RenderScriptGaussianBlur，记得在Activity的onDestory()中调用destroy()释放内存
blurRender = new RenderScriptGaussianBlur(this);

//这段代码的效果就是每点击一次按钮，高斯模糊半径blurRadius就+1，
//然后在RxJava的Schedulers.computation()线程中进行Bitmap的高斯模糊化，
//接着在onNext()中将处理后获得的图片设置显示。
//也就是上图的效果
btn2.setOnClickListener(v -> {
      if (mBitmap != null && blurRadius <= 25) {
        Disposable d = Observable.create(new ObservableOnSubscribe<Bitmap>() {
          @Override
          public void subscribe(ObservableEmitter<Bitmap> e) throws Exception {
            LogUtils.e("当前blurRadius = " + blurRadius);
            //对图片进行高斯模糊处理
            Bitmap bitmap = blurRender.blur(blurRadius, mBitmap);
            blurRadius++;
            if (blurRadius == 25){
              blurRadius = 1;
            }
            e.onNext(bitmap);
            e.onComplete();
          }
        })
            .subscribeOn(Schedulers.computation()) //指定运算线程
            .observeOn(AndroidSchedulers.mainThread()) //切换回主线程
            .subscribeWith(new DisposableObserver<Bitmap>() {
              @Override
              public void onNext(Bitmap bitmap) {
                iv.setImageBitmap(bitmap); //展示图片
              }

              @Override
              public void onError(Throwable e) {}

              @Override
              public void onComplete() {}
            });
        disposable.add(d);
      }
    });
```
## 性能问题

测试机：Meizu M2 Note  
系统：Android 5.1

上图高斯模糊时的CPU及内存变化：
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268467126ead393248ac9962bfc9da7f68709.gif)
从上图可以看到，即使我原本在播放一个动画时的CPU使用率大概在6% 左右。在开始高斯模糊运算后，随着高斯模糊半径的逐渐增大，CPU峰值最大也就在21.3%。可见这种解决方案的效率是极高的。

## 总结
通过本篇的介绍，相信大家已经对这种在Android设备上实现高斯模糊效果的解决方案有所了解了。是不是手痒想亲自动手试一试呢？
当然啦，如果产品说要个高斯模糊的效果，还是那句话：IOS专利！Android做不了！?

> 本文转载于 `http://www.jianshu.com/p/1e402922ee32/`
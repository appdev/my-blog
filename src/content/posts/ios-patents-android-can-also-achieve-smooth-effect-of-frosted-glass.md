---
title: "IOS的专利？Android也能流畅实现毛玻璃效果效果"
slug: "ios-patents-android-can-also-achieve-smooth-effect-of-frosted-glass"
published: 2018-08-14T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
![高斯模糊例图](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726843423e828301e9bb83ebb14e1396324167.png)
## 背景介绍
上图就是我们在 IOS 设备上经常能够见到的毛玻璃 (高斯模糊) 效果。不得不说，这种效果在适合的场景下使用，能够获得绝佳的美感。但是鉴于 Android 设备性能和兼容性问题，我们通常很难在 Android 设备上见到这种效果。
但这并不是 IOS 的专利效果，Android 也能轻松流畅的实现。本篇文章将会详细的讲解如何实现。
## Android 中的高斯模糊
### 我为什么选择 RenderScript 实现高斯模糊
目前 Android 设备上实现高斯模糊效果的方式通常有：    
1. 云端处理，移动客户端直接从网络获取处理好的图片。这种方式局限性很大。
- FastBlur 等开源库。这种方式兼容性不错，但是效率极低。
- c 实现。不懂 c 的理解困难。
- OpenGL 实现。效果很好，但电量和内存消耗比较高。
- RenderScript 实现。效果略弱于第 4 种，但是使用方便，速度很快，性能消耗在可接受范围内，加上 Google 的兼容性解决方案，可以说是能够作为优先考虑的方式。
### RenderScript
> RenderScript 主要在 android 中的对图形进行处理，RenderScript 采用 C99 语法进行编写，主要优势在于性能较高。在 Api11 的时候被加入到 Android 中。同时，Google 提供了 `android.support.v8.renderscript` 兼容包，能够实现更低版本的兼容。 
RenderScript 提供了一个用于实现高斯模糊的封装类 ScriptIntrinsicBlur，这货在 Api17 才被收编 Android 所以在不使用兼容包的情况下只能兼容到 4.2 的设备。但是，我们有兼容包啊向下兼容不是梦。
## 准备阶段
###引入兼容包
方法很简单，只需在 build.gradle 中加入:
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
由于一些坑人的厂商会深度定制 Android 系统，所以一些必要的依赖文件会被它们直接去掉！！这导致一些型号的设备上调用 RenderScriptd 的部分方法时会报错。所以我们得加上这些可能丢失的文件。  
其实也简单，打开 `android_sdk/build-tools/`选择 19 以上版本`/renderscript/lib/packaged` 我们可以看见 3 个包含.os 文件的文件夹。
![SO 文件](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268440385c5249ec1623416297fc054bef4e0.png)
直接复制这三个文件加到项目工程的 jniLibs 包下。什么？找不见 jniLibs 包？自己建一个喽。
![jniLibs 文件夹](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/164672684444382d27bba64fe05e3d052ff27fa4b6.png)
注意，这时候，我们很可能遇到一个崩溃，找不到.os 文件。莫慌莫慌...
在 build.gradle 的 android{}中加入：
```
sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }
```
没完没了！最后一步只针对使用的混淆的同学，需要在混淆中加入：
```
-keep class android.support.v8.renderscript.** { *; }
```
## 实现高斯模糊
终于可以开始写代码了。先来看看效果。下图高斯模糊半径逐渐增大的效果，请忽略渣渣录屏效果
![效果图](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726844970d7f64768e2a9b60a5fbea888cd96a.gif)
- 将 ScriptIntrinsicBlur 封装成工具类。咱们代码里接着款
```java
import android.support.v8.renderscript.*;  //这句很重要啊，v8 包的，不然不能向下兼容啊。
public class RenderScriptGaussianBlur {
  private RenderScript rs;
  public RenderScriptGaussianBlur(Context context) {
    // 创建 RenderScript 内核对象
    this.rs = RenderScript.create(context);
  }
  /**
   * 将图片高斯模糊化
   * @param radius 模糊半径，由于性能限制，这个值的取值区间为 (0,25f]
   * @param bitmapOriginal 源 Bitmap
   */
  public Bitmap blur(float radius, Bitmap bitmapOriginal) {
    Bitmap bmp = Bitmap.createBitmap(bitmapOriginal);
    // 由于 RenderScript 并没有使用 VM 来分配内存，所以需要使用 Allocation 类来创建和分配内存空间。
    final Allocation input = Allocation.createFromBitmap(rs, bmp);
    //Type: “一个 Type 描述了一个 Allocation 或者并行操作的 Element 和 dimensions”
    Type type = input.getType();
    final Allocation output = Allocation.createTyped(rs, type);
    //创建一个模糊效果的 RenderScript 的工具对象
    //第二个参数 Element 相当于一种像素处理的算法，高斯模糊的话用这个就好
    final ScriptIntrinsicBlur script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
    //设置渲染的模糊程度，25f 是最大模糊度
    script.setRadius(radius);
    // 设置 blurScript 对象的输入内存
    script.setInput(input);
    // 将输出数据保存到输出刚刚创建的输出内存中
    script.forEach(output);
    // 将数据填充到 bitmap 中
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
虽然说使用 RenderScript 能够高效的进行图片的高斯模糊，但是对于较大的图片还是显的力不从心。毕竟是要对每一个像素点都要进行处理。况且一般来说，高斯模糊后图片都比较模糊，我为何要用高清图？?
降低图片质量的代码相信大家都倒背如流了，这里就不再重复放码了。
- 图片的高斯模糊化一定要异步进行
```java
//处理化一个 RenderScriptGaussianBlur，记得在 Activity 的 onDestory() 中调用 destroy() 释放内存
blurRender = new RenderScriptGaussianBlur(this);
//这段代码的效果就是每点击一次按钮，高斯模糊半径 blurRadius 就 +1，
//然后在 RxJava 的 Schedulers.computation() 线程中进行 Bitmap 的高斯模糊化，
//接着在 onNext() 中将处理后获得的图片设置显示。
//也就是上图的效果
btn2.setOnClickListener(v -> {
      if (mBitmap != null && blurRadius <= 25) {
        Disposable d = Observable.create(new ObservableOnSubscribe<Bitmap>() {
          @Override
          public void subscribe(ObservableEmitter<Bitmap> e) throws Exception {
            LogUtils.e("当前 blurRadius = " + blurRadius);
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
上图高斯模糊时的 CPU 及内存变化：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268467126ead393248ac9962bfc9da7f68709.gif)
从上图可以看到，即使我原本在播放一个动画时的 CPU 使用率大概在 6% 左右。在开始高斯模糊运算后，随着高斯模糊半径的逐渐增大，CPU 峰值最大也就在 21.3%。可见这种解决方案的效率是极高的。
## 总结
通过本篇的介绍，相信大家已经对这种在 Android 设备上实现高斯模糊效果的解决方案有所了解了。是不是手痒想亲自动手试一试呢？
当然啦，如果产品说要个高斯模糊的效果，还是那句话：IOS 专利！Android 做不了！?
> 本文转载于 `http://www.jianshu.com/p/1e402922ee32/`
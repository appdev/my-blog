---
title: "Android 开发绕不过的坑：你的 Bitmap 究竟占多大内存？"
slug: "android-develops-a-hole-how-much-memory-does-your-bitmap-occupy"
date: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

cover: 
    image: "https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726823898b4a0ff24c87c463182c6ea2759cc0.png"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
![](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726823898b4a0ff24c87c463182c6ea2759cc0.png)

!!!
<p>原文出处：<a href="http://bugly.qq.com/bbs/forum.php?mod=viewthread&tid=498" _src="http://bugly.qq.com/bbs/forum.php?mod=viewthread&tid=498">http://bugly.qq.com/bbs/forum.php?mod=viewthread&amp;tid=498</a>&nbsp;</p><h2>0、写在前面<br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(62, 62, 62); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/></h2><p>本文涉及到屏幕密度的讨论，这里先要搞清楚 DisplayMetrics 的两个变量，摘录官方文档的解释：</p><ul class=" list-paddingleft-2"><li><p>density：The logical density of the display. This is a scaling factor for the Density Independent Pixel unit, where one DIP is one pixel on an approximately 160 dpi screen (for example a 240x320, 1.5”x2” screen), providing the baseline of the system’s display. Thus on a 160dpi screen this density value will be 1; on a 120 dpi screen it would be .75; etc.</p>  <p>This value does not exactly follow the real screen size (as given by xdpi and ydpi, but rather is used to scale the size of the overall UI in steps based on gross changes in the display dpi. For example, a 240x320 screen will have a density of 1 even if its width is 1.8”, 1.3”, etc. However, if the screen resolution is increased to 320x480 but the screen size remained 1.5”x2” then the density would be increased (probably to 1.5).</p></li><li><p>densityDpi：The screen density expressed as dots-per-inch.</p></li></ul><p>简单来说，可以理解为 density 的数值是 1dp=density px；densityDpi 是屏幕每英寸对应多少个点（不是像素点），在 DisplayMetrics 当中，这两个的关系是线性的：</p><table cellspacing="0" class="t_table" width="665"><tbody style="word-wrap: break-word; margin: 0px; padding: 0px;"><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px;" class="firstRow"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">density</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">1</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">1.5</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">2</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">3</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">3.5</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">4</td></tr><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px; background-color: rgb(248, 248, 248);"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">densityDpi</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">160</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">240</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">320</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">480</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">560</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">640</td></tr></tbody></table><p>为了不引起混淆，本文所有提到的密度除非特别说明，都指的是 densityDpi，当然如果你愿意，也可以用 density 来说明问题。</p><p>另外，本文的依据主要来自 android 5.0 的源码，其他版本可能略有出入。文章难免疏漏，欢迎指正～</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><h2>1、占了多大内存？<br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(62, 62, 62); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/></h2><p>做移动客户端开发的朋友们肯定都因为图头疼过，说起来曾经还有过 leader 因为组里面一哥们在工程里面加了一张 jpg 的图发脾气的事儿，哈哈。</p><p>为什么头疼呢？吃内存呗，时不时还给你来个 OOM 冲冲喜，让你的每一天过得有滋有味（真是没救了）。那每次工程里面增加一张图片的时候，我们都需要关心这货究竟要占多大的坑，占多大呢？Android API 有个方便的方法，</p><pre class="brush:js;toolbar:false">public&nbsp;final&nbsp;int&nbsp;getByteCount()&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;int&nbsp;result&nbsp;permits&nbsp;bitmaps&nbsp;up&nbsp;to&nbsp;46,340&nbsp;x&nbsp;46,340
&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;getRowBytes()&nbsp;*&nbsp;getHeight();
}</pre><p></p><p>通过这个方法，我们就可以获取到一张 Bitmap 在运行时到底占用多大内存了。</p><hr class="l" style="word-wrap: break-word; margin: 0px; padding: 0px; clear: both; height: 1px; border: none; color: rgb(237, 237, 237); background: rgb(237, 237, 237);"/><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><p>举个例子</p><p>一张&nbsp;522x686&nbsp;的&nbsp;PNG&nbsp;图片，我把它放到&nbsp;drawable-xxhdpi&nbsp;目录下，在三星s6上加载，占用内存2547360B，就可以用这个方法获取到。</p><h2>2、给我一张图我告诉你占多大内存<br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></h2><p>每次都问 Bitmap 你到底多大啦。。感觉怪怪的，毕竟我们不能总是去问，而不去搞清楚它为嘛介么大吧。能不能给它算个命，算算它究竟多大呢？当然是可以的，很简单嘛，我们直接顺藤摸瓜，找出真凶，哦不，找出答案。</p><h3>2.1 getByteCount</h3><p>getByteCount 的源码我们刚刚已经认识了，当我们问 Bitmap 大小的时候，这孩子也是先拿到出生年月日，然后算出来的，那么问题来了，getHeight 就是图片的高度（单位：px），getRowBytes 是什么？</p><pre class="brush:js;toolbar:false">public&nbsp;final&nbsp;int&nbsp;getrowBytes()&nbsp;{
&nbsp;&nbsp;&nbsp;if&nbsp;(mRecycled)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log.w(TAG,&nbsp;&quot;Called&nbsp;getRowBytes()&nbsp;on&nbsp;a&nbsp;recycle()&#39;d&nbsp;bitmap!&nbsp;This&nbsp;is&nbsp;undefined&nbsp;behavior!&quot;);
&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;return&nbsp;nativeRowBytes(mFinalizer.mNativeBitmap);
}</pre><p>额，感觉太对了啊，要 JNI 了。由于在下 C++ 实在用得少，每次想起 JNI 都请想象脑门磕墙的场景，不过呢，毛爷爷说过，一切反动派都是纸老虎~与</p><p>nativeRowBytes&nbsp;对应的函数如下：</p><p>Bitmap.cpp</p><pre class="brush:js;toolbar:false">static&nbsp;jint&nbsp;Bitmap_rowBytes(JNIEnv*&nbsp;env,&nbsp;jobject,&nbsp;jlong&nbsp;bitmapHandle)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SkBitmap*&nbsp;bitmap&nbsp;=&nbsp;reinterpret_cast&lt;SkBitmap*&gt;(bitmapHandle)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;static_cast&lt;jint&gt;(bitmap-&gt;rowBytes());
}</pre><p>等等，我们好像发现了什么，原来 Bitmap 本质上就是一个 SkBitmap。。而这个 SkBitmap 也是大有来头，不信你瞧：<a href="https://skia.org/" target="_blank">Skia</a>。啥也别说了，赶紧瞅瞅 SkBitmap。</p><p>SkBitmap.h</p><pre class="brush:js;toolbar:false">/**&nbsp;Return&nbsp;the&nbsp;number&nbsp;of&nbsp;bytes&nbsp;between&nbsp;subsequent&nbsp;rows&nbsp;of&nbsp;the&nbsp;bitmap.&nbsp;*/
size_t&nbsp;rowBytes()&nbsp;const&nbsp;{&nbsp;return&nbsp;fRowBytes;&nbsp;}</pre><p><span style="font-family:微软雅黑;word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-size: 14px; line-height: 28px; background-color: rgb(255, 255, 255);"><span style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(62, 62, 62);"></span></span>SkBitmap.cpp</p><pre class="brush:js;toolbar:false">size_t&nbsp;SkBitmap::ComputeRowBytes(Config&nbsp;c,&nbsp;int&nbsp;width)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;SkColorTypeMinRowBytes(SkBitmapConfigToColorType(c),&nbsp;width);
}
SkImageInfo.h
&nbsp;
static&nbsp;int&nbsp;SkColorTypeBytesPerPixel(SkColorType&nbsp;ct)&nbsp;{
&nbsp;&nbsp;&nbsp;static&nbsp;const&nbsp;uint8_t&nbsp;gSize[]&nbsp;=&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;0,&nbsp;&nbsp;//&nbsp;Unknown
&nbsp;&nbsp;&nbsp;&nbsp;1,&nbsp;&nbsp;//&nbsp;Alpha_8
&nbsp;&nbsp;&nbsp;&nbsp;2,&nbsp;&nbsp;//&nbsp;RGB_565
&nbsp;&nbsp;&nbsp;&nbsp;2,&nbsp;&nbsp;//&nbsp;ARGB_4444
&nbsp;&nbsp;&nbsp;&nbsp;4,&nbsp;&nbsp;//&nbsp;RGBA_8888
&nbsp;&nbsp;&nbsp;&nbsp;4,&nbsp;&nbsp;//&nbsp;BGRA_8888
&nbsp;&nbsp;&nbsp;&nbsp;1,&nbsp;&nbsp;//&nbsp;kIndex_8
&nbsp;&nbsp;};
&nbsp;&nbsp;SK_COMPILE_ASSERT(SK_ARRAY_COUNT(gSize)&nbsp;==&nbsp;(size_t)(kLastEnum_SkColorType&nbsp;+&nbsp;1),
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;size_mismatch_with_SkColorType_enum);
&nbsp;
&nbsp;&nbsp;&nbsp;SkASSERT((size_t)ct&nbsp;&lt;&nbsp;SK_ARRAY_COUNT(gSize));
&nbsp;&nbsp;&nbsp;return&nbsp;gSize[ct];
}
&nbsp;
static&nbsp;inline&nbsp;size_t&nbsp;SkColorTypeMinRowBytes(SkColorType&nbsp;ct,&nbsp;int&nbsp;width)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;width&nbsp;*&nbsp;SkColorTypeBytesPerPixel(ct);
}</pre><p>好，跟踪到这里，我们发现 ARGB_8888（也就是我们最常用的 Bitmap 的格式）的一个像素占用 4byte，那么 rowBytes 实际上就是 4*width bytes。</p><p>那么结论出来了，一张 ARGB_8888 的 Bitmap 占用内存的计算公式</p><p>bitmapInRam = bitmapWidth*bitmapHeight *4 bytes</p><p>说到这儿你以为故事就结束了么？有本事你拿去试，算出来的和你获取到的总是会差个倍数，为啥呢？</p><p>还记得我们最开始给出的那个例子么？</p><p>一张522*686的&nbsp;PNG&nbsp;图片，我把它放到&nbsp;drawable-xxhdpi&nbsp;目录下，在三星s6上加载，占用内存2547360B，就可以用这个方法获取到。</p><p>然而公式计算出来的可是1432368B。。。</p><h3>2.2 Density</h3><p>知道我为什么在举例的时候那么费劲的说放到xxx目录下，还要说用xxx手机么？你以为 Bitmap 加载只跟宽高有关么？Naive。</p><p>还是先看代码，我们读取的是 drawable 目录下面的图片，用的是 decodeResource 方法，该方法本质上就两步：</p><ul class=" list-paddingleft-2"><li><p>读取原始资源，这个调用了&nbsp;Resource.openRawResource&nbsp;方法，这个方法调用完成之后会对 TypedValue 进行赋值，其中包含了原始资源的 density 等信息；</p></li><li><p>调用&nbsp;decodeResourceStream&nbsp;对原始资源进行解码和适配。这个过程实际上就是原始资源的 density 到屏幕 density 的一个映射。</p></li></ul><p>原始资源的 density 其实取决于资源存放的目录（比如 xxhdpi 对应的是480），而屏幕 density 的赋值，请看下面这段代码：</p><p>BitmapFactory.java</p><pre class="brush:js;toolbar:false">public&nbsp;static&nbsp;Bitmap&nbsp;decodeResourceStream(Resources&nbsp;res,&nbsp;TypedValue&nbsp;value,
&nbsp;&nbsp;&nbsp;&nbsp;InputStream&nbsp;is,&nbsp;Rect&nbsp;pad,&nbsp;Options&nbsp;opts)&nbsp;{
&nbsp;
//实际上，我们这里的opts是null的，所以在这里初始化。
if&nbsp;(opts&nbsp;==&nbsp;null)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;opts&nbsp;=&nbsp;new&nbsp;Options();
}
&nbsp;
if&nbsp;(opts.inDensity&nbsp;==&nbsp;0&nbsp;&amp;&amp;&nbsp;value&nbsp;!=&nbsp;null)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;final&nbsp;int&nbsp;density&nbsp;=&nbsp;value.density;
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(density&nbsp;==&nbsp;TypedValue.DENSITY_DEFAULT)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;opts.inDensity&nbsp;=&nbsp;DisplayMetrics.DENSITY_DEFAULT;
&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;else&nbsp;if&nbsp;(density&nbsp;!=&nbsp;TypedValue.DENSITY_NONE)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;opts.inDensity&nbsp;=&nbsp;density;&nbsp;//这里density的值如果对应资源目录为hdpi的话，就是240
&nbsp;&nbsp;&nbsp;&nbsp;}
}
&nbsp;
if&nbsp;(opts.inTargetDensity&nbsp;==&nbsp;0&nbsp;&amp;&amp;&nbsp;res&nbsp;!=&nbsp;null)&nbsp;{
//请注意，inTargetDensity就是当前的显示密度，比如三星s6时就是640
&nbsp;&nbsp;&nbsp;&nbsp;opts.inTargetDensity&nbsp;=&nbsp;res.getDisplayMetrics().densityDpi;
}
&nbsp;
return&nbsp;decodeStream(is,&nbsp;pad,&nbsp;opts);
}</pre><p>我们看到 opts 这个值被初始化，而它的构造居然如此简单：</p><pre class="brush:js;toolbar:false">public&nbsp;Options()&nbsp;{
&nbsp;&nbsp;&nbsp;inDither&nbsp;=&nbsp;false;
&nbsp;&nbsp;&nbsp;inScaled&nbsp;=&nbsp;true;
&nbsp;&nbsp;&nbsp;inPremultiplied&nbsp;=&nbsp;true;
}</pre><p>所以我们就很容易的看到，Option.inScreenDensity 这个值没有被初始化，而实际上后面我们也会看到这个值根本不会用到；我们最应该关心的是什么呢？是 inDensity 和 inTargetDensity，这两个值与下面 cpp 文件里面的 density 和 targetDensity 相对应——重复一下，inDensity 就是原始资源的 density，inTargetDensity 就是屏幕的 density。</p><p>紧接着，用到了 nativeDecodeStream 方法，不重要的代码直接略过，直接给出最关键的 doDecode 函数的代码：</p><p>BitmapFactory.cpp</p><pre class="brush:js;toolbar:false">static&nbsp;jobject&nbsp;doDecode(JNIEnv*&nbsp;env,&nbsp;SkStreamRewindable*&nbsp;stream,&nbsp;jobject&nbsp;padding,&nbsp;jobject&nbsp;options)&nbsp;{
&nbsp;
......
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(env-&gt;GetBooleanField(options,&nbsp;gOptions_scaledFieldID))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;int&nbsp;density&nbsp;=&nbsp;env-&gt;GetIntField(options,&nbsp;gOptions_densityFieldID);//对应hdpi的时候，是240
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;int&nbsp;targetDensity&nbsp;=&nbsp;env-&gt;GetIntField(options,&nbsp;gOptions_targetDensityFieldID);//三星s6的为640
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;int&nbsp;screenDensity&nbsp;=&nbsp;env-&gt;GetIntField(options,&nbsp;gOptions_screenDensityFieldID);
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(density&nbsp;!=&nbsp;0&nbsp;&amp;&amp;&nbsp;targetDensity&nbsp;!=&nbsp;0&nbsp;&amp;&amp;&nbsp;density&nbsp;!=&nbsp;screenDensity)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scale&nbsp;=&nbsp;(float)&nbsp;targetDensity&nbsp;/&nbsp;density;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;&nbsp;&nbsp;&nbsp;}
}
&nbsp;
const&nbsp;bool&nbsp;willScale&nbsp;=&nbsp;scale&nbsp;!=&nbsp;1.0f;
......
SkBitmap&nbsp;decodingBitmap;
if&nbsp;(!decoder-&gt;decode(stream,&nbsp;&amp;decodingBitmap,&nbsp;prefColorType,decodeMode))&nbsp;{
&nbsp;&nbsp;&nbsp;return&nbsp;nullObjectReturn(&quot;decoder-&gt;decode&nbsp;returned&nbsp;false&quot;);
}
//这里这个deodingBitmap就是解码出来的bitmap，大小是图片原始的大小
int&nbsp;scaledWidth&nbsp;=&nbsp;decodingBitmap.width();
int&nbsp;scaledHeight&nbsp;=&nbsp;decodingBitmap.height();
if&nbsp;(willScale&nbsp;&amp;&amp;&nbsp;decodeMode&nbsp;!=&nbsp;SkImageDecoder::kDecodeBounds_Mode)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;scaledWidth&nbsp;=&nbsp;int(scaledWidth&nbsp;*&nbsp;scale&nbsp;+&nbsp;0.5f);
&nbsp;&nbsp;&nbsp;&nbsp;scaledHeight&nbsp;=&nbsp;int(scaledHeight&nbsp;*&nbsp;scale&nbsp;+&nbsp;0.5f);
}
if&nbsp;(willScale)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;float&nbsp;sx&nbsp;=&nbsp;scaledWidth&nbsp;/&nbsp;float(decodingBitmap.width());
&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;float&nbsp;sy&nbsp;=&nbsp;scaledHeight&nbsp;/&nbsp;float(decodingBitmap.height());
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;TODO:&nbsp;avoid&nbsp;copying&nbsp;when&nbsp;scaled&nbsp;size&nbsp;equals&nbsp;decodingBitmap&nbsp;size
&nbsp;&nbsp;&nbsp;&nbsp;SkColorType&nbsp;colorType&nbsp;=&nbsp;colorTypeForScaledOutput(decodingBitmap.colorType());
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;FIXME:&nbsp;If&nbsp;the&nbsp;alphaType&nbsp;is&nbsp;kUnpremul&nbsp;and&nbsp;the&nbsp;image&nbsp;has&nbsp;alpha,&nbsp;the
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;colors&nbsp;may&nbsp;not&nbsp;be&nbsp;correct,&nbsp;since&nbsp;Skia&nbsp;does&nbsp;not&nbsp;yet&nbsp;support&nbsp;drawing
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;to/from&nbsp;unpremultiplied&nbsp;bitmaps.
&nbsp;&nbsp;&nbsp;&nbsp;outputBitmap-&gt;setInfo(SkImageInfo::Make(scaledWidth,&nbsp;scaledHeight,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;colorType,&nbsp;decodingBitmap.alphaType()));
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(!outputBitmap-&gt;allocPixels(outputAllocator,&nbsp;NULL))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;nullObjectReturn(&quot;allocation&nbsp;failed&nbsp;for&nbsp;scaled&nbsp;bitmap&quot;);
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;If&nbsp;outputBitmap&#39;s&nbsp;pixels&nbsp;are&nbsp;newly&nbsp;allocated&nbsp;by&nbsp;Java,&nbsp;there&nbsp;is&nbsp;no&nbsp;need
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;to&nbsp;erase&nbsp;to&nbsp;0,&nbsp;since&nbsp;the&nbsp;pixels&nbsp;were&nbsp;initialized&nbsp;to&nbsp;0.
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(outputAllocator&nbsp;!=&nbsp;&amp;javaAllocator)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;outputBitmap-&gt;eraseColor(0);
&nbsp;&nbsp;&nbsp;&nbsp;}
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;SkPaint&nbsp;paint;
&nbsp;&nbsp;&nbsp;&nbsp;paint.setFilterLevel(SkPaint::kLow_FilterLevel);
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;SkCanvas&nbsp;canvas(*outputBitmap);
&nbsp;&nbsp;&nbsp;&nbsp;canvas.scale(sx,&nbsp;sy);
&nbsp;&nbsp;&nbsp;&nbsp;canvas.drawBitmap(decodingBitmap,&nbsp;0.0f,&nbsp;0.0f,&nbsp;&amp;paint);
}
......
}</pre><p><span style="font-family:微软雅黑;word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-size: 14px; line-height: 28px; background-color: rgb(255, 255, 255);"><span style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(62, 62, 62);"></span></span></p><p>注意到其中有个 density 和 targetDensity，前者是 decodingBitmap 的 density，这个值跟这张图片的放置的目录有关（比如 hdpi 是240，xxhdpi 是480），这部分代码我跟了一下，太长了，就不列出来了；targetDensity 实际上是我们加载图片的目标 density，这个值的来源我们已经在前面给出了，就是 DisplayMetrics 的 densityDpi，如果是三星s6那么这个数值就是640。sx 和sy 实际上是约等于 scale 的，因为 scaledWidth 和 scaledHeight 是由 width 和 height 乘以 scale 得到的。我们看到 Canvas 放大了 scale 倍，然后又把读到内存的这张 bitmap 画上去，相当于把这张 bitmap 放大了 scale 倍。</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><p>再来看我们的例子：</p><hr class="l" style="word-wrap: break-word; margin: 0px; padding: 0px; clear: both; height: 1px; border: none; color: rgb(237, 237, 237); background: rgb(237, 237, 237);"/><p>一张522*686的PNG&nbsp;图片，我把它放到&nbsp;drawable-xxhdpi&nbsp;目录下，在三星s6上加载，占用内存2547360B，其中 density 对应 xxhdpi 为480，targetDensity 对应三星s6的密度为640：</p><p>522/480 *&nbsp;640 *&nbsp;686/480&nbsp;*640 *&nbsp;4 = 2546432B</p><hr class="l" style="word-wrap: break-word; margin: 0px; padding: 0px; clear: both; height: 1px; border: none; color: rgb(237, 237, 237); background: rgb(237, 237, 237);"/><p><br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-family: &#39;Microsoft Yahei&#39;; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/></p><h3>2.3 精度</h3><p>越来越有趣了是不是，你肯定会发现我们这么细致的计算还是跟获取到的数值</p><p><span style="color: rgb(255, 0, 0);">不！一！样！</span></p><p>为什么呢？由于结果已经非常接近，我们很自然地想到精度问题。来，再把上面这段代码中的一句拿出来看看：</p><pre class="brush:js;toolbar:false">outputBitmap-&gt;setInfo(SkImageInfo::Make(scaledWidth,&nbsp;scaledHeight,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;colorType,&nbsp;decodingBitmap.alphaType()));</pre><p>我们看到最终输出的 outputBitmap 的大小是scaledWidth*scaledHeight，我们把这两个变量计算的片段拿出来给大家一看就明白了：</p><pre class="brush:js;toolbar:false">if&nbsp;(willScale&nbsp;&amp;&amp;&nbsp;decodeMode&nbsp;!=&nbsp;SkImageDecoder::kDecodeBounds_Mode)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;scaledWidth&nbsp;=&nbsp;int(scaledWidth&nbsp;*&nbsp;scale&nbsp;+&nbsp;0.5f);
&nbsp;&nbsp;&nbsp;&nbsp;scaledHeight&nbsp;=&nbsp;int(scaledHeight&nbsp;*&nbsp;scale&nbsp;+&nbsp;0.5f);
}</pre><p><span style="font-family:微软雅黑;word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-size: 14px; line-height: 28px; background-color: rgb(255, 255, 255);"></span></p><p>在我们的例子中，</p><p>scaledWidth = int( 522 * 640 / 480f + 0.5) = int(696.5) = 696</p><p>scaledHeight = int( 686 * 640 / 480f + 0.5) = int(915.16666…) = 915</p><p>下面就是见证奇迹的时刻：</p><p>915&nbsp;* 696 *&nbsp;4 = 2547360</p><p>有木有很兴奋！有木有很激动！！</p><p>写到这里，突然想起《STL源码剖析》一书的扉页，侯捷先生只写了一句话：</p><blockquote><p>“源码之前，了无秘密”。</p></blockquote><h3>2.4 小结</h3><p>其实，通过前面的代码跟踪，我们就不难知道，Bitmap 在内存当中占用的大小其实取决于：</p><ul style="word-wrap: break-word; margin-left: 14px; padding: 0px; border: 0px;" class=" list-paddingleft-2"><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/><li><p>色彩格式，前面我们已经提到，如果是 ARGB8888 那么就是一个像素4个字节，如果是 RGB565 那就是2个字节</p></li><li><p>原始文件存放的资源目录（是 hdpi 还是 xxhdpi 可不能傻傻分不清楚哈）</p></li><li><p>目标屏幕的密度（所以同等条件下，红米在资源方面消耗的内存肯定是要小于三星S6的）</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p></li></ul><h2>3、想办法减少 Bitmap 内存占用</h2><h3>3.1 Jpg 和 Png<br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-family: &#39;Microsoft Yahei&#39;; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/><span style="font-family:微软雅黑;word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-size: 14px; line-height: 28px; background-color: rgb(255, 255, 255);"></span></h3><p>说到这里，肯定会有人会说，我们用 jpg 吧，jpg 格式的图片不应该比 png 小么？</p><p>这确实是个好问题，因为同样一张图片，jpg 确实比 png 会多少小一些（甚至很多），原因很简单，jpg 是一种有损压缩的图片存储格式，而 png 则是&nbsp;无损压缩的图片存储格式，显而易见，jpg 会比 png 小，代价也是显而易见的。</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><p>可是，这说的是文件存储范畴的事情，它们只存在于文件系统，而非内存或者显存。说得简单一点儿，我有一个极品飞车的免安装硬盘版的压缩包放在我的磁盘里面，这个游戏是不能玩的，我需要先解压，才能玩——jpg 也好，png 也好就是个压缩包的概念，而我们讨论的内存占用则是从使用角度来讨论的。</p><p>所以，jpg 格式的图片与 png 格式的图片在内存当中不应该有什么不同。</p><blockquote><p>『啪！！！』</p><p>『谁这么缺德！！打人不打脸好么！』</p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></blockquote><p>肯定有人有意见，jpg 图片读到内存就是会小，还会给我拿出例子。当然，他说的不一定是错的。因为 jpg 的图片没有 alpha 通道！！所以读到内存的时候如果用 RGB565的格式存到内存，这下大小只有 ARGB8888的一半，能不小么。。。</p><p>不过，抛开 Android 这个平台不谈，从出图的角度来看的话，jpg 格式的图片大小也不一定比 png 的小，这要取决于图像信息的内容：</p><blockquote><p>JPG 不适用于所含颜色很少、具有大块颜色相近的区域或亮度差异十分明显的较简单的图片。对于需要高保真的较复杂的图像，PNG 虽然能无损压缩，但图片文件较大。</p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></blockquote><p>如果仅仅是为了 Bitmap 读到内存中的大小而考虑的话，jpg 也好 png 也好，没有什么实质的差别；二者的差别主要体现在：</p><ul style="word-wrap: break-word; margin-left: 14px; padding: 0px; border: 0px;" class=" list-paddingleft-2"><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/><li><p>alpha 你是否真的需要？如果需要 alpha 通道，那么没有别的选择，用 png。</p></li><li><p>你的图色值丰富还是单调？就像刚才提到的，如果色值丰富，那么用jpg，如果作为按钮的背景，请用 png。</p></li><li><p>对安装包大小的要求是否非常严格？如果你的 app 资源很少，安装包大小问题不是很凸显，看情况选择 jpg 或者 png（不过，我想现在对资源文件没有苛求的应用会很少吧。。）</p></li><li><p>目标用户的 cpu 是否强劲？jpg 的图像压缩算法比 png 耗时。这方面还是要酌情选择，前几年做了一段时间 Cocos2dx，由于资源非常多，项目组要求统一使用 png，可能就是出于这方面的考虑。</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p></li></ul><p>嗯，跑题了，我们其实想说的是怎么减少内存占用的。。这一小节只是想说，休想通过这个方法来减少内存占用。。。XD</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><h3>3.2 使用 inSampleSize</h3><p>有些朋友一看到这个肯定就笑了。采样嘛，我以前是学信号处理的，一看到 Sample 就抽抽。。哈哈开个玩笑，这个采样其实就跟统计学里面的采样是一样的，在保证最终效果满足要求的前提下减少样本规模，方便后续的数据采集和处理。</p><p>这个方法主要用在图片资源本身较大，或者适当地采样并不会影响视觉效果的条件下，这时候我们输出地目标可能相对较小，对图片分辨率、大小要求不是非常的严格。</p><hr class="l" style="word-wrap: break-word; margin: 0px; padding: 0px; clear: both; height: 1px; border: none; color: rgb(237, 237, 237); background: rgb(237, 237, 237);"/><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><p>举个例子</p><p>我们现在有个需求，要求将一张图片进行模糊，然后作为 ImageView 的 src 呈现给用户，而我们的原始图片大小为 1080*1920，如果我们直接拿来模糊的话，一方面模糊的过程费时费力，另一方面生成的图片又占用内存，实际上在模糊运算过程中可能会存在输入和输出并存的情况，此时内存将会有一个短暂的峰值。</p><p>这时候你一定会想到三个字母在你的脑海里挥之不去，它们就是『OOM』。</p><p>既然图片最终是要被模糊<span style="color:#3e3e3e;word-wrap: break-word; margin: 0px; padding: 0px;">的，也看不太情况，还不如直接用一张采样后的图片，如果采样率为 2，那么读出来的图片只有原始图片的 1/4 大小，真是何乐而不为呢？？</span></p><pre class="brush:js;toolbar:false">BitmapFactory.Options&nbsp;options&nbsp;=&nbsp;new&nbsp;Options();
options.inSampleSize&nbsp;=&nbsp;2;
Bitmap&nbsp;bitmap&nbsp;=&nbsp;BitmapFactory.decodeResource(getResources(),&nbsp;resId,&nbsp;options);</pre><h3>3.3 使用矩阵</h3><p>用到 Bitmap 的地方，总会见到 Matrix。这时候你会想到什么？</p><blockquote><p>『基友』</p><p>『是在下输了。。』</p></blockquote><p>其实想想，Bitmap 的像素点阵，还不就是个矩阵，真是你中有我，我中有你的交情啊。那么什么时候用矩阵呢？</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/></p><p>大图小用用采样，小图大用用矩阵。</p><p>还是用前面模糊图片的例子，我们不是采样了么？内存是小了，可是图的尺寸也小了啊，我要用 Canvas 绘制这张图可怎么办？当然是用矩阵了：</p><p>方式一：</p><pre class="brush:js;toolbar:false">Matrix&nbsp;matrix&nbsp;=&nbsp;new&nbsp;Matrix();
matrix.preScale(2,&nbsp;2,&nbsp;0f,&nbsp;0f);
//如果使用直接替换矩阵的话，在Nexus6&nbsp;5.1.1上必须关闭硬件加速
canvas.concat(matrix);
canvas.drawBitmap(bitmap,&nbsp;0,0,&nbsp;paint);</pre><p><span style="font-family:微软雅黑;word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-size: 14px; line-height: 28px; background-color: rgb(255, 255, 255);"></span></p><p>需要注意的是，在使用搭载 5.1.1 原生系统的 Nexus6 进行测试时发现，如果使用 Canvas 的 setMatrix 方法，可能会导致与矩阵相关的元素的绘制存在问题，本例当中如果使用 setMatrix 方法，bitmap 将不会出现在屏幕上。因此请尽量使用 canvas 的 scale、rotate 这样的方法，或者使用 concat 方法。</p><p><br style="word-wrap: break-word; margin: 0px; padding: 0px;"/></p><p>方式二：</p><pre class="brush:js;toolbar:false">Matrix&nbsp;matrix&nbsp;=&nbsp;new&nbsp;Matrix();
matrix.preScale(2,&nbsp;2,&nbsp;0,&nbsp;0);
canvas.drawBitmap(bitmap,&nbsp;matrix,&nbsp;paint);</pre><p>这样，绘制出来的图就是放大以后的效果了，不过占用的内存却仍然是我们采样出来的大小。</p><p>如果我要把图片放到 ImageView 当中呢？一样可以，请看：</p><pre class="brush:js;toolbar:false">Matrix&nbsp;matrix&nbsp;=&nbsp;new&nbsp;Matrix();
matrix.postScale(2,&nbsp;2,&nbsp;0,&nbsp;0);
imageView.setImageMatrix(matrix);
imageView.setScaleType(ScaleType.MATRIX);
imageView.setImageBitmap(bitmap);</pre><h3>3.4 合理选择Bitmap的像素格式</h3><p>其实前面我们已经多次提到这个问题。ARGB8888格式的图片，每像素占用 4 Byte，而 RGB565则是 2 Byte。我们先看下有多少种格式可选：</p><table cellspacing="0" class="t_table" width="665"><tbody style="word-wrap: break-word; margin: 0px; padding: 0px;"><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px;" class="firstRow"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;"><span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">格式</span></td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;"><span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">描述</span></td></tr><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px; background-color: rgb(248, 248, 248);"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">ALPHA_8</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">只有一个alpha通道</td></tr><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px;"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">ARGB_4444</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">这个从API 13开始不建议使用，因为质量太差</td></tr><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px; background-color: rgb(248, 248, 248);"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">ARGB_8888</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">ARGB四个通道，每个通道8bit</td></tr><tr style="word-wrap: break-word; margin: 0px; padding: 0px; border: 0px;"><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">RGB_565</td><td style="word-wrap: break-word; margin: 0px; padding: 4px; border-color: rgb(227, 237, 245); overflow: hidden;">每个像素占2Byte，其中红色占5bit，绿色占6bit，蓝色占5bit</td></tr></tbody></table><p><br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/></p><p><span style="color:#3e3e3e;word-wrap: break-word; margin: 0px; padding: 0px;">这几个当中，</span></p><p><span style="color:#3e3e3e;word-wrap: break-word; margin: 0px; padding: 0px;"><span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">ALPHA8</span>&nbsp;没必要用，因为我们随便用个颜色就可以搞定的。</span></p><p><span style="color:#3e3e3e;word-wrap: break-word; margin: 0px; padding: 0px;"><span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">ARGB4444</span>&nbsp;虽然占用内存只有&nbsp;<span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">ARGB8888</span>&nbsp;的一半，不过已经被官方嫌弃，失宠了。。『又要占省内存，又要看着爽，臣妾做不到啊T T』。</span></p><p><span style="color:#3e3e3e;word-wrap: break-word; margin: 0px; padding: 0px;"><span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">ARGB8888</span>&nbsp;是最常用的，大家应该最熟悉了。</span></p><p><span style="color:#3e3e3e;word-wrap: break-word; margin: 0px; padding: 0px;"><span style="word-wrap: break-word; margin: 0px; padding: 0px; font-weight: 700;">RGB565</span>&nbsp;看到这个，我就看到了资源优化配置无处不在，这个绿色。。（不行了，突然好邪恶XD），其实如果不需要 alpha 通道，特别是资源本身为 jpg 格式的情况下，用这个格式比较理想。</span></p><h3>3.5 高能：索引位图(Indexed Bitmap)<span style="color: rgb(81, 81, 81); font-family: 微软雅黑; font-size: 14px; line-height: 28px; background-color: rgb(255, 255, 255);"></span></h3><p>索引位图，每个像素只占 1 Byte，不仅支持 RGB，还支持 alpha，而且看上去效果还不错！等等，请收起你的口水，Android 官方并不支持这个。是的，你没看错，官方并不支持。</p><pre class="brush:js;toolbar:false">public&nbsp;enum&nbsp;Config&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;these&nbsp;native&nbsp;values&nbsp;must&nbsp;match&nbsp;up&nbsp;with&nbsp;the&nbsp;enum&nbsp;in&nbsp;SkBitmap.h
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;ALPHA_8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2),
&nbsp;&nbsp;&nbsp;&nbsp;RGB_565&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(4),
&nbsp;&nbsp;&nbsp;&nbsp;ARGB_4444&nbsp;&nbsp;&nbsp;(5),
&nbsp;&nbsp;&nbsp;&nbsp;ARGB_8888&nbsp;&nbsp;&nbsp;(6);
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;final&nbsp;int&nbsp;nativeInt;
}</pre><p>不过，Skia 引擎是支持的，不信你再看：</p><pre class="brush:js;toolbar:false">enum&nbsp;Config&nbsp;{
&nbsp;&nbsp;&nbsp;kNo_Config,&nbsp;&nbsp;&nbsp;//!&lt;&nbsp;bitmap&nbsp;has&nbsp;not&nbsp;been&nbsp;configured
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;kA8_Config,&nbsp;&nbsp;&nbsp;//!&lt;&nbsp;8-bits&nbsp;per&nbsp;pixel,&nbsp;with&nbsp;only&nbsp;alpha&nbsp;specified&nbsp;(0&nbsp;is&nbsp;transparent,&nbsp;0xFF&nbsp;is&nbsp;opaque)
&nbsp;
&nbsp;&nbsp;&nbsp;//看这里看这里！！↓↓↓↓↓
&nbsp;&nbsp;&nbsp;&nbsp;kIndex8_Config,&nbsp;//!&lt;&nbsp;8-bits&nbsp;per&nbsp;pixel,&nbsp;using&nbsp;SkColorTable&nbsp;to&nbsp;specify&nbsp;the&nbsp;colors&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;kRGB_565_Config,&nbsp;//!&lt;&nbsp;16-bits&nbsp;per&nbsp;pixel,&nbsp;(see&nbsp;SkColorPriv.h&nbsp;for&nbsp;packing)
&nbsp;&nbsp;&nbsp;&nbsp;kARGB_4444_Config,&nbsp;//!&lt;&nbsp;16-bits&nbsp;per&nbsp;pixel,&nbsp;(see&nbsp;SkColorPriv.h&nbsp;for&nbsp;packing)
&nbsp;&nbsp;&nbsp;&nbsp;kARGB_8888_Config,&nbsp;//!&lt;&nbsp;32-bits&nbsp;per&nbsp;pixel,&nbsp;(see&nbsp;SkColorPriv.h&nbsp;for&nbsp;packing)
&nbsp;&nbsp;&nbsp;&nbsp;kRLE_Index8_Config,
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;kConfigCount
};</pre><p>其实 Java 层的枚举变量的 nativeInt 对应的就是 Skia 库当中枚举的索引值，所以，如果我们能够拿到这个索引是不是就可以了？对不起，拿不到。</p><p>不行了，废话这么多，肯定要挨板砖了T T。</p><p>不过呢，在 png 的解码库里面有这么一段代码：</p><pre class="brush:js;toolbar:false">bool&nbsp;SkPNGImageDecoder::getBitmapColorType(png_structp&nbsp;png_ptr,&nbsp;png_infop&nbsp;info_ptr,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SkColorType*&nbsp;colorTypep,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bool*&nbsp;hasAlphap,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SkPMColor*&nbsp;SK_RESTRICT&nbsp;theTranspColorp)&nbsp;{
png_uint_32&nbsp;origWidth,&nbsp;origHeight;
int&nbsp;bitDepth,&nbsp;colorType;
png_get_IHDR(png_ptr,&nbsp;info_ptr,&nbsp;&amp;origWidth,&nbsp;&amp;origHeight,&nbsp;&amp;bitDepth,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&amp;colorType,&nbsp;int_p_NULL,&nbsp;int_p_NULL,&nbsp;int_p_NULL);
&nbsp;
#ifdef&nbsp;PNG_sBIT_SUPPORTED
&nbsp;&nbsp;//&nbsp;check&nbsp;for&nbsp;sBIT&nbsp;chunk&nbsp;data,&nbsp;in&nbsp;case&nbsp;we&nbsp;should&nbsp;disable&nbsp;dithering&nbsp;because
&nbsp;&nbsp;//&nbsp;our&nbsp;data&nbsp;is&nbsp;not&nbsp;truely&nbsp;8bits&nbsp;per&nbsp;component
&nbsp;&nbsp;png_color_8p&nbsp;sig_bit;
&nbsp;&nbsp;if&nbsp;(this-&gt;getDitherImage()&nbsp;&amp;&amp;&nbsp;png_get_sBIT(png_ptr,&nbsp;info_ptr,&nbsp;&amp;sig_bit))&nbsp;{
#if&nbsp;0
&nbsp;&nbsp;&nbsp;&nbsp;SkDebugf(&quot;-----&nbsp;sBIT&nbsp;%d&nbsp;%d&nbsp;%d&nbsp;%d\n&quot;,&nbsp;sig_bit-&gt;red,&nbsp;sig_bit-&gt;green,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sig_bit-&gt;blue,&nbsp;sig_bit-&gt;alpha);
#endif
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;0&nbsp;seems&nbsp;to&nbsp;indicate&nbsp;no&nbsp;information&nbsp;available
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(pos_le(sig_bit-&gt;red,&nbsp;SK_R16_BITS)&nbsp;&amp;&amp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pos_le(sig_bit-&gt;green,&nbsp;SK_G16_BITS)&nbsp;&amp;&amp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pos_le(sig_bit-&gt;blue,&nbsp;SK_B16_BITS))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this-&gt;setDitherImage(false);
&nbsp;&nbsp;&nbsp;&nbsp;}
}
#endif
&nbsp;
&nbsp;
if&nbsp;(colorType&nbsp;==&nbsp;PNG_COLOR_TYPE_PALETTE)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;bool&nbsp;paletteHasAlpha&nbsp;=&nbsp;hasTransparencyInPalette(png_ptr,&nbsp;info_ptr);
&nbsp;&nbsp;&nbsp;&nbsp;*colorTypep&nbsp;=&nbsp;this-&gt;getPrefColorType(kIndex_SrcDepth,&nbsp;paletteHasAlpha);
&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;now&nbsp;see&nbsp;if&nbsp;we&nbsp;can&nbsp;upscale&nbsp;to&nbsp;their&nbsp;requested&nbsp;colortype
&nbsp;&nbsp;&nbsp;&nbsp;//这段代码，如果返回false，那么colorType就被置为索引了，那么我们看看如何返回false
&nbsp;&nbsp;&nbsp;&nbsp;if&nbsp;(!canUpscalePaletteToConfig(*colorTypep,&nbsp;paletteHasAlpha))&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*colorTypep&nbsp;=&nbsp;kIndex_8_SkColorType;
&nbsp;&nbsp;&nbsp;&nbsp;}
}&nbsp;else&nbsp;{
......&nbsp;
}
return&nbsp;true;
}</pre><p>canUpscalePaletteToConfig&nbsp;函数如果返回false，那么&nbsp;colorType&nbsp;就被置为&nbsp;kIndex_8_SkColorType&nbsp;了。</p><pre class="brush:js;toolbar:false">static&nbsp;bool&nbsp;canUpscalePaletteToConfig(SkColorType&nbsp;dstColorType,&nbsp;bool&nbsp;srcHasAlpha)&nbsp;{
&nbsp;&nbsp;switch&nbsp;(dstColorType)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;case&nbsp;kN32_SkColorType:
&nbsp;&nbsp;&nbsp;&nbsp;case&nbsp;kARGB_4444_SkColorType:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;true;
&nbsp;&nbsp;&nbsp;&nbsp;case&nbsp;kRGB_565_SkColorType:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;only&nbsp;return&nbsp;true&nbsp;if&nbsp;the&nbsp;src&nbsp;is&nbsp;opaque&nbsp;(since&nbsp;565&nbsp;is&nbsp;opaque)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;!srcHasAlpha;
&nbsp;&nbsp;&nbsp;&nbsp;default:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;false;
}
}</pre><p>如果传入的&nbsp;dstColorType&nbsp;是&nbsp;kRGB_565_SkColorType，同时图片还有 alpha 通道，那么返回 false~~咳咳，那么问题来了，这个dstColorType&nbsp;是哪儿来的？？就是我们在 decode 的时候，传入的&nbsp;Options&nbsp;的inPreferredConfig。</p><hr class="l" style="word-wrap: break-word; margin: 0px; padding: 0px; clear: both; height: 1px; border: none; color: rgb(237, 237, 237); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background: rgb(237, 237, 237);"/><p><br style="word-wrap: break-word; margin: 0px; padding: 0px; color: rgb(81, 81, 81); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background-color: rgb(255, 255, 255);"/></p><p>下面是实验时间~</p><p>准备：在 assets 目录当中放了一个叫 index.png 的文件，大小192*192，这个文件是通过 PhotoShop 编辑之后生成的索引格式的图片。</p><p>代码：</p><pre class="brush:js;toolbar:false">try&nbsp;{
&nbsp;&nbsp;&nbsp;Options&nbsp;options&nbsp;=&nbsp;new&nbsp;Options();
&nbsp;&nbsp;&nbsp;options.inPreferredConfig&nbsp;=&nbsp;Config.RGB_565;
Bitmap&nbsp;bitmap&nbsp;=&nbsp;BitmapFactory.decodeStream(getResources().getAssets().open(&quot;index.png&quot;),&nbsp;null,&nbsp;options);
&nbsp;&nbsp;&nbsp;Log.d(TAG,&nbsp;&quot;bitmap.getConfig()&nbsp;=&nbsp;&quot;&nbsp;+&nbsp;bitmap.getConfig());
&nbsp;&nbsp;&nbsp;Log.d(TAG,&nbsp;&quot;scaled&nbsp;bitmap.getByteCount()&nbsp;=&nbsp;&quot;&nbsp;+&nbsp;bitmap.getByteCount());
&nbsp;&nbsp;&nbsp;imageView.setImageBitmap(bitmap);
}&nbsp;catch&nbsp;(IOException&nbsp;e)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;e.printStackTrace();
}</pre><p>程序运行在 Nexus6上，由于从 assets 中读取不涉及前面讨论到的 scale 的问题，所以这张图片读到内存以后的大小理论值（ARGB8888）：<br style="word-wrap: break-word; margin: 0px; padding: 0px;"/>192 *&nbsp;192&nbsp;*4=147456</p><p>好，运行我们的代码，看输出的 Config 和 ByteCount：</p><pre class="brush:js;toolbar:false">D/MainActivity:&nbsp;bitmap.getConfig()&nbsp;=&nbsp;null
D/MainActivity:&nbsp;scaled&nbsp;bitmap.getByteCount()&nbsp;=&nbsp;36864</pre><p>先说大小为什么只有 36864，我们知道如果前面的讨论是没有问题的话，那么这次解码出来的 Bitmap 应该是索引格式，那么占用的内存只有&nbsp;ARGB 8888&nbsp;的1/4是意料之中的；再说 Config 为什么为 null。。额。。黑户。。官方说：</p><blockquote><p>public final Bitmap.Config getConfig ()</p><p>Added in API level 1</p><p>If the bitmap’s internal config is in one of the public formats, return that config, otherwise return null.</p></blockquote><p>再说一遍，黑户。。XD。</p><hr class="l" style="word-wrap: break-word; margin: 0px; padding: 0px; clear: both; height: 1px; border: none; color: rgb(237, 237, 237); font-family: 微软雅黑; font-size: 14px; line-height: 28px; white-space: normal; background: rgb(237, 237, 237);"/><p>看来这个法子还真行啊，占用内存一下小很多。不过由于官方并未做出支持，因此这个方法有诸多限制，比如不能在 xml 中直接配置，，生成的 Bitmap 不能用于构建 Canvas 等等。</p><h3>3.6 不要辜负。。。『哦，不要姑父！』</h3><p>其实我们一直在抱怨资源大，有时候有些场景其实不需要图片也能完成的。比如在开发中我们会经常遇到 Loading，这些 Loading 通常就是几帧图片，图片也比较简单，只需要黑白灰加 alpha 就齐了。</p><blockquote><p>『排期太紧了，这些给我出一系列图吧』</p><p>『好，不过每张图都是 300*30 0的 png 哈，总共 5 张，为了适配不同的分辨率，需要出 xxhdpi 和 xxxhdpi 的两套图。。』</p></blockquote><p>Orz。。。</p><p>如果是这样，你还是自定义一个 View，覆写 onDraw 自己画一下好了。。。</p><h2>4、结语</h2><p>写了这么多，我们来稍稍理一理，本文主要讨论了如何运行时获取 Bitmap 占用内存的大小，如果事先根据 Bitmap 的格式、读取方式等算出其占用内存的大小，后面又整理了一些常见的 Bitmap 使用建议。突然好像说，是时候研究一下 Skia 引擎了。</p><p>怎么办，看来扔了好几年的 C++还是要捡回来么。。噗。。。</p><p></p><p></p><p></p><p></p>
!!!

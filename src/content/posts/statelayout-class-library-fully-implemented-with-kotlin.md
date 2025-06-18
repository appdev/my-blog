---
title: "完全使用kotlin实现的StateLayout类库"
slug: "statelayout-class-library-fully-implemented-with-kotlin"
published: 2018-07-08T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
Gihub 地址：https://github.com/huclengyue/StateLayoutWithKotlin
这个项目是根据 [StateLayout](https://github.com/fingdo/stateLayout) 项目而来，感谢原作者的贡献，我本人在功能实现上只做了稍许改动，主要的不同在于这个是完全使用 Kotlin 编写的，可以看做是一个 kotlin 练手项目。
由于我也是刚刚使用 Kotlin，使用还不是很熟练，如果在写法、功能实现上有不够优雅的地方欢迎指正！
## 更新
  - 优化了各个 View 的加载逻辑，在调用相应布局时才会加载，节约资源。
  - 删除了部分无用的方法
---
> 下面是原项目的 readme 部分
## 演示
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/164672684005476c90acc68624a0b786d6abaab5ce.gif)
## StateLayout 用法
## 引入布局
用法与 ScrollView 一致，只允许一个 `根布局`
``` xml
<com.fingdo.statelayout.StateLayout
        android:id="@+id/state_layout"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        <!-- 内容布局 one root view -->
</com.fingdo.statelayout.StateLayout>
```
## 布局设置图标和文字
``` xml
<declare-styleable name="StateLayout">
    <!-- 错误提示图标 -->
    <attr name="errorImg" format="reference" />
    <!-- 错误提示文字 -->
    <attr name="errorText" format="string" />
    <!-- 空数据提示图标 -->
    <attr name="emptyImg" format="reference" />
    <!-- 空数据提示文字 -->
    <attr name="emptyText" format="string" />
    <!-- 没有网络提示图标 -->
    <attr name="noNetworkImg" format="reference" />
    <!-- 没有网络提示文字 -->
    <attr name="noNetworkText" format="string" />
    <!-- 超时提示图标 -->
    <attr name="timeOutImg" format="reference" />
    <!-- 超时提示文字 -->
    <attr name="timeOutText" format="string" />
    <!-- 登录提示图标 -->
    <attr name="loginImg" format="reference" />
    <!-- 登录提示文字 -->
    <attr name="loginText" format="string" />
    <!-- 加载提示文字 -->
    <attr name="loadingText" format="string" />
</declare-styleable>
```
### 示例：
``` xml
<com.fingdo.statelayout.StateLayout
    xmlns:sl="http://schemas.android.com/apk/res-auto"
    android:id="@+id/state_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    sl:emptyImg="@drawable/ic_state_empty"
    sl:emptyText="空数据提示文字"
    sl:errorImg="@drawable/ic_state_error"
    sl:errorText="错误提示文字"
    sl:loadingText="加载提示文字"
    sl:loginImg="@drawable/ic_state_login"
    sl:loginText="登录提示文字"
    sl:noNetworkImg="@drawable/ic_state_no_network"
    sl:noNetworkText="没有网络提示文字"
    sl:timeOutImg="@drawable/ic_state_time_out"
    sl:timeOutText="超时提示文字">
</com.fingdo.statelayout.StateLayout>
```
## 代码提前设置图标和文字
#### 如果你设置了一个 `null` 数据的时候，将使用上一次设置的提示语。空字符串可以正常显示为空，即只显示一个提示图片。
``` java
//type 为 StateLayout 的固定 Type 变量
public static final int ERROR = 1;
public static final int EMPTY = 2;
public static final int TIMEOUT = 3;
public static final int NOT_NETWORK = 4;
public static final int LOADING = 5;
public static final int LOGIN = 6;
```
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726840674618a80559e315af67dac93d93af31.png)
## 代码设置显示布局
``` java
//展示没有网络的界面
stateLayout.showNoNetworkView();
//展示超时的界面
stateLayout.showTimeoutView();
//展示空数据的界面
stateLayout.showEmptyView();
//展示错误的界面
stateLayout.showErrorView();
//展示登录的界面
stateLayout.showLoginView();
//如下图所示
1，直接显示
2，设置提示 stringId 和图片 Id 显示
3，设置提示 stringId 显示
4，设置提示字符串现实
5，设置提示字符串和图片 Id 显示
```
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726841111574db140600a34f7665586a4721b2.png)
``` java
//显示加载界面
stateLayout.showLoadingView();
1，直接显示
2，设置提示 stringId 显示
3，设置提示字符串显示
4，设置自定义加载 View 显示，如：
    1) 进度条
    2) 显示 gif 的 View
    3) 自定义布局 View
```
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726841802168edaf24954cac388961c190998c.png)
``` java
//显示自定义界面
stateLayout.showCustomView();
```
设置替换成自定义的界面:
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/164672684223218503e53391dac2c0c420b6e7e9a4.png)
## 设置切换界面动画
动画默认为 `false`，如果需要开启动画，请调用
``` java
//开启动画
stateLayout.setUseAnimation(true);
```
如果用户不设置自定义动画，一般为默认的 `渐隐缩放` 动画
如果用户需要设置动画，请调用
``` java
//设置动画
stateLayout.setViewSwitchAnimProvider(new FadeScaleViewAnimProvider());
```
`stateLayout` 自定义了两种动画
``` java
//渐隐缩放，渐显放大动画
FadeScaleViewAnimProvider
//渐隐渐显动画
FadeViewAnimProvider
```
用户如需自定义动画样式，请实现 `ViewAnimProvider` 接口
重写 `showAnimation`和`hideAnimation` 方法。
``` java
//以 FadeViewAnimProvider 为例
public class FadeViewAnimProvider implements ViewAnimProvider {
    @Override
    public Animation showAnimation() {
        Animation animation = new AlphaAnimation(0.0f,1.0f);
        animation.setDuration(200);
        animation.setInterpolator(new DecelerateInterpolator());
        return animation;
    }
    @Override
    public Animation hideAnimation() {
        Animation animation = new AlphaAnimation(1.0f,0.0f);
        animation.setDuration(200);
        animation.setInterpolator(new AccelerateDecelerateInterpolator());
        return animation;
    }
}
```
## 监听刷新和登录点击
请实现 `StateLayout`里面的`OnViewRefreshListener` 接口。
重写两个方法：
``` java
//刷新界面
void refreshClick();
//登录点击
void loginClick();
```
感谢 [lufficc](https://github.com/lufficc/StateLayout) 开源代码提供的动画思路
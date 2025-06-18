---
title: "Android Jetpack Compose 超快速上手指南"
slug: "android-jetpack-compose-super-fast-start-guide"
published: 2020-09-27T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
### Compose 介绍
`Jetpack Compose`发布也快有一年的时间了，虽然目前仍是 DEV 阶段，但是距离可用已经不远了。`Compose` 库是用响应式编程的方式对 View 进行构建，可以用更少更直观的代码，更强大的功能，能提高开发速度（可以参考几乎一模一样的 Flutter，开发速度确实很快）。  
`Jetpack Compose`对于没有接触过声明式 UI 的小伙伴可能会学习曲线有点陡峭，对于已经能熟练开发 Flutter 应用的小伙白来说几乎没有难度。（`Compose` 就是参考 flutter 的模式开发的，代码中还可以看到 Flutter 的相关注释）
这篇文章不回去解释过多的原理与技巧，只要是让你能够快速上手开发项目。
### Compose 如何使用
因为目前（2020 年 09 月 27 日）`Compose` 仍处于开发阶段，所以需要使用 [最新 Canary 版的 Android Studio 预览版](https://developer.android.com/studio/preview?hl=zh-cn)。
可以选择直接创建`Empty Compose Activity`来创建一个全新的 `Compose`应用，或者可以选手动修改`gradle`的方式来创建`Compose` 应用
#### 修改 Gradle
在模块的 build.gradle 文件中新增：
```gradle
android {
    ...
    kotlinOptions {
        jvmTarget = '1.8'
        useIR = true
    }
    buildFeatures {
        compose true
    }
    composeOptions {
        kotlinCompilerExtensionVersion compose_version
        kotlinCompilerVersion '1.4.0'
    }
}
```
`dependencies` 中新增：
```gradle
implementation "androidx.compose.ui:ui:$compose_version"
    implementation "androidx.compose.material:material:$compose_version"
    implementation "androidx.ui:ui-tooling:$compose_version"
```
目前最新的 `Compose` 版本是`1.0.0-alpha03`
使用 `Compose`最低的`buildTools` 版本要求为 29
#### 使用
##### `@Compose`
所有关于构建 View 的方法都必须添加@Compose 的注解才可以。并且@Compose 跟协程的 Suspend 的使用方法比较类似，被@Compose 的注解的方法只能在同样被@Comopse 注解的方法中才能被调用
```java
@Composable
fun Greeting(name: String) {
    Text (text = "Hello $name!")
}
```
#### @Preview
加上@Preview 注解的方法可以在不运行 App 的情况下就可以确认布局的情况。
@Preview 的注解中比较常用的参数如下：
- name: String: 为该 Preview 命名，该名字会在布局预览中显示。
- showBackground: Boolean: 是否显示背景，true 为显示。
- backgroundColor: Long: 设置背景的颜色。
- showDecoration: Boolean: 是否显示 Statusbar 和 Toolbar，true 为显示。
- group: String: 为该 Preview 设置 group 名字，可以在 UI 中以 group 为单位显示。
- fontScale: Float: 可以在预览中对字体放大，范围是从 0.01。- widthDp: Int: 在 Compose 中渲染的最大宽度，单位为 dp。
- heightDp: Int: 在 Compose 中渲染的最大高度，单位为 dp。
更加详细具体的说明可以看 [Google 关于@Preview 的文档](https://developer.android.com/reference/kotlin/androidx/ui/tooling/preview/Preview?hl=zh-cn)
```java
@Preview
@Composable
fun PreviewGreeting() {
    Greeting("Android")
}
```
上面的代码会在预览界面生成：
![preview-hello.png][1]
**注意：强烈建议您不要向生产函数（即使其不带参数）添加 @Preview 注释，而是编写一个封装函数并在其中添加 @Preview 注释。**
#### setContent
`setContent`和 xml 时候的 `setContentView` 是类似的
在 `setContent`中写入关于 UI 的`@Compopse` 方法，即可在 Activity 中显示。
```java
···
  override fun onCreate(savedInstanceState: Bundle?){
        super.onCreate(savedInstanceState)
        setContent { 
            ComposeTheme {
                Greeting("Android")
            }
        }
    }
···
```
#### 主题
Jetpack Compose 提供了 Material Design 的实现，
Material Design 组件（按钮、卡片、开关等）在 Material Theming 的基础上构建而成.
Jetpack Compose 使用 MaterialTheme 可组合项实现这些概念：
```java
MaterialTheme(
  colors = …,
  typography = …,
  shapes = …
) {
  // app content
}
```
关于主题，建议阅读 [Google 的官方文档](https://developer.android.com/jetpack/compose/themes?hl=zh-cn)
#### 布局、组件
`Compose` 提供了常见的布局与丰富的组件。  
布局常见的有 `Column`、`Row`、`Stack`。还有 Material 支持的 `Scaffold`看到这里熟悉 Flutter 的朋友应该已经看出来了，`Compose` 提供的自建跟布局和 Flutter 是非常相似的。
`Column`:
```java
@Composable
fun ArtistCard() {
  Column {
    Text("Alfred Sisley")
    Text("3 minutes ago")
  }
}
```
`Scaffold`:
```java
@Composable
fun HomeScreen(...) {
    Scaffold (
        drawerContent = { ... },
        topBar = { ... },
        bodyContent = { ... }
    )
}
```
实时也的确如此，`Compose`提供的布局和组件跟 Flutter 的组件与布局除了名字作用相似之外，连属性也是非常相似的。比如 `TextStyle`这个控制`Text` 样式的属性 直接使用 Flutter 的代码，把 Dart 语法修改成 Kotlin 语法就能直接使用。
我建议需要这些布局、组件相关属性的朋友直接去看 Flutter 相关的文章，Flutter 经过这么久的发展，相关的文档，说明比现在的 `Compose` 要详细的多.
### Compose 如何集成到现有项目
对于很多现有的项目，从头开始使用 `Compose`是不现实的，我肯可以根据上面提到的手动修改`gradle` 的方式，使项目支持`Compose`。
#### 在 XML 中使用
我们可以直接把 `Compopse` 作为一个普通 View 使用
```xml
<androidx.compose.ui.platform.ComposeView
        android:id="@+id/compose_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
```
```java
  findViewById<ComposeView>(R.id.compose_view).setContent {
            ComposeTheme {
                Surface(color = MaterialTheme.colors.background) {
                    Greeting("Android")
                }
            }
        }
```
#### Activity、Fragment
作为独立的界面使用 `Compopse`直接使用`setContent` 方法即可。
**当前最新版本的 Kotlin 存在 bug，`kotlin-android-extensions`（用于直接在代码中使用 XML 中 View 的 Id 的扩展）存在 bug,Kotlin 官方表示在 1.4.20 版本修复**
  [1]: https://raw.githubusercontent.com/appdev/gallery/main/img/5a0d1f1b941f48e894e3dce15a4468b4~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp
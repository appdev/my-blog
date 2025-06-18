---
title: "Android全新支持库androidx"
slug: "android-new-support-library-androidx"
published: 2018-09-13T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
如果使用最新版 Android Studio 创建基于 API28 的项目，就会发现，原来的 `android.support.*` 全部变成了`androidx.*`？？这是什么鬼？我们来看看 Google 的介绍
> 我们正在推出一种新的软件包结构，以便更清楚哪些软件包与 Android 操作系统捆绑在一起，并与您的应用程序的 APK 一起打包。展望未来，android.*软件包层次结构将保留给随操作系统提供的 Android 软件包; 其他包将在新的 androidx.*包层次结构中发布。
> 正在重构现有包以使用新层次结构。历史文物 - 那些版本为 27 及更早版本，并打包为 android.support.*- 将继续在 Google Maven 上提供; 但是，所有新开发都将发生在 androidx.*从 1.0.0 开始版本化的新打包工件中。
> 有关所有旧类和构建工件的完整映射到新的，请参阅 [AndroidX 重构页面][1]。有关 AndroidX 重构的更多信息， [请参阅博客文章。][2]
> 版本控制更改
> 新工件将遵循 [语义版本控制][3]，并将独立更新，而不是一次更新。重组后，可以独立更新项目中的 AndroidX 库。这避免了将项目中的许多支持库模块从例如一次更新 26.1.0 到 27.0.0 所有支持库模块的问题。
> 新项目
> 如果使用 androidx 打包的依赖项创建新项目（而不是使用 Android Studio 工具重构现有项目），则新项目需要针对 API 级别 28，并且您需要将以下行添加到您的 `gradle.properties` 文件中：
```
android.useAndroidX=true
android.enableJetifier=true
```
---
简而言之，support 包会继续维护，但是所有新特性都会放到 androidx 中，如果想使用 androidx，需要 API 为 28(IDE 应该也需要最新版本)，同时 `gradle.properties` 中添加 `android.useAndroidX=true` `android.enableJetifier=true`,反之不想使用设置为 false 即可，需要注意的是即使依赖中**不添加** `implementation androidx.*`相关的支持库，如果 `gradle.properties` 中设置为 true 仍然使用 androidx 相关支持库，`android.support` 相关引用会提示 not found
  [1]: https://developer.android.com/topic/libraries/support-library/refactor.html
  [2]: https://android-developers.googleblog.com/2018/05/hello-world-androidx.html
  [3]: https://semver.org/
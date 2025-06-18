---
title: "Flutter 基础 | Dart 语法 mixin"
slug: "basic-dart-syntax-mixin"
published: 2022-02-10T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
---
假设有这样一种场景：小明和小方都是程序员。其中小方会跳舞，当然它们都会编程。
用面向对象的方法可以建模如下：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268725438bf52166-974f-442c-9d42-fbdcb3742148.webp)
因为小明和小方都会写编程，为了复用这个行为，提取了超类 Programmer，它包含所有程序员共用的行为 code()。这样一来，Ming 和 Fang 就能复用编程行为，而不是各自重新实现一遍相同的逻辑。（继承复用了行为）
小慧是一个舞者，再用面向对象的方法建模如下：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726873752e2d2c122-d74c-4d0e-8771-365c5eac70fb.webp)
这样的继承关系违反了 DRY 原则，即 Don't repeat yourself.
因为小慧并未复用小方的跳舞行为，所以同样的跳舞逻辑出现了两次。
那把跳舞行为上提到它们公共的基类 Human 中，是不是就解决问题了？的确，但这不是强迫所有程序员都必须会跳舞吗。。。
那让小方同时继承 Programmer 和 Dancer 能解决问题吗？能！但多重继承容易出事情，比如“Diamond Problem”：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268751746c366cb2-3581-45ff-8d43-30c16431a383.webp)
假设 Human 类中有 eat() 方法，且 Programmer 和 Dancer 都重写了它，此时 Fang 会发生编译报错。因为它不知道自己的 eat() 方法该采用哪一个父类的实现。上面的类图就好像一个钻石的形状，所以称为**Diamond problem**。
Dart 禁用了多重继承，而是引入了 `mixin` 来解决这个问题。
> mixin 是一个特殊的类，它的属性和行为可以被其他类复用，而且不需要通过继承。
## 语法
如果希望一组属性和行为能够复用于多个类，碰巧这些类不在一条继承链路上，此时就应该使用 `mixin`：
```dart
mixin DanceMixin {
  void dance() {}
}
```
这是声明 mixin 的方式，几乎和声明 class 一模一样，就是把 class 换成 mixin 而已。
还可以通过 `on` 限定 mixin 适用范围：
```dart
mixin DanceMixin on Human {
  void dance() {
}
```
这样 DanceMixin 只能用于 Human 类。
此时 mixin 还可以顺带便重写 Human 类的方法：
```dart
class Human {
  void eat() {}
}
mixin DanceMixin on Human {
  void dance() {}
  @override
  void eat() {
    super()
    ...
  }
}
```
Fang 和 Hui 用 mixin 重构如下：
```dart
class Fang extends Programmer with DanceMixin {} 
class Hui extends Human with DanceMixin {}
```
关键词 `with` 表示使用 mixin，类可以同时使用多个 mixin，它们用 `,` 隔开。
## 参考
[Multiple Inheritance in C++ and the Diamond Problem (freecodecamp.org)](https://link.juejin.cn/?target=https%3A%2F%2Fwww.freecodecamp.org%2Fnews%2Fmultiple-inheritance-in-c-and-the-diamond-problem-7c12a9ddbbec%2F "https://www.freecodecamp.org/news/multiple-inheritance-in-c-and-the-diamond-problem-7c12a9ddbbec/")
[Language tour | Dart](https://link.juejin.cn/?target=https%3A%2F%2Fdart.dev%2Fguides%2Flanguage%2Flanguage-tour "https://dart.dev/guides/language/language-tour")
[https://juejin.cn/post/7062516429429407781](https://juejin.cn/post/7062516429429407781)

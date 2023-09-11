---
title: "使用 Rust 开发 Android 底层库，并简化 Java 与 Rust 相互操作 "
slug: "developing_android_underlying_libraries_using_rust"
date: 2023-09-07T18:08:34+08:00
# aliases: ["/first"]
# categories: [Linux]
# tags: [tools]
showToc: true
TocOpen: true
draft: false
description: ""
cover:
     image: "https://raw.githubusercontent.com/appdev/gallery/main/img/202309111516694.webp" # image path/url
#      alt: "alt text" # image alt text
     caption: "" # 详情页图片下面的文字
#     relative: false # when using page bundles set this to true
---

### 前言
提到JNI,大家都会想到C,C++.不过如今Rust又给我们增加了一个选项,借助rust的jni库(https://github.com/jni-rs/jni-rs),我们可以很方便的使Android与rust交互.从本章起,我们将逐步地了解使用rust实现一些经典的jni方法.

关于 Rust 环境搭建、配置 Rust Android targets、linker，以及如何在 Android 上如何直接运行 Rust 代码，可以看上篇文章 [将 Rust 编译为可在 Android 上使用的二进制文件](https://apkdv.com/compile_rust_into_a_binary_file_that_can_be_used_on_android.html)

本文主要介绍如何使用 Rust 借助  `J4RS` **方便快捷**的编写 Android Jni:

阅读本文，你需要具备、了解一下知识：
- Android 编写 JNI 的基本流程
- Rust 代码基本的阅读能力
- Android 开发的基本流程

### Android 集成 Rust

####  配置 Rust Android Gradle Plugin

[Rust Android Gradle Plugin](https://github.com/mozilla/rust-android-gradle) 这个 Gradle 插件的主要功能是帮你自动配置 Rust-Android 交叉编译，并将编译产物自动添加到 Android 项目。

> 这并不是必须的，你同样可以手动 build rust 项目。然后手动复制到 Android Studio 中使用。

> 因为我使用的是最新版本的 gradle , 采用 Kotlin kts 编写。在语法上稍有不同，旧版本写法可以在项目的 [README](https://github.com/mozilla/rust-android-gradle/blob/master/README.md) 查看
 
 ##### 添加插件

在项目根目录`settings.gradle.kts`添加

 ```kotlin
 pluginManagement {
    repositories {
        google()
        mavenCentral()
+      maven(url = "https://plugins.gradle.org/m2/")
        gradlePluginPortal()
    }
}
 ```
在 `build.gradle.kts`添加

```kotlin
plugins {
    id("com.android.application") version "8.1.0" apply false
    id("org.jetbrains.kotlin.android") version "1.8.0" apply false
+   id("org.mozilla.rust-android-gradle.rust-android") version "0.9.3"
}
```
#### 创建 Rust 项目

在项目根目录执行：

`cargo new --lib rust`

> 你的项目名称、路径并不需要和我的保持一致。

现在我们的项目目录结构应该是这样的：

![](https://raw.githubusercontent.com/appdev/gallery/main/img/202309081850149.webp)

#### 配置cargo

在项目级 `build.gradle.kts` 添加：

添加 `cargo` 配置：

```kotlin
android{}


cargo {
    module = "../rust"       // Cargo.toml路径
    libname = "rust"          // Cargo.toml 中 [package] 中 name
    targets = listOf("arm", "arm64" /*"x86", "x86_64"*/)
    targetIncludes = arrayOf("rust.so") // 编译后 so 的名字
    targetDirectory = "../rust/target/" // rust 编译产物的目录
}


tasks.whenTaskAdded {
    when (name) {
        "mergeDebugJniLibFolders", "mergeReleaseJniLibFolders" -> {
            dependsOn("cargoBuild")
            this.inputs.dir(buildDir.resolve("rustJniLibs/android")) // 将编译后的 so 复制到 build/rustJniLibs/android 目录
        }
    }
}

tasks.register<Exec>("cargoClean") {
    executable("cargo")     // cargo.cargoCommand
    args("clean")
    // rust 项目的路径
    workingDir("${projectDir.parentFile}${cargo.module?.replace("..", "")}")
}

tasks.clean.dependsOn("cargoClean")
```


添加 plugins：
```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
+   id("org.mozilla.rust-android-gradle.rust-android")
}
````
添加 android target
```shell
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android
```

OK 现在同步 Gradle 即可使用插件来自动进行 Rust 的交叉编译了。

### 编写 Android  调用 Rust 代码

Android 端代码：

```Kotlin
class CallRust {
    init {
        System.loadLibrary("rust");
    }

     external fun callback(listener: Instance<RustListener>)
}

interface RustListener {
    fun onStringCallback(msg: String)
    fun onVoidCallback()
}
```

Rust 本上是兼容 C 接口的，所以我们先使用传统方式写

```rust
#![allow(non_snake_case)]
#[no_mangle]
pub extern fn Java_com_apkdv_rustinandroid_CallRust_callback(_env: JNIEnv, _class: JClass,
                                                                 callback: JObject) {
    let hello = "Hello world from Rust";
    // 转为 Java String
    let jni_string_hello = JNIString::from(hello);
    let j_string_hello = _env.new_string(jni_string_hello).unwrap();
    _env.call_method(callback, "onStringCallback", "(Ljava/lang/String;)V", &[j_string_hello.into()]).unwrap();
    _env.call_method(callback, "onVoidCallback", "()V", &[]).unwrap();
}
```
可以看到，就写法上还是稍微有点麻烦，接下来我们使用 J4RS 来实现：

#### 进阶——使用 J4RS 简化 Java 与 Rust 的相互调用

先添加 j4rs 依赖

`cargo add j4rs_derive j4rs`

在 Android Gradle 中添加  

```kotlin
implementation("io.github.astonbitecode:j4rs:0.17.1")
```
修改 Android 代码：
```kotlin
class CallRust {
    init {
        System.loadLibrary("rust");
    }

     external fun callback(listener: Instance<RustListener>)
}

interface RustListener {
    fun onStringCallback(msg: String)
    fun onVoidCallback()
}

```
Rust 端实现：

```rust
#[call_from_java("com.apkdv.rustinandroid.CallRust.callback")]
fn rust_to_java_callback(callback: Instance) {
    let jvm = Jvm::attach_thread().unwrap();
    let ia = InvocationArg::try_from("callback from j4rs").unwrap();
    let _ = jvm.invoke(&callback, "onStringCallback", &[ia]).unwrap();
    let _ = jvm.invoke(&callback, "onVoidCallback", &[]).unwrap();
}
```

这就完成了。可以看到，写起来非常的方便，不需要写冗长的函数签名，直接使用 `call_from_java` 声明Java 的方法名就可以了，而且也可以直接使用 Rust 的类型了。

### J4RS 使用介绍

 [J4RS](https://github.com/astonbitecode/j4rs) 允许从Rust轻松调用Java代码，反之亦然。

 j4rs 具有以下特性： 
- 从 Rust 代码中调用 Java 代码。
- Java 到 Rust 回调。
- Java 泛型。
- Java 函数重载。


#### 支持的数据类型

j4rs 支持以下数据类型的转换：

Rust 到 Java：
- i8、i16、i32、i64、u8、u16、u32、u64
- f32、f64
- String
- Vec<T>
- Result<T, E>

Java 到 Rust：
- byte、short、int、long、float、double
- String
- List<T>
- Map<K, V>
- Optional<T>

#### 向Java传递Rust 数据
j4rs 使用InvocationArg枚举将参数传递给 Java 。使用`TryFrom`语法可以传递几种基本类型：
```rust
let i1 = InvocationArg::try_from("a str")?;      // java.lang.String
let my_string = "a string".to_owned();
let i2 = InvocationArg::try_from(my_string)?;    // java.lang.String
let i3 = InvocationArg::try_from(true)?;         // java.lang.Boolean
let i4 = InvocationArg::try_from(1_i8)?;         // java.lang.Byte
let i5 = InvocationArg::try_from('c')?;          // java.lang.Character
let i6 = InvocationArg::try_from(1_i16)?;        // java.lang.Short
let i7 = InvocationArg::try_from(1_i64)?;        // java.lang.Long
let i8 = InvocationArg::try_from(0.1_f32)?;      // java.lang.Float
let i9 = InvocationArg::try_from(0.1_f64)?;      // java.lang.Double
```
对于自定义类型：
```rust
#[derive(Serialize, Deserialize, Debug)]
#[allow(non_snake_case)]
struct MyBean {
    name: String,
    age: i32,
}

let my_bean = MyBean {
    name: "My String In A Bean".to_string(),
    age: 33,
};
let ia = InvocationArg::new(&my_bean, "com.apkdv.rustinandroid.MyBean");
```

在 Kotlin 端：
```kotlin
data class MyClass(val name: String, val age: Int) {
    // 必须有一个无参构造函数
    constructor() : this("", 0)
}
```
> 需要注意的是。j4rs 内部使用 `Jackson` 解析数据，所以，如果使用 Kotlin 的 data class 需要手动实现一个无参的构造函数。

对于`Vec`：
```rust
let my_vec: Vec<String> = vec![
    "abc".to_owned(),
    "def".to_owned(),
    "ghi".to_owned()];
//
let i10 = InvocationArg::try_from(my_vec.as_slice())?;
```
对于 NULL

```rust
let null_string = InvocationArg::from(Null::String);                // A null String
let null_integer = InvocationArg::from(Null::Integer);              // A null Integer
let null_obj = InvocationArg::from(Null::Of("java.util.List"));    // A null object of any other class. E.g. List
```
#### Java 调用 Rust

Java 调用 Rust  除了上面提交的需要添加 j4rs 的 gradle 依赖以外，并不需要特别的处理。唯一值得注意的是，所有返回值、参数需要用 `Instance`包括，比如:

```kotlin
// 返回值
external fun callByJ4rs(): Instance<String>
// 参数与回调
external fun callback(listener: Instance<RustListener>)
```
从 Instance 取出数据
```kotlin
val callResult = CallRust().callByJ4rs()
val resultString = Java2RustUtils.getObjectCasted<String>(callResult)
```


#### Rust 调用 Java

> j4rs 自身是支持调用Java 动态方法的。但是需要传入 Jar 路径，所以在 Android 端目前只成功调用了 静态方法。如果有其他方法欢迎留言评论。

调用 Java 静态方法：

![](https://raw.githubusercontent.com/appdev/gallery/main/img/202309111450546.png)

Android 端：
![](https://raw.githubusercontent.com/appdev/gallery/main/img/202309111451102.png)
> 需要注意：Java 中不能直接调用 Kotlin 中的静态方法和静态变量，所以需要在 Kotlin 方法上加上`@JvmStatic`


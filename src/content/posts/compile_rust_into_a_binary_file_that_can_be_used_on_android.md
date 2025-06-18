---
title: "将 Rust 编译为可在 Android 上使用的二进制文件"
slug: "compile_rust_into_a_binary_file_that_can_be_used_on_android"
published: 2023-03-20T11:52:26+08:00
showToc: true
TocOpen: true
draft: false
---
Rust 语言已经成为了越来越受欢迎的一种系统级编程语言。它被广泛使用来开发高性能的系统软件，模块化的库，以及并发和并行计算应用程序。不仅如此，它还可以为其他平台和设备生成二进制代码，包括 Android 操作系统。如果你也想在 Android 上利用 Rust 开发应用程序
### 创建 Rust 项目
首先创建 Rust 项目
 ```shell
 cargo new rustDemo
 ```
 为了跟前文 ([使用 GoMobile 创建 Android、iOS 跨平台 WebSocket Library](https://apkdv.com/creating-android-ios-cross-platform-libraries-with-gomobile.html)) 呼应，我们这里也使用 Rust 借助 tokio 写一个 WebSocket Server。
main.rs
 ```rust
 use async_trait::async_trait;
use ezsockets::Error;
use ezsockets::Server;
use ezsockets::Socket;
use std::net::SocketAddr;
type SessionID = u16;
type Session = ezsockets::Session<SessionID, ()>;
struct EchoServer {}
#[async_trait]
impl ezsockets::ServerExt for EchoServer {
    type Session = EchoSession;
    type Call = ();
    async fn on_connect(
        &mut self,
        socket: Socket,
        address: SocketAddr,
        _args: (),
    ) -> Result<Session, Error> {
        let id = address.port();
        let session = Session::create(|handle| EchoSession { id, handle }, id, socket);
        Ok(session)
    }
    async fn on_disconnect(
        &mut self,
        _id: <Self::Session as ezsockets::SessionExt>::ID,
    ) -> Result<(), Error> {
        Ok(())
    }
    async fn on_call(&mut self, call: Self::Call) -> Result<(), Error> {
        let () = call;
        Ok(())
    }
}
struct EchoSession {
    handle: Session,
    id: SessionID,
}
#[async_trait]
impl ezsockets::SessionExt for EchoSession {
    type ID = SessionID;
    type Args = ();
    type Call = ();
    fn id(&self) -> &Self::ID {
        &self.id
    }
    async fn on_text(&mut self, text: String) -> Result<(), Error> {
        self.handle.text(text);
        Ok(())
    }
    async fn on_binary(&mut self, _bytes: Vec<u8>) -> Result<(), Error> {
        unimplemented!()
    }
    async fn on_call(&mut self, call: Self::Call) -> Result<(), Error> {
        let () = call;
        Ok(())
    }
}
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let (server, _) = Server::create(|_server| EchoServer {});
    ezsockets::tungstenite::run(server, "127.0.0.1:9091", |_| async move { Ok(()) })
        .await
        .unwrap();
}
```
dependencies：
```toml
[dependencies]
async-trait = "0.1.67"
ezsockets = "0.5.1"
tokio = { version = "1.26.0", features = ["full"] }
tracing = "0.1.37"
tracing-subscriber = "0.3.16"
```
### 添加 targets
```shell
> rustup target add aarch64-linux-android \
                  armv7-linux-androideabi \
                  i686-linux-android \
                  x86_64-linux-android
```
### 指定 linker
Rust 默认调用平台安装的 cc 编译器，所哟我们需要指定 Android 的 CC 和 AR
首先安装 Android NDK
> 部分教程说需要执行下面的命令：
> ```shell
> python ${NDK_HOME}/build/tools/make_standalone_toolchain.py --api 26 > --arch arm64 --install-dir NDK/arm64
> ```
其实是不用的。在新的 NDK 中已经自自带了。我们在项目跟目录创建 `.cargo/config`：
```shell
[target.aarch64-linux-android]
linker = '/home/ying/Android/Sdk/ndk/25.2.9519653/toolchains/llvm/prebuilt/linux-x86_64/bin/aarch64-linux-android21-clang'
ar = '/home/ying/Android/Sdk/ndk/25.2.9519653/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-ar'
```
### 编译 Rust 代码
执行：
```shell
 cargo build --target aarch64-linux-android --release
 ```
 会在 `target/aarch64-linux-android/release` 目录下生成产物
 > 如果你使用 r23c 及以上版本，那么 cargo build 可能会出现以下错误，原因是 libgcc.a 已经被 libunwind.a 替代：
> ```shell
> ld: error: unable to find library -lgcc
> ```
> 可以把把 libunwind.a 复制一份重命名为 libgcc.a，它的路径为：/ndk/25.2.9519653/toolchains/llvm/prebuilt/linux-x86_64/lib64/clang/14.0.7/lib/linux/aarch64/
 ### 在 Android 中运行
可以参考上篇文章 [使用 GoMobile 创建 Android、iOS 跨平台 WebSocket Library](https://apkdv.com/creating-android-ios-cross-platform-libraries-with-gomobile.html) 稍微修改即可：
```kotlin
....
    MainScope().launch(Dispatchers.IO) {
        Runtime.getRuntime().exec("so 的路径")
    }
...
```
### 总结
要在 Android 设备运行 Rust 可执行我呢间需要：
- 使用 rustup 添加 android 设备相关的 target
- 项目中配置 linker ar
- 编译 rust 代码
- android 项目中执行 rust 文件
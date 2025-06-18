---
title: "使用 GoMobile 创建 Android、iOS 跨平台 WebSocket Library"
slug: "creating-android-ios-cross-platform-libraries-with-gomobile"
published: 2023-03-14T18:19:52+08:00
# aliases: ["/first"]
# categories: [Linux]
# tags: [tools]
showToc: true
TocOpen: true
draft: false
---
GoMobile 是 Go 语言的扩展，将 Go 代码编译为可在移动设备上运行的静态库或动态库，可在 iOS 和 Android 平台上使用。本文介绍如何使用 GoMobile 创建 Android 应用并在其中调用 Go 语言 WebSocket。
### 安装 GoMobile
```shell
go install golang.org/x/mobile/cmd/gomobile@latest
```
### 创建 Go WebSocket 库
首先创建一个 Go WebSocket 服务端：
```shell
mkdir go-websocket
cd go-websocket
go mod init go-socket
// 使用 gomobile 初始
gomobile init
```
> 如果你无法使用 `gomobile init` 请检查 `GOBIN` 是否加入环境变量
我们使用在 go 中广泛使用的 `gorilla/websocket` 来创建 websocket 服务端：
```shell
go get github.com/gorilla/websocket
```
编写 `WebSocket` 服务端代码：
```go
package socket
import (
	"flag"
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)
var addr = flag.String("addr", "localhost:8080", "http service address")
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
} // use default options
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)
		err = c.WriteMessage(mt, message)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}
func main() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/", handleWebSocket)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
func StartServer() {
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/", handleWebSocket)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
```
上面这段代码我们使用 Gorilla WebSocket 库来处理 WebSocket 连接。当连接建立后，函数将在一个无限循环中等待来自客户端的消息，并将这些消息原封不动地发送回客户端。
我们可以运行 `main` 方法来测试 WebSocket 服务器是否正常运行。
### 构建 Go 库
现在，将我们的 Go 代码编译成一个静态库，以便它可以被 Android 应用程序使用：
```shell
 gomobile bind -target=android/arm64 -o go-websocket.aar -classpath com.apkdv.websocket 
```
` - o` 指定输出文件的名字。  
`-classpath` 指定输出的类包名
### 创建 Android 应用程序
在 Android Studio 中创建一个新项目。选择 "Empty Activity" 模板。
将刚刚创建的 Go 库导入到 Android 项目中:
- 将 go-websocket.aar 文件复制到 Android 项目的 libs 文件夹中。如果该文件夹不存在，则需要手动创建。
- 在 App 的 `build.gradle` `dependencies` 下添加：
` api fileTree(dir: 'libs', include: ['*.jar', '*.aar'])`
- 同时我们使用 `okHttp` 连接我们的 go-websocket
最终我们的 `dependencies` 如下：
![](https://raw.githubusercontent.com/appdev/gallery/main/img/202303151435466.png)
接下来在 `MainActivity` 中使用 `okhttp` 连接 websocket 服务：
```kotlin
val request = Request.Builder()
            .url("ws://127.0.0.1:8080")
            .build()
        val client = OkHttpClient.Builder()
            .pingInterval(10, TimeUnit.SECONDS)
            .build()
        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                super.onOpen(webSocket, response)
                webSocket.send("Hello, server!")
            }
            override fun onMessage(webSocket: WebSocket, text: String) {
                super.onMessage(webSocket, text)
                Log.d(TAG, "Received message: $text")
            }
            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
                super.onMessage(webSocket, bytes)
                Log.d(TAG, "Received message: ${bytes.utf8()}")
            }
            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                super.onFailure(webSocket, t, response)
                Log.d(TAG, "WebSocket connection failed: ${t.message}")
            }
        })
```
建立连接之后，点击按钮，发送一个每次递增的消息
```kotlin
findViewById<TextView>(R.id.text).setOnClickListener {
            index++
            webSocket.send("index $index")
        }
```
上面的代码。我们首先用 `okhttp` 连接 go 床架创建的 websocket 服务端，在连接成功后，点击屏幕上的按钮，会向服务端发送一个消息，服务端收到消息后，会将消息原封不动在发送回客户端。
来看看运行日志：
![](https://raw.githubusercontent.com/appdev/gallery/main/img/202303151656718.png)
### 总结
 使用 Go 开发跨平台 Library 需要一下步骤：
 - 安装 GoMobile，并使用 `gomobile init` 初始化 go 项目
 - 使用 GoMobile 将 go 项目编译常 android、iOS 的支持库
 - 将编译的 aar 导入项目
 - 在 Android 项目中使用 aar
借助 GoMobile 我们能简单方便的将 go 代码在移动端使用，下篇文章，我们将介绍如何将 Rust 集成到移动端，与 go 相比，Rust 有更更多的有点。
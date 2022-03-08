---
title: "解决 golang IDEA中不能debug问题"
slug: "solving-the-problem-of-not-debug-in-golang-idea"
date: 2019-03-26T17:16:07+08:00
categories: [软件开发]
tags: [软件开发]
showToc: true
TocOpen: true
draft: false
description: "IDEA是2018-01版本，Golang是go-1.12.1，IDEA在Plugins中安裝的Go插件，我在运行go程序時是正常的，但是提"

---
                
IDEA是2018-01版本，Golang是`go-1.12.1`，IDEA在Plugins中安裝的Go插件，我在运行go程序時是正常的，但是提示`could not launch process: decoding dwarf section info at offset 0x0: too short`


解決方案：

1：在终端运行  go get -u github.com/derekparker/delve/cmd/dlv。

2：运行上面的命令之后运行环境中就有dlv了。替换IDEA go 插件中的dlv macOS中的插件地址是：`/Users/用户名 /Library/Application Support/IntelliJIdea2018.1/intellij-go/lib/dlv/mac`

替换之后就正常了。
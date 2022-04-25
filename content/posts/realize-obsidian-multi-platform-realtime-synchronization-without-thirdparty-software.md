---
title: "不使用第三方软件实现Obsidian多平台实时同步"
slug: "realize-obsidian-multi-platform-realtime-synchronization-without-thirdparty-software"
date: 2021-12-24T17:16:07+08:00
categories: [软件开发]
tags: [软件开发]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "-这篇文章涉及服务器配置、docker技术，当然都是很初级的使用相信很多人跟我一样，不喜欢使用第三方软件来同步Obsidian"
cover: 
    image: "https://user-images.githubusercontent.com/45774780/137355323-f57a8b09-abf2-4501-836c-8cb7d2ff24a3.gif"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
**这篇文章涉及服务器配置、docker 技术，当然都是很初级的使用**

相信很多人跟我一样，不喜欢使用第三方软件来同步 Obsidian 。每次要打开两个软件，很麻烦。这种情况在手机上最为明显。

这也是我为什么从 9 月多就接触了 Obsidian 但是一没有最为主力的原因。虽然印象笔记已经非常的不好用，但是他的同步真的非常的方便。

直到最近在翻看 Obsidian 的插件的时候接触到了这个插件 `Self-hosted LiveSync`（虽然也有一款支持 WebDav 的插件，但是试了一下连不上服务器，作者说目前 WebDav 还在测试中）这个插件真的非常的棒 👍🏻。实现了无感同步，甚至可以多平台实时同步。
引用一张作者的图：
![](https://user-images.githubusercontent.com/45774780/137355323-f57a8b09-abf2-4501-836c-8cb7d2ff24a3.gif)

### 搭建服务器端

`Self-hosted LiveSync` 使用的是[CouchDB](https://zh.wikipedia.org/wiki/CouchDB)数据库，这是一个开源的具有版本控制的文档数据库。

> 你可使用 IBM 提供的 CouchDB 数据库，这里有作者写的教程  https://github.com/vrtmrz/obsidian-livesync/blob/main/docs/setup_cloudant.md

我们这里还是直接自己搭建，我是在家里的群辉 NAS 上搭建的，如果你没有 NAS 也可以在腾讯云、阿里云等云服务上搭建。优先推荐在 NAS 上搭建。

#### 安装 docker

群辉直接再套件商店安装。云服务器用户使用下面的命令

```shell
docker version > /dev/null || curl -fsSL get.docker.com | bash
service docker restart
```

#### 安装数据库

首先创建配置文件
local.ini

```ini
[couchdb]
single_node=true

[chttpd]
require_valid_user = true

[chttpd_auth]
require_valid_user = true
authentication_redirect = /_utils/session.html

[httpd]
WWW-Authenticate = Basic realm="couchdb"
enable_cors = true

[cors]
origins = app://obsidian.md,capacitor://localhost,http://localhost
credentials = true
headers = accept, authorization, content-type, origin, referer
methods = GET, PUT, POST, HEAD, DELETE
max_age = 3600
```

配置文件创建完成后，就可以启动 CouchDB ：

````shell
docker run --rm -it -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -v /opt/couchdb/db:/opt/couchdb/data -v /opt/couchdb/local.ini:/opt/couchdb/etc/local.ini -p 6900:5984 couchdb
````

其中:
`COUCHDB_USER` 后面的是你的密码
`COUCHDB_USER` 后面的是你的用户名
`/opt/couchdb/local.ini` 是配置文件的路径
`/opt/couchdb/db` 是数据库的路径
`-p 6900:5984` 前面的 6900 是暴露在外的端口。

以上的所有配置都是可以修改的。可以改成你自己的配置，**云服务器请提前在安全组里放行相应的端口**。

群辉这么配置：
重启或者关闭 NAS 后自动启动
![webp](https://static.apkdv.com/blog/blog/1646726865634webp)

配置文件和数据库路径
![webp](https://static.apkdv.com/blog/blog/1646726865939webp)
用户名和密码
![webp](https://static.apkdv.com/blog/blog/1646726866365webp)

端口配置
![webp](https://static.apkdv.com/blog/blog/1646726866767webp)

访问以下网址，如果能打开则表示 CouchDB 已经启动：

http://你的 IP:你的端口

比如 http://127.0.0.1:6900 打开网站，账号密码就是上面设置的。

> 显示的内容是一个 JSON 字符串。这是正常的：

![webp](https://static.apkdv.com/blog/blog/1646726867185webp)

群辉无需其他设置。云服务器用户再次执行（注意替换端口、账号密码）：

```shell
docker run -d --restart always  -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -v /opt/couchdb/db:/opt/couchdb/data -v /opt/couchdb/local.ini:/opt/couchdb/etc/local.ini -p 6900:5984 couchdb
```

让这个镜像在后台运行，并且自动启动。

后端部分暂时就配置完成了。

### 配置插件

以下是桌面端 Obsidian 的配置，手机上还需要其他配置:

安装插件后，打开填写各项，URL 就是上面那个网址。database name 这里填写你的数据库名字。没有回自动创建，所以随便填就行。

![webp](https://static.apkdv.com/blog/blog/1646726867519webp)

端到端加密，如果你只需要同步文章，可以关闭。如果需要同步文章、插件、配置，那么必须打开

![webp](https://static.apkdv.com/blog/blog/1646726867894webp)

设置你的客户端和 Vault 的名字。我的理解是设置一个标示，跟其他 Vault 做区分。

![webp](https://static.apkdv.com/blog/blog/1646726867519webp)

这样配置完成之后，已经可以在桌面端相互同步了。

### 配置 Https

因为手机上的限制，想要在手机上使用同步功能还需要配置 https。

#### 域名

虽然 IP 也可以申请 https 但是考虑到成本问题，最方便的还是使用域名，.com 应该是最便宜的。

#### 反向代理服务端

使用云服务搭建的同学，推荐使用宝塔面板。[安装宝塔面板](https://www.bt.cn/bbs/thread-19376-1-1.html)

安装这里我就不多做介绍了。能看到这里我相信都能独立安装的。

使用 NAS 的同学，这里可能有点麻烦，你可以使用 DDNS 或者群辉自己提供的 QC ，如果有条件的也可以是使用 frp 等等。总之能连接到你 NAS 的办法都可以。

这里我自己用的是 FRP。

宝塔面板你可以这么操作：

- 新建一个网站，并填写你的网站，如果是没有备案的域名，记得不要使用 80 端口。
- 申请证书。

这里截图说一下：

建议申请 Let's Encrypt 证书，申请简单、自动续期。

（emmm 应该都能看懂吧）

![webp](https://static.apkdv.com/blog/blog/1646726868927webp)

反向代理：

目标 URL 后面，的端口地址改成你自己设置的就可以了。前面的 IP 地址不需要修改。

![webp](https://static.apkdv.com/blog/blog/1646726869547webp)

配置完成后访问：

https://域名:端口(如果有)  正常情况下应该会打开一个和上面一样的网站。

参照上面桌面端的配置方法，只需要修改一下 URL 就好了。

> 不建议在手机上使用 LiveSync 可能会比较耗电。

补充一下群辉 NAS 的配置：

在安全里新增 域名证书。**这里的域名就是你 FRP DDNS 等用到的证书**
![webp](https://static.apkdv.com/blog/blog/1646726870142webp)

新增证书后一定要点击配置，将新增的证书应用到域名上。

然后使用群辉内置的反向代理

![webp](https://static.apkdv.com/blog/blog/1646726870474webp)

通常这么设置，**域名填写你证书的额域名即可**

![webp](https://static.apkdv.com/blog/blog/1646726870859webp)

之后就可以正常使用了。

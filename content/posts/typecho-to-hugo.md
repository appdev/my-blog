---
title: "Typecho to Hugo"
slug: "typecho-to-hugo"
date: 2022-03-11T10:49:59+08:00
categories: [岁月如歌]
tags: [Typecho,Hugo]
showToc: true
TocOpen: true
draft: false
# description: "Desc Text."
# cover:
#     image: "![17_4CHFuM](https://static.apkdv.com/blog/2022_03_07/17_4CHFuM.webp)" # image path/url
#      alt: "alt text" # image alt text
#     caption: "<text>" # 详情页图片下面的文字
#     relative: false # when using page bundles set this to true
---

这两天正式把博客从 typecho 转到 hugo 了。更准确的说应该是从动态博客转到了静态博客。

以前我是很抵制静态博客的。主要是感觉：
- 更新麻烦（现在仍然是这种感觉）
- 放在 github pages 上访问速度也不快，为了加速还需要套个 CDN。（同样是花钱，打折期间买个国内云服务器，速度不慢，还能干其他的）
- 配置真的很麻烦

这次换到 hugo 的起因是一个域名要备案，博客所在的域名要关闭评论系统，备案完后，打开评论发现，只要有评论的文章就卡死，然后 502。懒得折腾，直接关闭评论功能，发现关了后台也会卡死。索性转移到了 Hugo

Hugo 如何安装配置网上很多这里不再赘述，主要说一下我是如何转换的。

## 部署在哪里

本来打算部署在腾讯对象存储 COS 上的，不过最后还是放弃了。
1. 域名备案，内容审查。
2. 不方便自动化处理，虽然通过github action + 云函数 + hook 可以做到更新仓库后自动构建，下载到 COS 但还是略显麻烦。需要配置好几个地方。

最终选择了部署在 https://vercel.com 国内访问速度开可以。可以关联 github 仓库，不需要自动设置，可以自定义域名，似乎能自动配置 SSL 证书（表现为我设置了域名后访问自动变成 https ,证书是 `Let's Encrypt` 的免费证书）最后来个测速。
![11_LaMBoH](https://static.apkdv.com/blog/2022_03_11/11_LaMBoH.png)

## 文章迁移

typecho 有个插件，能把文章导出为 markdown 格式，但是导出的文章并不符合 hugo 的要求，hugo 在文章前面可以加很多参数的比如

```yaml
---
title: "Typecho to Hugo"
slug: "typecho-to-hugo"
date: 2022-03-11T10:49:59+08:00
categories: [岁月如歌]
tags: [Typecho,Hugo]
showToc: true
TocOpen: true
draft: false
# description: "Desc Text."
# cover:
#     image: "![17_4CHFuM](https://static.apkdv.com/blog/2022_03_07/17_4CHFuM.webp)" # image path/url
#      alt: "alt text" # image alt text
#     caption: "<text>" # 详情页图片下面的文字
#     relative: false # when using page bundles set this to true
---
```

索性写了一个小工具。把 Typecho 的数据库复制出来，然后通过 JDBC 读取需要的信息，然后解析 markdown 把以前存放在七牛、又拍云的图片都下载到本地，然后上传到 gitee 上。在替换以前的图片地址。小工具很简单，但是用起来真的方便，节约了不少时间：

[https://github.com/appdev/typecho2hugo](https://github.com/appdev/typecho2hugo)

## 带来的好处

- 这套方案下来，真的只需要一个域名钱了。
- 速度还不错
- hugo 每次构建的速度真的很快
- 待续。。。

## 一些小问题

### gitee 图片不能太大

在使用 gitee 做图床之前，我一直里用的七牛、又拍云做图床，流量费也不贵。后面开始用 github 做图床（因为私有化部署的为知笔记需要用到）这些都没什问题的，即是图片很大也都能正常显示，但是在使用 gitee 的时候发现如果图片大小超过 1M 就无法显示了。开始以为是转换程序出错导致图片错误，但是去仓库产看又是正常的。直到我换成 github 的链接才发现是这个原因。

### 编写仍然不方便

感觉写博客仍然不方便，好在现在懒了，一年也写不了几篇~~

目前是直接在 github 新建文件，在线写。图片用软件传到图传后在粘贴地址到文章。









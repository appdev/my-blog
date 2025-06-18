---
title: "GetX Router 设置返回值"
slug: "getx-router-setting-return-value"
published: 2022-02-18T17:16:07+08:00
categories: [Flutter]
tags: [Flutter]
showToc: true
TocOpen: true
draft: false
---
通过别名导航：
```
var result = await Get.toNamed(Routes.WEB_VIEW, arguments: {
          "url": item?.link ?? "",
          "index": index,
          "collect": item?.collect ?? false,
        });
```
返回值：
`Get.back(result: {"collect": collect.value});`
完整代码：
```
() async {
        /// 导航到新的界面
        var result = await Get.toNamed(Routes.WEB_VIEW, arguments: {
          "url": item?.link ?? "",
          "index": index,
          "collect": item?.collect ?? false,
        });
        /// 接收返回值
        bool collect = result["collect"];
      }
```

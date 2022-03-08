---
title: "Vue watch中调用this时出现undefined问题"
slug: "there-is-undefined-problem-when-calling-this-in-vue-watch"
date: 2021-02-24T17:16:07+08:00
categories: [软件开发]
tags: [软件开发]
showToc: true
TocOpen: true
draft: false
description: "记录一下在Vue学习使用时候的遇到的问题在watch侦听器中，想要调用methods中的方法applicationId:(val)"

---
                
记录一下在 Vue 学习使用时候的遇到的问题

在watch侦听器中，想要调用`methods`中的方法

```JavaScript
applicationId: (val)=> {
        if (val) {
	    this.getAppConfig(val)
	}
}
```
结果提示：
```
 Error in callback for watcher "applicationId": "TypeError: Cannot read property 'getAppConfig' of undefined"
```

查了官方的资料才知道。![QQ20210224-174858.png][1]

改成这样就可以了：
![QQ20210224-175021.png][2]


  [1]: https://static.apkdv.com/usr/uploads/2021/02/2318724518.png#mirages-width=723&mirages-height=167&mirages-cdn-type=2
  [2]: https://static.apkdv.com/usr/uploads/2021/02/1581197567.png#mirages-width=370&mirages-height=169&mirages-cdn-type=2
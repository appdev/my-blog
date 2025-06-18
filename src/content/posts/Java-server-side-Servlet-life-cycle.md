---
title: "Java服务器端的Servlet的生命周期"
slug: "Java-server-side-Servlet-life-cycle"
published: 2018-06-25T17:16:07+08:00
categories: [软件开发,Java]
tags: [软件开发,Java]
showToc: true
TocOpen: true
draft: false
---
servlect 生命周期，核心与接口：
servlect 生命周期的主要阶段：
1.创建 servlect 对象的创建
servlect 岁创建的？什么时候创建的？
servlect 由 web 创建，默认在请求第一次到达 servlect 时创建。若请求在次访问该 servlect，tomcat 不会新创建 servlect 对象，还是使用第一次创建的 servlect 方法去执行该业务。所以 servlect 是单例的。每一个请求使用的 servlect 都是同一个。所以会出现线程并发的安全问题。servlect 是线程非安全的。
<!--more-->
我们可以通过配置 web.xml，让 servlect 在 tomcat 启动的时候就创建 servlect 对象
必须放在 servlect 放在 servlect-name servlect-class 之后
<load-on-startup>num</load-on-startup><!– 让 tomcat 在启动的时候创建 servlect 对象 –>
num 表示创建的优先级，num 越小，优先级越高！！
2.初始化 servlect 对象
```java
init();
servlect 生命周期相关 API；
servlect(I):接口
init（）；初始化方法
service(ServlectRequest,ServlectResonse);业务方法
destroy();销毁方法
init(){};
destroy(){}
HttpServlect(AC);抽象类
init(){};实现
service(){};实现
ActionServlect（C）
```
初始化方法 init（）是谁调用，什么时候调用的？
web 容器，在 servlect 创建完毕后，立即调用，仅仅调用一次。tomcat 会立即调用。
init(ServlectConfig config)
ServlectConfig :读取 web.xml 中的配置信息
config.getInitParameter(“word”);读取 web.xml 的信息
钩子方法：
在主方法中调用子方法。主方法执行的时候会同时执行子方法
//主方法。
```java
@Override
public void init(ServletConfig config) throws ServletException {
super.init(config);//首先完成父类的方法
init();//在主方法中调用子方法
}
//子方法
@Override
public void init() throws ServletException {
}
```
3.调用 servlect 对象的业务;
`servlect (HttpServlectRequest,HttpServlectResponse)`
执行 service 的 servlect 方法会判断请求是 get 还是 post
如果是 get 则执行 dpGet{},post 则执行 post{}方法
所以我们可以覆盖这两个方法来执行业务
405 异常（service 没有正确覆盖）
`doGet{}.doPost{}`
4.销毁 servlect：
destroy()
zaiweb 容器销毁 servlect 之前，会执行 servlect 的 destroy（）方法。如果我们需要在销毁之前做业务，需要
覆盖 destroy（）方法
谁在调用，什么时候调用
web 容器调用，在容器停止的时候运行。把项目移除的时候。
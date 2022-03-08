---
title: "Java中Timer类的简单应用"
slug: "simple-application-of-timer-class-in-java"
date: 2018-06-27T17:16:07+08:00
categories: [软件开发,Java]
tags: [软件开发,Java]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "Timer的介绍：Timer是一种定时器工具，用来在一个后台线程计划执行指定任务。它可以计划执行一个任务一次或反复多次。TimerTask"

---
                
Timer的介绍：

Timer是一种定时器工具，用来在一个后台线程计划执行指定任务。它可以计划执行一个任务一次或反复多次。
TimerTask一个抽象类，它的子类代表一个可以被Timer计划的任务。

Timer类常用的两个方法：


<!--more-->


```
Timer timer = new Timer();
//在1秒后执行此任务,每次间隔2秒,如果传递一个Data参数,就可以在某个固定的时间执行这个任务.
timer.schedule(new MyTask(), 1000, 2000);
```


简单的一个例程：

这个java代码将详细讲解选这两个方法的使用

java代码：
```java
package Day_26;

import java.util.Iterator;
import java.util.Timer;
import java.util.TimerTask;

public class TimerDemo1 {

public static void main(String[] args) {
//首先构建一个计时对象Timer
System.out.println(“计时开始”);
final Timer timer = new Timer();
timer.schedule(new TimerTask() {//建立匿名内部类，重新run方法，开始线程
/**执行顺序：
* 会首先跳过第一个匿名内部类。直接执行第二个内部类，完成后会返回第一个内部类来执行。
*
* */
@Override
public void run() {
System.out.println(“计时结束”);
timer.cancel();//结束任务
}
}, 6000);//时间属性（这个时间为第二个任务执行的时间）

//第二个任务
timer.schedule(new TimerTask() {
int i = 0;
@Override
public void run() {
//如果变量定义在此处。每次执行会被初始化。
System.out.println(++i);//
}
},0,1000);

}
}
```

运行结果：
[cce]
计时开始
1
2
3
4
5
6
7
计时结束

---
title: "Android工作线程之间的消息传递以及工作线程与主线程之间消息的传递"
slug: "message-passing-between-android-worker-threads-and-message-passing-between-worker-threads-and-main-threads"
date: 2018-06-27T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "这个是一个android的简单案例：界面的部分主要有三个按钮组成，这里将不再赘述他们之间的消息传递方法将会在代码中体现，其中对重要步骤进"

---
                
这个是一个android的简单案例：

界面的部分主要有三个按钮组成，这里将不再赘述

他们之间的消息传递方法将会在代码中体现，其中对重要步骤进行了详细的注释。

 


<!--more-->


```java
/**
* 需求：工作线程A向工作线程B发送信息。线程B向主线程发送信息。
*
* 实现：线程A发送消息到线程B首先需要创建线程B中的looper对象，通过A线程的Handler来向B线程的Looper发送消息。
* 所以在创建A线程的Handler的时候需要使用 new Handler(B线程的(Looper))，这样在发送消息时。就会发送到B线程中
* getMainLooper().此方法可以用来获取主线程的Looper
*
*
*
* */
public class MainActivity extends Activity {
//构建出几个会用到的变量
private Looper mylooper;
private Handler handler;
private Handler handA;
private String title;
@Override
protected void onCreate(Bundle savedInstanceState ) {
super.onCreate(savedInstanceState);
setContentView(R.layout.activity_main);
//构建主线程的Handler.这里采用实例内部类的方法
handler = new MainHandler();
new Thread(new ClassB()).start();
}
//主线程的Handler继承了Hanler
class MainHandler extends Handler{
//重写handleMessage方法，此方法是用来处理得到的消息的
@Override
public void handleMessage(Message msg) {
setTitle((String)msg.obj);
}
}

public void doClick(View view) {
switch (view.getId()) {
case R.id.button1:
doSendA();
break;
case R.id.button2:
doSendB();
break;
case R.id.button3:
handler.obtainMessage(3,title).sendToTarget();
break;

}
}
/**向线程B发送消息*/
public void doSendA(){
//构建Handler对象，同时指定消息的接收者。
handA = new Handler(mylooper){
//重写消息处理的方法
@Override
public void dispatchMessage(Message msg) {
title = (String)msg.obj;
}
};
//使用Handler来发送消息,
handA.obtainMessage(1,"Hello LengYue").sendToTarget();
}
/**向主线程发送消息*/
public void doSendB(){
//构建ClassB的对象Handler对象，getMainLooper()收用来得到主线程的Looper对象的
Handler handB = new Handler(getMainLooper()){
@Override
public void handleMessage(Message msg) {
title = ((String)msg.obj);
}
};
handB.obtainMessage(2, title).sendToTarget();
}

/** 线程B */
class ClassB implements Runnable {

@Override
public void run() {
Looper.prepare();
mylooper = Looper.myLooper();
Looper.loop();
}
}
}
```
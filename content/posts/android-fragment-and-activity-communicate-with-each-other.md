---
title: "Android Fragment和Activity互相通讯"
slug: "android-fragment-and-activity-communicate-with-each-other"
date: 2018-06-28T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false


---
                
>一、 管理Fragment

在你的Activity你需要使用一个名为FragmentManager的类，通过调用getFragmentManager() 方法来实例化该管理类在你的Activity种。   
FragmentManager 类一些主要的方法有通过findFragmentById()来获取一个Activity中有关Fragment布局。  
当然还有类似 findFragmentByTag()方法，以及唐Fragment中出栈的popBackStack()同时可以注册 addOnBackStackChangedListener()管理.具体的可以在[android.app.FragmentManager](http://developer.android.com/reference/android/app/FragmentManager.html)类中了解


<!--more-->


>二、 优化Fragment事物处理

一个很好的特性在添加，删除，替换fragment在Activity时可以使用`FragmentTransaction`类来提高批量处理的效率，这点和SQLite的数据库更新原理类似。

```java
FragmentManager fragmentManager = getFragmentManager();     
//实例化fragmentmanager类    
FragmentTransaction transaction = fragmentManager.beginTransaction();     
//通过begintransaction方法获取一个事物处理实例。    
```

在这期间可以使用 add(), remove(), 以及 replace(). 最终需要改变时执行 commit()即可

```java
transaction.replace(R.id.fragment_container, newFragment);     
transaction.addToBackStack(null);     
transaction.commit();    
```
下面是Frahament中的代码：

为了让Fragment与它的Activity通信，你应该在这个Fragment类中定义一个接口，并在Activity中实现它。Fragment在onAttach() 生命周期方法中捕获接口的实现，接着便可以调用接口方法来与Activity通信。
```java
OnMyButtonClickListener mListener;  
    public interface OnMyButtonClickListener {  
        public void onMyButtonClick(String method);// 接口中定义一个方法  
    }  
 

onAttch代码：

@Override  
    public void onAttach(Activity activity) {  
        super.onAttach(activity);  
        try {  
            mListener = (OnMyButtonClickListener) activity;//这句就是赋初值了。  
            } catch (ClassCastException e) {  
            throw new ClassCastException(activity.toString() + “must implement OnbtnSendClickListener”);//这条表示，你不在Activity里实现这个接口的话，就要抛出异常。  
            }  
    }  
```
   主Activity中的方法：在实OnMyButtonClickListener 接口后重写onMyButtonClick  可以收到fragment中的消息。

```java
public class MainActivity extends BaseActive implements OnMyButtonClickListener {  
         ·····  
      
    @Override  
    public void onMyButtonClick(String method) {  
        //Do something  
    }  
}  
 

在Fragment中调用接口方法：

Code   ViewPrint
layoutS.setOnClickListener(new OnClickListener() {  
            @Override  
            public void onClick(View arg0) {  
                mListener.onMyButtonClick(“class”);  
            }  
        });  
```
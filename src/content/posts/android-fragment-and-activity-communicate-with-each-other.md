---
title: "Android Fragment和Activity互相通讯"
slug: "android-fragment-and-activity-communicate-with-each-other"
published: 2018-06-28T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
>一、管理 Fragment
在你的 Activity 你需要使用一个名为 FragmentManager 的类，通过调用 getFragmentManager() 方法来实例化该管理类在你的 Activity 种。   
FragmentManager 类一些主要的方法有通过 findFragmentById() 来获取一个 Activity 中有关 Fragment 布局。  
当然还有类似 findFragmentByTag() 方法，以及唐 Fragment 中出栈的 popBackStack() 同时可以注册 addOnBackStackChangedListener() 管理。具体的可以在 [android.app.FragmentManager](http://developer.android.com/reference/android/app/FragmentManager.html) 类中了解
<!--more-->
>二、优化 Fragment 事物处理
一个很好的特性在添加，删除，替换 fragment 在 Activity 时可以使用 `FragmentTransaction` 类来提高批量处理的效率，这点和 SQLite 的数据库更新原理类似。
```java
FragmentManager fragmentManager = getFragmentManager();     
//实例化 fragmentmanager 类    
FragmentTransaction transaction = fragmentManager.beginTransaction();     
//通过 begintransaction 方法获取一个事物处理实例。    
```
在这期间可以使用 add(), remove(), 以及 replace(). 最终需要改变时执行 commit() 即可
```java
transaction.replace(R.id.fragment_container, newFragment);     
transaction.addToBackStack(null);     
transaction.commit();    
```
下面是 Frahament 中的代码：
为了让 Fragment 与它的 Activity 通信，你应该在这个 Fragment 类中定义一个接口，并在 Activity 中实现它。Fragment 在 onAttach() 生命周期方法中捕获接口的实现，接着便可以调用接口方法来与 Activity 通信。
```java
OnMyButtonClickListener mListener;  
    public interface OnMyButtonClickListener {  
        public void onMyButtonClick(String method);// 接口中定义一个方法  
    }  
onAttch 代码：
@Override  
    public void onAttach(Activity activity) {  
        super.onAttach(activity);  
        try {  
            mListener = (OnMyButtonClickListener) activity;//这句就是赋初值了。  
            } catch (ClassCastException e) {  
            throw new ClassCastException(activity.toString() + “must implement OnbtnSendClickListener”);//这条表示，你不在 Activity 里实现这个接口的话，就要抛出异常。  
            }  
    }  
```
   主 Activity 中的方法：在实 OnMyButtonClickListener 接口后重写 onMyButtonClick  可以收到 fragment 中的消息。
```java
public class MainActivity extends BaseActive implements OnMyButtonClickListener {  
         ·····  
    @Override  
    public void onMyButtonClick(String method) {  
        //Do something  
    }  
}  
在 Fragment 中调用接口方法：
Code   ViewPrint
layoutS.setOnClickListener(new OnClickListener() {  
            @Override  
            public void onClick(View arg0) {  
                mListener.onMyButtonClick(“class”);  
            }  
        });  
```
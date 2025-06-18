---
title: "Android Manifest之receiver元素中文注释"
slug: "the-chinese-annotation-of-the-receiver-element-of-android-manifest"
published: 2018-07-01T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
### 语法（SYNTAX）：
```xml
<receiver android:enabled=["true" | "false"]
          android:exported=["true" | "false"]
          android:icon="drawable resource"
          android:label="string resource"
          android:name="string"
          android:permission="string"
          android:process="string" >
    . . .
</receiver>
```
<!--more-->
### 被包含于（CONTAINED IN）： 
application
### 能够包含的元素（CAN CONTAIN）： 
intent-filter
meta-data
### 说明（DESCRIPTION）：
这个元素用于声明一个广播接收器（一个 BroadcastReceiver 子类），作为应用程序的组件之一。广播接收器能够让应用程序接收那些由系统或其他应用程序发出的广播 Intent 对象，即使是在该应用程序的其他组件没有运行的时候，也能够接收来自系统或其他应用程序的广播消息。
有两种方式让系统知道本应用程序用户一个广播接收器：
1. 在应用程序的清单文件中，使用本元素来声明注册一个广播接收器；
2. 在代码中动态的创建一个广播接收器，并使用 Context.registerReceiver() 方法来注册它。有关更多动态创建接收器的方法，请看 BoradcastReceiver 类说明。
### 属性（ATTRIBUTES）：
android:enabled
这个属性用于定义系统是否能够实例化这个广播接收器，如果设置为 true，则能够实例化，如果设置为 false，则不能被实例化。默认值是 true。
<application>元素有它自己的 enabled 属性，这个属性会应用给应用程序的所有组件，包括广播接收器。<application>和<receiver>元素的这个属性都必须是 true，这个广播接收器才能够被启用。如果有一个被设置为 false，该广播接收器会被禁止实例化。
#### android:exported
这个属性用于指示该广播接收器是否能够接收来自应用程序外部的消息，如果设置 true，则能够接收，如果设置为 false，则不能够接收。如果设置为 false，这该接收只能接收那些由相同应用程序组件或带有相同用户 ID 的应用程序所发出的消息。
它的默认值依赖它所包含的 Intent 过滤器。如果不包含过滤器，则接收器只能由指定了明确类名的 Intent 对象来调用，这就意味着该接收器只能在应用程序内部使用（因为通常在应用程序外部是不会知道这个类名的）。这种情况下默认值就是 false。另一方面，如果接受器至少包含了一个过滤器，那么就意味着这个接收器能够接收来自系统或其他应用程序的 Intent 对象，因此默认值是 true。
这个属性不是唯一的限制广播接收外部调用的方法，还能够通过全限来限制能够给它发送消息的外部实体。
#### android:icon
这个属性定义了一个代表广播接收器的图标，这个属性必须用包含图片定义的可绘制资源来设定。如果没有设置这个属性，会是应用<application>元素的 icon 属性值来代替。
无论是这个属性还是<application>元素的 icon 属性，它们设置的图标也是所有的接收器的 Intent 过滤器的默认图标。
#### android:label
这个属性给广播接收器设定一个用户可读的懂的文本标签。如果这个属性没有设置，那么就会使用<application>元素的 label 属性值来代替。
无论是这个属性还是<application>元素的 label 属性，它们设置的标签也是所有的接收器的 Intent 过滤器的默认标签。
应该使用一个字符串资源来设置这个属性，以便它能够像用户界面中的其他字符串一样能够被本地化。但是，为了应用开发的便利，也能够使用原生的字符串来设置。
#### android:name
这个属性值要用广播接收器的实现类的类名来设置，它是 BroadcastReceiver 类的一个子类。通常要使用类的全名来设置（如：com.example.project.ReportReceiver）。但是，也可以使用简写（如：.ReportReceiver）。系统会自动的把<manifest>元素中的 package 属性所设定的包名添加到这个简写的名称上。
一旦发布了应用程序，就不应该在改变这个名字了（除非 `android:exported=”false”`）。
这个属性没有默认值，这个名字必须被指定。
#### android:permission
这个属性用于定义把消息发送给该广播接收器的广播器所必须要有的权限。如果没有设置这个属性，那么<application>元素的 permission 属性所设置的权限就适用于这个广播接收器。如果<application>元素也没有设置权限，那么该接收器就不受权限的保护。
#### android:process
这个属性用于设置该广播接收器应该运行在那个进程中的进程名。通常，应用程序的所有组件都在给应用程序创建的默认进程中运行，它有与应用程序包名相同的名称。<application>元素的 process 属性能够给它的所有组件设置一个不同的默认进程，但是它的每个组件自己的 process 属性能够覆盖这个默认设置，这样就允许把一个应用程序分离到多个进程中。
如果这个属性值用“:”开头，则在需要的时候系统会创建一个新的，应用程序私有的进程，并且该广播接收器也会运行在这个进程中。如果这个属性值用小写字母开头，那么接收器就会运行在以这个属性值命名的全局进程中，它提供使其工作的权限。这样就允许不同的应用程序组件来共享这个进程。
#### 被引入版本（INTRODUCED IN）：
API Level 1
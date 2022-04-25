---
title: "Android-使用@AutoService实现spi"
slug: "android-using-autoservice-to-implement-spi"
date: 2021-07-22T17:16:07+08:00
categories: [Android,Java]
tags: [Android,Java]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "什么是SPI?JavaSPI全称ServiceProviderInterface，是Java提供的一套用来被第三方实"
cover: 
    image: "https://static.apkdv.com/blog/blog/164672685915117111d731ac3ddc9~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
## **什么是 SPI?**

Java SPI 全称 Service Provider Interface，是 Java 提供的一套用来被第三方实现或者扩展的 API，它可以用来启用框架扩展和替换组件。实际上是“基于接口的编程 ＋ 策略模式 ＋ 配置文件”组合实现的动态加载机制.

具体解释就是：

* 定义一个接口文件
* 写出多个该接口文件的实现
* 在 src/main/resources/ 下建立 /META-INF/services 目录， 新增一个以接口命名的文件 , 内容是要接口的实现类全路径
* 使用 `ServiceLoader` 类 来获取到这些实现的接口

### **示例**

* 定义一个接口文件 - `Book`
  
  ```Java
  package com.apkdv.spi_test;
  
  public interface Book {
  
      String name();
  }
  ```
* 实现两个接口
  
  ```Java
  package com.apkdv.spi_test;
  
  public class Android implements Book {
      @Override
      public String name() {
          return "Android";
      }
  }
  ```
  
  ```Java
  package com.apkdv.spi_test;
  
  public class Ios implements Book {
      @Override
      public String name() {
          return "iOS";
      }
  }
  
  ```
* 在 `resources` 目录下建立 `/META-INF/services` 目录,并建立已 `com.apkdv.spi_test.Book` 为命名的文件，然后把 `Android` 和 `Ios` 全路径添加进去
  ![image.png](https://static.apkdv.com/blog/qiniu/164680461042817111d731ab34b9b~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)
* 使用 `ServiceLoader` 类读取 `Book` 接口实现类
  
  ```
  ServiceLoader<Book> load = ServiceLoader.load(Book.class);
          for (Book book : load) {
              System.out.println(book.name());
          }
  ```
* 结果
  ![image.png](https://static.apkdv.com/blog/qiniu/164680461087717111d731ab8e9d2~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

---

可以看到这个过程跟我们平常获取到接口实现类的方式不一样，平常情况下要获取到实现类可能需要个集合然后把实现类一个个添加进去，而用 spi 就不用这样操作。这样在我们平常组件化开发中非常便利，提供了解耦化的路径。

但是使用起来却很不方便，最麻烦的就是要到 `/META-INF/services` 目录建立文件，不能动态添加。所以我们用到了 Google 的 `@AutoService`，他可以帮我们在编译的时候动态去生成这些东西，这样开发中就不用做太多其他复杂操作。

## **@AutoService 引入(Koltin)**

```
apply plugin: 'kotlin-kapt'
```

```
kapt 'com.google.auto.service:auto-service:1.0'
api 'com.google.auto.service:auto-service:1.0'
```

## **@AutoService 举例**

### **创建一个接口文件**

```
interface Book {
    fun name() :String
}
```

### **创建两个继承**

* Android-Book
  ```
  @AutoService(Book::class)
  class Android :Book {
      override fun name():String {
          return "Android"
      }
  }
  ```
* iOS-Book
  ```
  @AutoService(Book::class)
  class IOS :Book {
      override fun name(): String {
          return "ios"
      }
  }
  ```

### **获取继承类**

```
private fun getBookList() {
        val bookList = ServiceLoader.load(Book::class.java, javaClass.classLoader).toList()
        bookList.forEach {
            Log.d("MainActivity", it.name())
        }
    }
```

### **结果**

![image.png](https://static.apkdv.com/blog/blog/164672685915117111d731ac3ddc9~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

可以看到获取到了两个继承类，并且不是空！


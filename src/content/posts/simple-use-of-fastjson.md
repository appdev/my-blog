---
title: "FastJson简单使用"
slug: "simple-use-of-fastjson"
published: 2018-07-01T17:16:07+08:00
categories: [Java,Android]
tags: [Java,Android]
showToc: true
TocOpen: true
draft: false
---
在工作中，经常客服端需要和服务端进行通信，目前很多项目都采用 JSON 的方式进行数据传输，简单的参数可以通过手动拼接 JSON 字符串，但如果请求的参数过多，采用手动拼接 JSON 字符串，出错率就非常大了。并且工作效率也特别低。
我在网上看了一些开源的 JSON 框架，比如 Google 提供的 Gson，Jackson，FastJson 等框架。
经过测试，个人觉得 FastJson 执行效率比较高，而且简单易用。
FastJson 不依赖于第三方包，直接可以运行在 Java JDK1.5 之上，FastJson 完全支持 http://json.org 的标准，支持各种 JDK 类型，包括基本类型、JavaBean、Collection、Map、Enum、泛型等
还支持循环引用。
FastJson 项目是开源的:Fastjson 代码托管在 github.org 上，项目地址是:https://github.com/AlibabaTech/fastjson
一个 JSON 库涉及的最基本功能就是序列化和反序列化。Fastjson 支持 java bean 的直接序列化。使用 `com.alibaba.fastjson.JSON` 这个类进行序列化和反序列化。
### 简单的序列化
```java
pubic class UserInfo implements Serializable{ 
 private String name; 
 private int age; 
 public void setName(String name){ 
  this.name=name; 
 } 
 public String getName(){ 
  return name; 
 } 
 public void setAge(int age){ 
  this.age=age; 
 } 
 public int getAge(){ 
  return age; 
 } 
}  
public class TestOne{ 
 public static void main(String[] args){ 
  UserInfo info=new UserInfo(); 
  info.setName("zhangsan"); 
  info.setAge(24); 
  //将对象转换为 JSON 字符串 
  String str_json=JSON.toJSONString(info); 
  System.out.println("JSON="+str_json); 
 } 
}
```
### 复杂的数据类型
```java
public static void test2() { 
  HashMap<String, Object> map = new HashMap<String, Object>(); 
  map.put("username", "zhangsan"); 
  map.put("age", 24); 
  map.put("sex", "男"); 
  //map 集合 
  HashMap<String, Object> temp = new HashMap<String, Object>(); 
  temp.put("name", "xiaohong"); 
  temp.put("age", "23"); 
  map.put("girlInfo", temp); 
  //list 集合 
  List<String> list = new ArrayList<String>(); 
  list.add("爬山"); 
  list.add("骑车"); 
  list.add("旅游"); 
  map.put("hobby", list); 
  /*JSON 序列化，默认序列化出的 JSON 字符串中键值对是使用双引号，如果需要单引号的 JSON 字符串， [eg:String jsonString = JSON.toJSONString(map,   SerializerFeature.UseSingleQuotes);]
   *fastjson 序列化时可以选择的 SerializerFeature 有十几个属性，你可以按照自己的需要去选择使用。 
   */ 
  String jsonString = JSON.toJSONString(map); 
  System.out.println("JSON=" + jsonString); 
}
```
### 反序列化
```java
public void test3(){ 
 String json="{"name":"chenggang","age":24}"; 
 //反序列化 
 UserInfo userInfo=JSON.parseObject(json,UserInfo.class); 
 System.out.println("name:"+userInfo.getName()+", age:"+userInfo.getAge()); 
} 
/**泛型的反序列化*/ 
public static void test4(){ 
  String json="{"user":{"name":"zhangsan","age":25}}"; 
  Map<String, UserInfoBean> map = JSON.parseObject(json, new TypeReference<Map<String, UserInfoBean>>(){}); 
  System.out.println(map.get("user")); 
 }
```
//同理，json 字符串中可以嵌套各种数据类型。
### 日期格式化
```java
public void test5(){ 
  Date date=new Date();   
  //输出毫秒值 
  System.out.println(JSON.toJSONString(date)); 
  //默认格式为 yyyy-MM-dd HH:mm:ss   
  System.out.println(JSON.toJSONString(date, SerializerFeature.WriteDateUseDateFormat)); 
  //根据自定义格式输出日期  
  System.out.println(JSON.toJSONStringWithDateFormat(date, "yyyy-MM-dd", SerializerFeature.WriteDateUseDateFormat)); 
}
```
这里举了几个简单的例子，其它特殊要求可以去查看官方的文档

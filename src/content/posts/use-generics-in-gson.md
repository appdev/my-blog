---
title: "Gson中使用泛型"
slug: "use-generics-in-gson"
published: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
JSON 字符串数组
`["Android","Java","PHP"]`  
当我们要通过 Gson 解析这个 json 时，一般有两种方式：使用数组，使用 List。而 List 对于增删都是比较方便的，所以实际使用是还是 List 比较多。
数组比较简单
```java
Gson gson = new Gson();
String jsonArray = "[\"Android\",\"Java\",\"PHP\"]";
String[] strings = gson.fromJson(jsonArray, String[].class);
```
但对于 List 将上面的代码中的 String[].class 直接改为 List<String>.class 是行不通的。对于 Java 来说 List<String> 和 List<User> 这俩个的字节码文件只一个那就是 List.class，这是 Java 泛型使用时要注意的问题 泛型擦除。
为了解决的上面的问题，Gson 为我们提供了 TypeToken 来实现对泛型的支持，所以当我们希望使用将以上的数据解析为 List<String>时需要这样写。
```java
Gson gson = new Gson();
String jsonArray = "[\"Android\",\"Java\",\"PHP\"]";
String[] strings = gson.fromJson(jsonArray, String[].class);
List<String> stringList = gson.fromJson(jsonArray, new TypeToken<List<String>>() {}.getType());
```
注：TypeToken 的构造方法是 protected 修饰的，所以上面才会写成 new TypeToken<List<String>>() {}.getType() 而不是  new TypeToken<List<String>>().getType()  
泛型解析对接口 POJO 的设计影响
泛型的引入可以减少无关的代码，如我现在所在公司接口返回的数据分为两类：
```java
{"code":"0","message":"success","data":{}}
{"code":"0","message":"success","data":[]}
```
我们真正需要的 data 所包含的数据，而 code 只使用一次，message 则几乎不用。如果 Gson 不支持泛型或不知道 Gson 支持泛型的同学一定会这么定义 POJO。
```java
public class UserResponse {
    public int code;
    public String message;
    public User data;
}
```
当其它接口的时候又重新定义一个 XXResponse 将 data 的类型改成 XX，很明显 code，和 message 被重复定义了多次，通过泛型的话我们可以将 code 和 message 字段抽取到一个 Result 的类中，这样我们只需要编写 data 字段所对应的 POJO 即可，更专注于我们的业务逻辑。如：
```java
public class Result<T> {
    public int code;
    public String message;
    public T data;
}
```
那么对于 data 字段是 User 时则可以写为 `DataResponse<User> `,当是个列表的时候为 `DataResponse<List<User>>`，其它同理。

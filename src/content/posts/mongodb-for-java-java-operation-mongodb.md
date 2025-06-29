---
title: "【MongoDB for Java】Java操作MongoDB"
slug: "mongodb-for-java-java-operation-mongodb"
published: 2018-07-01T17:16:07+08:00
categories: [软件开发,Java]
tags: [软件开发,Java]
showToc: true
TocOpen: true
draft: false
---
### 一、准备工作
1、首先，下载 mongoDB 对 Java 支持的驱动包
驱动包下载地址：https://github.com/mongodb/mongo-java-driver/downloads
mongoDB 对 Java 的相关支持、技术：http://www.mongodb.org/display/DOCS/Java+Language+Center
驱动源码下载：https://download.github.com/mongodb-mongo-java-driver-r2.6.1-7-g6037357.zip
在线查看源码：https://github.com/mongodb/mongo-java-driver
<!--more-->
2、下面建立一个 JavaProject 工程，导入下载下来的驱动包。即可在 Java 中使用 mongoDB，目录如下：
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/1646726806345faeec63cacd297fc150c977c9193b.jpg)
### 二、Java 操作 MongoDB 示例
在本示例之前你需要启动 mongod.exe 的服务，启动后，下面的程序才能顺利执行；
#### 1、建立 SimpleTest.java，完成简单的 mongoDB 数据库操作
Mongo mongo = new Mongo();
这样就创建了一个 MongoDB 的数据库连接对象，它默认连接到当前机器的 localhost 地址，端口是 27017。
DB db = mongo.getDB(“test”);
这样就获得了一个 test 的数据库，如果 mongoDB 中没有创建这个数据库也是可以正常运行的。如果你读过上一篇文章就知道，mongoDB 可以在没有创建这个数据库的情况下，完成数据的添加操作。当添加的时候，没有这个库，mongoDB 会自动创建当前数据库。
得到了 db，下一步我们要获取一个“聚集集合 DBCollection”，通过 db 对象的 getCollection 方法来完成。
DBCollection users = db.getCollection("users");
这样就获得了一个 DBCollection，它相当于我们数据库的“表”。
查询所有数据
```java
DBCursor cur = users.find();
while (cur.hasNext()) {
System.out.println(cur.next());
}
```
完整源码
```java
package com.hoo.test;
import java.net.UnknownHostException;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.util.JSON;
public class SimpleTest {
    public static void main(String[] args) throws UnknownHostException, MongoException {
        Mongo mg = new Mongo();
        //查询所有的 Database
        for (String name : mg.getDatabaseNames()) {
            System.out.println("dbName: " + name);
        }
        DB db = mg.getDB("test");
        //查询所有的聚集集合
        for (String name : db.getCollectionNames()) {
            System.out.println("collectionName: " + name);
        }
        DBCollection users = db.getCollection("users");
        //查询所有的数据
        DBCursor cur = users.find();
        while (cur.hasNext()) {
            System.out.println(cur.next());
        }
        System.out.println(cur.count());
        System.out.println(cur.getCursorId());
        System.out.println(JSON.serialize(cur));
    }
}
#### 2、完成 CRUD 操作，首先建立一个 MongoDB4CRUDTest.java，基本测试代码如下：
package com.hoo.test;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import com.mongodb.BasicDBObject;
import com.mongodb.Bytes;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.QueryOperators;
import com.mongodb.util.JSON;
/**
 * <b>function:</b>实现 MongoDB 的 CRUD 操作
 * @author hoojo
 * @createDate 2011-6-2 下午 03:21:23
 * @file MongoDB4CRUDTest.java
 * @package com.hoo.test
 * @project MongoDB
 * @blog http://blog.csdn.net/IBM_hoojo
 * @email hoojo_@126.com
 * @version 1.0
 */
public class MongoDB4CRUDTest {
    private Mongo mg = null;
    private DB db;
    private DBCollection users;
    @Before
    public void init() {
        try {
            mg = new Mongo();
            //mg = new Mongo("localhost", 27017);
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (MongoException e) {
            e.printStackTrace();
        }
        //获取 temp DB；如果默认没有创建，mongodb 会自动创建
        db = mg.getDB("temp");
        //获取 users DBCollection；如果默认没有创建，mongodb 会自动创建
        users = db.getCollection("users");
    }
    @After
    public void destory() {
        if (mg != null)
            mg.close();
        mg = null;
        db = null;
        users = null;
        System.gc();
    }
    public void print(Object o) {
        System.out.println(o);
    }
}
```
#### 3、添加操作
在添加操作之前，我们需要写个查询方法，来查询所有的数据。代码如下：
```java
/**
 * <b>function:</b> 查询所有数据
 * @createDate 2011-6-2 下午 03:22:40
 */
private void queryAll() {
    print("查询 users 的所有数据：");
    //db 游标
    DBCursor cur = users.find();
    while (cur.hasNext()) {
        print(cur.next());
    }
}
@Test
public void add() {
    //先查询所有数据
    queryAll();
    print("count: " + users.count());
    DBObject user = new BasicDBObject();
    user.put("name", "hoojo");
    user.put("age", 24);
    //users.save(user) 保存，getN() 获取影响行数
    //print(users.save(user).getN());
    //扩展字段，随意添加字段，不影响现有数据
    user.put("sex", "男");
    print(users.save(user).getN());
    //添加多条数据，传递 Array 对象
    print(users.insert(user, new BasicDBObject("name", "tom")).getN());
    //添加 List 集合
    List<DBObject> list = new ArrayList<DBObject>();
    list.add(user);
    DBObject user2 = new BasicDBObject("name", "lucy");
    user.put("age", 22);
    list.add(user2);
    //添加 List 集合
    print(users.insert(list).getN());
    //查询下数据，看看是否添加成功
    print("count: " + users.count());
    queryAll();
}
```
#### 4、删除数据
```java
@Test
public void remove() {
    queryAll();
    print("删除 id = 4de73f7acd812d61b4626a77：" + users.remove(new BasicDBObject("_id", new ObjectId("4de73f7acd812d61b4626a77"))).getN());
    print("remove age >= 24: " + users.remove(new BasicDBObject("age", new BasicDBObject("$gte", 24))).getN());
}
```
#### 5、修改数据
```java
@Test
public void modify() {
    print("修改：" + users.update(new BasicDBObject("_id", new ObjectId("4dde25d06be7c53ffbd70906")), new BasicDBObject("age", 99)).getN());
    print("修改：" + users.update(
            new BasicDBObject("_id", new ObjectId("4dde2b06feb038463ff09042")), 
            new BasicDBObject("age", 121),
            true,//如果数据库不存在，是否添加
            false//多条修改
            ).getN());
    print("修改：" + users.update(
            new BasicDBObject("name", "haha"), 
            new BasicDBObject("name", "dingding"),
            true,//如果数据库不存在，是否添加
            true//false只修改第一天，true如果有多条就不修改
            ).getN());
    //当数据库不存在就不修改、不添加数据，当多条数据就不修改
    //print("修改多条：" + coll.updateMulti(new BasicDBObject("_id", new ObjectId("4dde23616be7c19df07db42c")), new BasicDBObject("name", "199")));
}
``` 
#### 6、查询数据
```java
@Test
public void query() {
    //查询所有
    //queryAll();
    //查询 id = 4de73f7acd812d61b4626a77
    print("find id = 4de73f7acd812d61b4626a77: " + users.find(new BasicDBObject("_id", new ObjectId("4de73f7acd812d61b4626a77"))).toArray());
    //查询 age = 24
    print("find age = 24: " + users.find(new BasicDBObject("age", 24)).toArray());
    //查询 age >= 24
    print("find age >= 24: " + users.find(new BasicDBObject("age", new BasicDBObject("$gte", 24))).toArray());
    print("find age <= 24: " + users.find(new BasicDBObject("age", new BasicDBObject("$lte", 24))).toArray());
    print("查询 age!=25：" + users.find(new BasicDBObject("age", new BasicDBObject("$ne", 25))).toArray());
    print("查询 age in 25/26/27：" + users.find(new BasicDBObject("age", new BasicDBObject(QueryOperators.IN, new int[] { 25, 26, 27 }))).toArray());
    print("查询 age not in 25/26/27：" + users.find(new BasicDBObject("age", new BasicDBObject(QueryOperators.NIN, new int[] { 25, 26, 27 }))).toArray());
    print("查询 age exists 排序：" + users.find(new BasicDBObject("age", new BasicDBObject(QueryOperators.EXISTS, true))).toArray());
    print("只查询 age 属性：" + users.find(null, new BasicDBObject("age", true)).toArray());
    print("只查属性：" + users.find(null, new BasicDBObject("age", true), 0, 2).toArray());
    print("只查属性：" + users.find(null, new BasicDBObject("age", true), 0, 2, Bytes.QUERYOPTION_NOTIMEOUT).toArray());
    //只查询一条数据，多条去第一条
    print("findOne: " + users.findOne());
    print("findOne: " + users.findOne(new BasicDBObject("age", 26)));
    print("findOne: " + users.findOne(new BasicDBObject("age", 26), new BasicDBObject("name", true)));
    //查询修改、删除
    print("findAndRemove 查询 age=25 的数据，并且删除：" + users.findAndRemove(new BasicDBObject("age", 25)));
    //查询 age=26 的数据，并且修改 name 的值为 Abc
    print("findAndModify: " + users.findAndModify(new BasicDBObject("age", 26), new BasicDBObject("name", "Abc")));
    print("findAndModify: " + users.findAndModify(
        new BasicDBObject("age", 28), //查询 age=28 的数据
        new BasicDBObject("name", true), //查询 name 属性
        new BasicDBObject("age", true), //按照 age 排序
        false, //是否删除，true 表示删除
        new BasicDBObject("name", "Abc"), //修改的值，将 name 修改成 Abc
        true, 
        true));
    queryAll();
}
```
mongoDB 不支持联合查询、子查询，这需要我们自己在程序中完成。将查询的结果集在 Java 查询中进行需要的过滤即可。
#### 7、其他操作
```java
public void testOthers() {
    DBObject user = new BasicDBObject();
    user.put("name", "hoojo");
    user.put("age", 24);
    //JSON 对象转换        
    print("serialize: " + JSON.serialize(user));
    //反序列化
    print("parse: " + JSON.parse("{ \"name\" : \"hoojo\" , \"age\" : 24}"));
    print("判断 temp Collection 是否存在：" + db.collectionExists("temp"));
    //如果不存在就创建
    if (!db.collectionExists("temp")) {
        DBObject options = new BasicDBObject();
        options.put("size", 20);
        options.put("capped", 20);
        options.put("max", 20);
        print(db.createCollection("account", options));
    }
    //设置 db 为只读
    db.setReadOnly(true);
    //只读不能写入数据
    db.getCollection("test").save(user);
}
```
好了，这里基本上就介绍这么多 Java 操作 MongoDB 的方法。其他的东西还需要你自己多多研究。上面操作 MongoDB 的方法都是一些常用的方法，比较简单。
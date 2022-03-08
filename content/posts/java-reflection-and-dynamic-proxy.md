---
title: "Java反射与动态代理"
slug: "java-reflection-and-dynamic-proxy"
date: 2018-07-05T17:16:07+08:00
categories: [软件开发,Java]
tags: [软件开发,Java]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "基本用法Java反射API的第一个主要作用是获取程序在运行时刻的内部结构。这对于程序的检查工具和调试器来说，是非常实用的功能。只"

---
                
#### 基本用法
Java 反射API的第一个主要作用是获取程序在运行时刻的内部结构。这对于程序的检查工具和调试器来说，是非常实用的功能。只需要短短的十几行代码，就可以遍历出来一个Java类的内部结构，包括其中的构造方法、声明的域和定义的方法等。这不得不说是一个很强大的能力。只要有了`java.lang.Class`类 的对象，就可以通过其中的方法来获取到该类中的构造方法、域和方法。对应的方法分别是`getConstructor`、`getField`和`getMethod`。这三个方法还有相应的getDeclaredXXX版本，区别在于getDeclaredXXX版本的方法只会获取该类自身所声明的元素，而不会考虑继承下来的。Constructor、Field和Method这三个类分别表示类中的构造方法、域和方法。这些类中的方法可以获取到所对应结构的元数据。

反射API的另外一个作用是在运行时刻对一个Java对象进行操作。 这些操作包括动态创建一个Java类的对象，获取某个域的值以及调用某个方法。在Java源代码中编写的对类和对象的操作，都可以在运行时刻通过反射API来实现。考虑下面一个简单的Java类。
```java
class MyClass {
    public int count;
    public MyClass(int start) {
        count = start;
    }
    public void increase(int step) {
        count = count + step;
    }
} 
```
使用一般做法和反射API都非常简单。
```java
MyClass myClass = new MyClass(0); //一般做法
myClass.increase(2);
System.out.println("Normal -> " + myClass.count);
try {
    Constructor constructor = MyClass.class.getConstructor(int.class); //获取构造方法
    MyClass myClassReflect = constructor.newInstance(10); //创建对象
    Method method = MyClass.class.getMethod("increase", int.class);  //获取方法
    method.invoke(myClassReflect, 5); //调用方法
    Field field = MyClass.class.getField("count"); //获取域
    System.out.println("Reflect -> " + field.getInt(myClassReflect)); //获取域的值
} catch (Exception e) { 
    e.printStackTrace();
} 
```
由于数组的特殊性，Array类提供了一系列的静态方法用来创建数组和对数组中的元素进行访问和操作。
```java
Object array = Array.newInstance(String.class, 10); //等价于 new String[10]
Array.set(array, 0, "Hello");  //等价于array[0] = "Hello"
Array.set(array, 1, "World");  //等价于array[1] = "World"
System.out.println(Array.get(array, 0));  //等价于array[0]
```
使用Java反射API的时候可以绕过Java默认的访问控制检查，比如可以直接获取到对象的私有域的值或是调用私有方法。只需要在获取到Constructor、Field和Method类的对象之后，调用setAccessible方法并设为true即可。有了这种机制，就可以很方便的在运行时刻获取到程序的内部状态。

#### 处理泛型

Java 5中引入了泛型的概念之后，Java反射API也做了相应的修改，以提供对泛型的支持。由于类型擦除机制的存在，泛型类中的类型参数等信息，在运行时刻是不存在的。JVM看到的都是原始类型。对此，Java 5对Java类文件的格式做了修订，添加了Signature属性，用来包含不在JVM类型系统中的类型信息。比如以java.util.List接口为例，在其类文件中的Signature属性的声明是`<E:Ljava/lang/Object;>Ljava/lang/Object;Ljava/util/Collection<TE;>;;` ，这就说明List接口有一个类型参数E。在运行时刻，JVM会读取Signature属性的内容并提供给反射API来使用。

比如在代码中声明了一个域是List<String>类型的，虽然在运行时刻其类型会变成原始类型List，但是仍然可以通过反射来获取到所用的实际的类型参数。
```java
Field field = Pair.class.getDeclaredField("myList"); //myList的类型是List 
Type type = field.getGenericType(); 
if (type instanceof ParameterizedType) {     
    ParameterizedType paramType = (ParameterizedType) type;     
    Type[] actualTypes = paramType.getActualTypeArguments();     
    for (Type aType : actualTypes) {         
        if (aType instanceof Class) {         
            Class clz = (Class) aType;             
            System.out.println(clz.getName()); //输出java.lang.String         
        }     
    } 
}  
```
#### 动态代理

熟悉设计模式的人对于代理模式可 能都不陌生。 代理对象和被代理对象一般实现相同的接口，调用者与代理对象进行交互。代理的存在对于调用者来说是透明的，调用者看到的只是接口。代理对象则可以封装一些内部的处理逻辑，如访问控制、远程通信、日志、缓存等。比如一个对象访问代理就可以在普通的访问机制之上添加缓存的支持。这种模式在RMI和EJB中都得到了广泛的使用。传统的代理模式的实现，需要在源代码中添加一些附加的类。这些类一般是手写或是通过工具来自动生成。JDK 5引入的动态代理机制，允许开发人员在运行时刻动态的创建出代理类及其对象。在运行时刻，可以动态创建出一个实现了多个接口的代理类。每个代理类的对象都会关联一个表示内部处理逻辑的InvocationHandler接 口的实现。当使用者调用了代理对象所代理的接口中的方法的时候，这个调用的信息会被传递给InvocationHandler的invoke方法。在 invoke方法的参数中可以获取到代理对象、方法对应的Method对象和调用的实际参数。invoke方法的返回值被返回给使用者。这种做法实际上相 当于对方法调用进行了拦截。熟悉AOP的人对这种使用模式应该不陌生。但是这种方式不需要依赖AspectJ等AOP框架。

下面的代码用来代理一个实现了List接口的对象。所实现的功能也非常简单，那就是禁止使用List接口中的add方法。如果在getList中传入一个实现List接口的对象，那么返回的实际就是一个代理对象，尝试在该对象上调用add方法就会抛出来异常。
```java
public List getList(final List list) {
    return (List) Proxy.newProxyInstance(DummyProxy.class.getClassLoader(), new Class[] { List.class },
        new InvocationHandler() {
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if ("add".equals(method.getName())) {
                    throw new UnsupportedOperationException();
                }
                else {
                    return method.invoke(list, args);
                }
            }
        });
 } 
```
这里的实际流程是，当代理对象的add方法被调用的时候，InvocationHandler中的invoke方法会被调用。参数method就包含了调用的基本信息。因为方法名称是add，所以会抛出相关的异常。如果调用的是其它方法的话，则执行原来的逻辑。

#### 使用案例

Java 反射API的存在，为Java语言添加了一定程度上的动态性，可以实现某些动态语言中的功能。比如在JavaScript的代码中，可以通过 obj["set" + propName]()来根据变量propName的值找到对应的方法进行调用。虽然在Java源代码中不能这么写，但是通过反射API同样可以实现类似 的功能。这对于处理某些遗留代码来说是有帮助的。比如所需要使用的类有多个版本，每个版本所提供的方法名称和参数不尽相同。而调用代码又必须与这些不同的版本都能协同工作，就可以通过反射API来依次检查实际的类中是否包含某个方法来选择性的调用。

Java 反射API实际上定义了一种相对于编译时刻而言更加松散的契约。如果被调用的Java对象中并不包含某个方法，而在调用者代码中进行引用的话，在编译时刻就会出现错误。而反射API则可以把这样的检查推迟到运行时刻来完成。通过把Java中的字节代码增强、类加载器和反射API结合起来，可以处理一些对灵 活性要求很高的场景。

在 有些情况下，可能会需要从远端加载一个Java类来执行。比如一个客户端Java程序可以通过网络从服务器端下载Java类来执行，从而可以实现自动更新 的机制。当代码逻辑需要更新的时候，只需要部署一个新的Java类到服务器端即可。一般的做法是通过自定义类加载器下载了类字节代码之后，定义出 Class类的对象，再通过newInstance方法就可以创建出实例了。不过这种做法要求客户端和服务器端都具有某个接口的定义，从服务器端下载的是 这个接口的实现。这样的话才能在客户端进行所需的类型转换，并通过接口来使用这个对象实例。如果希望客户端和服务器端采用更加松散的契约的话，使用反射API就可以了。两者之间的契约只需要在方法的名称和参数这个级别就足够了。服务器端Java类并不需要实现特定的接口，可以是一般的Java类。

动态代理的使用场景就更加广泛了。需要使用AOP中的方法拦截功能的地方都可以用到动态代理。Spring框架的AOP实现默认也使用动态代理。不过JDK中的动态代理只支持对接口的代理，不能对一个普通的Java类提供代理。不过这种实现在大部分的时候已经够用了。
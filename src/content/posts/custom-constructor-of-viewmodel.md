---
title: "ViewModel之自定义构造函数"
slug: "custom-constructor-of-viewmodel"
published: 2020-11-30T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
刚入坑架构组件没多久，发现很多基础性的东西理解起来是没什么问题的，但是一到具体使用就各种问题，相关实践文章也比较少，更多的只能靠自己解决 = =。今天无意间了解了 `AndroidViewModel` 的一个使用场景和实现原理，特地记录下来。
###前言
一开始，跟着官方文档，ViewModel 我们是这样实现的：
```java
public class MyViewModel entends ViewModel {
   //...
}
```
然后是创建实例对象:
```java
MyViewModel viewModel = ViewModelProviders.of(this).get(MyViewModel.class);
```
可以注意到，我们定义的 ViewModel 是没有构造函数的，也就是说如果遇到比较复杂情况下（需要在创建 ViewModel 时赋一些初始值），应该怎么办呢？总不能自己加一个构造函数，然后 new 出来吧，或者通过 set 方法一个一个加也行，但是这样就有点 low 了。于是，我发现了一个类 AndroidViewModel
### AndroidViewModel
AndroidViewModel 这个类的定义很简单，它继承自 ViewModel，然后添加了一个 application 私有属性：
```java
public class AndroidViewModel extends ViewModel {
    @SuppressLint("StaticFieldLeak")
    private Application mApplication;
    public AndroidViewModel(@NonNull Application application) {
        mApplication = application;
    }
    /**
     * Return the application.
     */
    @SuppressWarnings("TypeParameterUnusedInFormals")
    @NonNull
    public <T extends Application> T getApplication() {
        //noinspection unchecked
        return (T) mApplication;
    }
}
```
上面提到，很多时候我们需要在初始化 ViewModel 时需要传递一些参数，例如 Activity 中的一些参数等，但是根据 ViewModel 的生命周期我们知道，ViewModel 中是不能传入 Activity 等实例对象的，因为在 ViewModel 存活的过程中，Activity 是有可能会被销毁的。因此，Google 爸爸推荐我们传入 application。
下面是 AndroidViewModel 的一个使用示例，其实我们只需要将 ViewModel 改为继承 AndroidViewModel 就可以了：
```java
public class MyViewModel extends AndroidViewModel {
    public MyViewModel(@NonNull Application application) {
        super(application);
    }
    //...
}
```
使用的话还是一样的：
```java
MyViewModel viewModel = ViewModelProviders.of(this).get(MyViewModel.class);
```
### AndroidViewModel 实现原理
到了这里，疑问就来了，我创建实例的时候并依然没有传递任何参数，那么那个 application 是怎么来的呢，下面我们来看下源码中是怎么实现的：
```java
//ViewModelProviders.java
@NonNull
@MainThread
public static ViewModelProvider of(@NonNull FragmentActivity activity) {
     return of(activity, null);
 }
@NonNull
@MainThread
public static ViewModelProvider of(@NonNull FragmentActivity activity,
                                   @Nullable Factory factory) {
    Application application = checkApplication(activity);
    if (factory == null) {
        factory = ViewModelProvider.AndroidViewModelFactory.getInstance(application);
    }
    return new ViewModelProvider(activity.getViewModelStore(), factory);
}
```
ViewModelProviders 中有很多 of 的重载方法，这里暂时只需要关注上面这两个即可，可以看到，application 是从我们传入的 activity 中获取到的，并且此时还创建了一个 factory 实例对象（划重点，后面会用到）。默认情况下（传递的 factory 为 null），那么会自动创建一个 `AndroidViewModelFactory` ,AndroidViewModelFactory 是 ViewModelProvider 中的一个静态内部类。
接着我们来看 get 方法：
```java
//ViewModelProvider.java
@NonNull
@MainThread
public <T extends ViewModel> T get(@NonNull Class<T> modelClass) {
    String canonicalName = modelClass.getCanonicalName();
    if (canonicalName == null) {
        throw new IllegalArgumentException("Local and anonymous classes can not be ViewModels");
    }
    return get(DEFAULT_KEY + ":" + canonicalName, modelClass);
}
@NonNull
@MainThread
public <T extends ViewModel> T get(@NonNull String key, @NonNull Class<T> modelClass) {
    ViewModel viewModel = mViewModelStore.get(key);
    if (modelClass.isInstance(viewModel)) {
        //noinspection unchecked
        return (T) viewModel;
    } else {
        //noinspection StatementWithEmptyBody
        if (viewModel != null) {
            // TODO: log a warning.
        }
    }
    if (mFactory instanceof KeyedFactory) {
        viewModel = ((KeyedFactory) (mFactory)).create(key, modelClass);
    } else {
        viewModel = (mFactory).create(modelClass);
    }
    mViewModelStore.put(key, viewModel);
    //noinspection unchecked
    return (T) viewModel;
}
```
可以看到，最终生成的 ViewModel 是通过 (mFactory).create 方法生成的，这个 factory 就是上面所提到的，然后在去看他的 create 方法实现：
```java
//ViewModelProvider.java
public static class AndroidViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private static AndroidViewModelFactory sInstance;
    /**
     * Retrieve a singleton instance of AndroidViewModelFactory.
     *
     * @param application an application to pass in {@link AndroidViewModel}
     * @return A valid {@link AndroidViewModelFactory}
     */
    @NonNull
    public static AndroidViewModelFactory getInstance(@NonNull Application application) {
        if (sInstance == null) {
            sInstance = new AndroidViewModelFactory(application);
        }
        return sInstance;
    }
    private Application mApplication;
    /**
     * Creates a {@code AndroidViewModelFactory}
     *
     * @param application an application to pass in {@link AndroidViewModel}
     */
    public AndroidViewModelFactory(@NonNull Application application) {
        mApplication = application;
    }
    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (AndroidViewModel.class.isAssignableFrom(modelClass)) {
            //noinspection TryWithIdenticalCatches
            try {
                return modelClass.getConstructor(Application.class).newInstance(mApplication);
            } catch (NoSuchMethodException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            } catch (InstantiationException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            } catch (InvocationTargetException e) {
                throw new RuntimeException("Cannot create an instance of " + modelClass, e);
            }
        }
        return super.create(modelClass);
    }
}
```
转到 AndroidViewModelFactory 的实现，可以看到默认生成的 factory 的 create 方法中使用反射调用了 ViewModel 的构造函数，至此，整个过程就还原了。
### 自定义 ViewModel 构造函数
了解了 AndroidViewModel 的整个实现流程后，自定义流程就好办了，思路是一致的，需要借助一个 Factory 来实现：
```java
public class MyViewModel2 extends ViewModel {
    private String name;
    public MyViewModel2(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    //...
}
```
```java
public class MyViewModelFactory implements ViewModelProvider.Factory {
    private String name;
    public MyViewModelFactory(String name){
        this.name = name;
    }
    @SuppressWarnings("unchecked")
    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(MyViewModel2.class)) {
            return (T) new MyViewModel2(name);
        }
        throw new RuntimeException("unknown class :" + modelClass.getName());
    }
}
```
```java
MyViewModel2 myViewModel2 = ViewModelProviders.of(this, new MyViewModelFactory("lengyue")).get(MyViewModel2.class);
Log.d("TAG", "onCreate: name = "+myViewModel2.getName());
```
大功告成。
虽然这里只是一个简单的例子，但是既然思路已经出来了，剩下的就是八仙过海各显神通了。
还在踩坑阶段，如有什么解释不当的地方欢迎指正。(▽)

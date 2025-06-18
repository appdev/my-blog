---
title: "Android声明式UI框架 Litho 初探 ——两种数据类型 "
slug: "two-types-of-data-contained-in-litho"
published: 2020-09-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
## Litho 中包含的的两种数据类型   
Litho 的两种属性分别是：  
- 不可变属性称为 Props
- 可变属性称为 State
### 不可变属性 Props
#### 定义和使用 props
Props 属性：`Component`中使用 `@Prop` 注解的参数集合，具有单向性和不可变性，可以在左右的方法中访问它的指。在同一个 Component 中我们可以定义和访问相同的 prop
下面这个例子，定义了两个 Prop，一个 string 类型 text，一个 int 类型 index，text 的注解中`optional = true`表示它是一个可选参数。
当 `Component` 的生命周期方法被调用的时候，@Prop 参数会保存 component 创建时从它们的父级传递过来的值 (或者它们的默认值)
#### 设置 props
prop 参数其实在前几篇文章中都有使用过，用起来也没有什么特别的地方，这里不在赘述，制作一个简单的说明。
`Component` 中的 prop 参数会在编译时候自动加入到 Builder 中，以上面的代码举例:
```java
 PropComponent.create(c).index(10)./*text("测试文本").*/build()
```
#### Prop 的默认值
对于可选的 Prop 如果不设置值，就是 java 的默认值。或者你也可以使用 `@PropDefault` 注解然后添加默认值。
如果你使用 Kotlin，那还需要加上 `@JvmFiel` 把该字段编辑为 public 才行。
```java
 @MountSpec
object PropComponentSpec {
    @JvmField
    @PropDefault
    val prop1 = "default"
    @JvmField
    @PropDefault
    val prop2 = -1
```
#### 资源类型
在 Android 开发中，我们经常会限定参数的类型。比如：
```java
fun doSomething(@ColorInt color: Int, @StringRes str: Int, @DimenRes width: Int){}
```
在 `Compontent` 的 Prop 中也有类似的操作，具体看代码：
```java
fun onMount(
        c: ComponentContext, textView: TextView,
        @Prop(optional = true,resType = ResType.STRING) text: String?,
        @Prop index: Int
    ) {}
```
**需要注意的是，`Conpontent` 中修改一个 Prop 后，其他使用想用 Prop 的地方也需要修改**
当你按照上面的方法修改并且 build 后，会自动生成 Res,Attr,Dip,Px 方法。
![https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268523973962129116.png](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268523973962129116.png)  
你可以像下面这样使用:
```java
PropComponent.create(c).index(14).textRes(R.string.app_name).build()
```
 ResType 中包含以下这些类型:
![https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268527911047998217.png](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268527911047998217.png)
### 可变属性 State
#### 定义和使用 State
State 一般用在与用户交互的场景中，比如：点击、输入框、Checkbox。但是这些都是由当前 `Compontent`内部感知，并更新 State，他的父级并需要关心他的状态。正因为 State 是`Compontent`，所以当`Compontent` 创建后，如果我们需要修改 State，只能通过单独定义一个 Prop 属性来修改 State 的初始值
State 的声明和 Prop 区别不是很大：
```java
@LayoutSpec
object StateComponentSpec {
     /**
     * 定义一个 State 参数 isCheck
     */
    @OnCreateLayout
    fun onCreateLayout(c: ComponentContext, @State isCheck: Boolean): Component {
        return Column.create(c).child(
            Image.create(c).drawableRes(
                if (isCheck) android.R.drawable.checkbox_on_background
                else android.R.drawable.checkbox_off_background
            ).build()
        ).child(
            Text.create(c).text(if (isCheck) "Checked" else "Uncheck").textColor(Color.BLACK)
                .textSizeDip(16f).marginDip(YogaEdge.TOP, 10f).build()
        ).clickHandler(StateComponent.onClick(c)).build()
    }
      @OnUpdateState
    fun updateCheckedState(isCheck: StateValue<Boolean>) {
    }
}
```
#### State 初始化
State 需要在 `@OnCreateInitialState` 注解的方法中初始化： 
`OnCreateInitialState` 方法需要注意：  
1. 第一个参数必须是 `ComponentContext`(大部分的 Componetn 方法都要求第一个参数必须是`ComponentContext`)
1. State 相关的参数的名称必须和其他生命周期方法中的@State 参数保持一致，并且这些参数的类型必须是 `StateValue`,其中泛型的类型与对应的@State 一致
1. 如果没有定义 `@OnCreateInitialState`，State 的值就是 java 默认值
1. 只有在 `Component`第一次被添加到 Component 树的时候才会调用一次`@OnCreateInitialState` 方法。如果 Component 的 key 没有改变，后续对 Component 树布局的重新计算并不会重新调用@OnCreateInitialState 方法
1. 不需要自己调用 `@OnCreateInitialState` 方法.
```java
@OnCreateInitialState
    fun updateCheckState(
        c: ComponentContext, isCheck: StateValue<Boolean>,
        @Prop initChecked: Boolean
    ) {
        isCheck.set(initChecked)
    }
```
#### 更新 State
State 需要在 `@OnUpdateState` 注解的方法中更新：  
`OnUpdateState` 方法需要注意：  
1. 可以定义多个 `OnUpdateState` 方法来更新不同的 State，但是 `OnUpdateState`方法每次调用都会对它所在的`Component` 重新计算一次。所以为了更好的性能，应该尽可能少的调用`OnUpdateState`，或者合并多个 State 的更新，来提升性能
1. 和初始化时候一个样。State 相关的参数的名称必须和其他生命周期方法中的@State 参数保持一致，并且这些参数的类型必须是 `StateValue`,其中泛型的类型与对应的@State 一致
1. 如果你的 State 的值需要依赖于 Prop，你可以在 `@OnupdateState`函数的参数中使用`@Param` 声明，这样就可以在更新被触发的时候传递 prop 的值进来了.
跟我们的 Check 增加一个更新方法:
```java
  @OnUpdateState
    fun updateCheckedState(isCheck: StateValue<Boolean>) {
        val check = isCheck.get()
        isCheck.set(check?.let { !check })
    }
```
合并多个 State 更新，并且使用 Param 来更新 State：
```java
 /**
     * 多个 State 合并更新，同时 使用 Param 来更新 State
     */
    @OnUpdateState
    fun updateCheckedStateTwo(isCheck: StateValue<Boolean>,isCheckTwo: StateValue<Boolean>,
    @Param checked:Boolean) {
        isCheck.set(!checked)
        isCheck.set(isCheckTwo.get())
    }
```
#### 调用 State 更新
对于使用 `@OnUpdateState` 注解的方法，编译后自动生成两个更新方法:
* 一个 `@OnUpdateState` 同名的方法，它会同步的调用 state 的更新。
* 一个加上 Async 后缀的静态方法，它会异步的调用 state 的更新。
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268531922924476504.png)
(图中的 `updateCheckedState`,`updateCheckedStateSync` 最终调用的都是同一个方法，所以这里说生成了两个方法)
让我们的点击事件调用更新方法:
```java
@OnEvent(ClickEvent::class)
    fun onClick(c: ComponentContext, @State isCheck: Boolean) {
        StateComponent.updateCheckedStateAsync(c)
    }
```
关于调用更新方法有一下几点需要注意:
1. LayoutSpec 中避免在 `onCreateLayout` 中直接调用更新方法，因为更新会触发布局重新计算，而重新计算又会触发`onCreateLayout`，很容易造成死循环
1. MountSpec 中，不要在 `onMount`、`onBind` 方法中直接调用更新方法，如果你真的需要在这类方法中更新 State 的值，那么应该使用下面会讲到的懒汉式 State 更新来替代.
1. 当调用一个 State 更新方法的时候 (`StateComponent.updateCheckedStateAsync(c)`)，参数中的 `ComponentContext` 必须是当前需要更新传递过来的`ComponentContext`，因为它包含了现有的 State 等其他重要的信息，在重新计算的时候回替换原有的 Component，生成新的 Component.
#### 懒汉式更新 State
懒汉式更新可以更新 State 的值，但是又不会立刻触发 `Component` 的布局计算，当调用懒汉式更新后，Component 将会保持现有的 State 值，在下次被别的机制 (例如收到一个新的 prop 或者或者 State 的定期更新) 触发是，才会更新 State 的值，在不需要立刻进行布局计算的情况下，懒汉式更新对想要更新内部 Component 信息并且在 Component 树的重新布局中保持这些信息是非常实用的.
要是用懒汉式更新，需要在 @State 注解中设置 canUploadLazily = true
```java
/**
 * 懒更新 State
 */
@LayoutSpec
object LazilyUpdateComponentSpec {
    @OnCreateLayout
    fun onCreateLayout(
        c: ComponentContext,
        @State(canUpdateLazily = true) name: String
    ): Component {
        // 在这里直接调用 更新 State 方法
        LazilyUpdateComponent.lazyUpdateName(c,"UpdateName")
        return Column.create(c)
            .child(
                Text.create(c).text(name)
            ).build()
    }
    @OnCreateInitialState
    fun stateInit(c: ComponentContext, name: StateValue<String>, @Prop initName: String) {
        name.set(initName)
    }
}
```
调用：
```java
 val component = LazilyUpdateComponent.create(c).initName("initName").build()
```
根据代码，我们在 `onCreateLayout` 方法中调用了更新 State 的方法，但是由于是懒更新，所以并不是对布局进行重新计算，所以界面上显示的还是初始化的值。
![](https://raw.githubusercontent.com/appdev/gallery/main/img/83c9f70110b64a72b08b425aa812effc~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)
对上面的代码修改一下，增加一个点击事件，点击后更新另一个 State 的值:
```java
/**
 * 懒汉式更新 State
 */
@LayoutSpec
object LazilyUpdateComponentSpec {
    private const val TAG = "LazilyUpdateComponentSp"
    @OnCreateLayout
    fun onCreateLayout(
        c: ComponentContext,
        @State(canUpdateLazily = true) name: String,
        @State testData: String?
    ): Component {
        // 在这里直接调用 更新 State 方法
        LazilyUpdateComponent.lazyUpdateName(c, "UpdateName")
        Log.i(TAG, "onCreateLayout: $name")
        Log.i(TAG, "onCreateLayout: ${testData ?: ""}")
        return Column.create(c).clickHandler(LazilyUpdateComponent.onClick(c))
            .child(
                Text.create(c).text(name)
            ).build()
    }
    @OnCreateInitialState
    fun stateInit(c: ComponentContext, name: StateValue<String>, @Prop initName: String) {
        name.set(initName)
    }
    @OnEvent(ClickEvent::class)
    fun onClick(c: ComponentContext) {
        LazilyUpdateComponent.updateTestDataAsync(c)
    }
    @OnUpdateState
    fun updateTestData(testData: StateValue<String>) {
        testData.set("TestData")
    }
}
```
logcat:
```java
点击前:
LazilyUpdateComponentSp: onCreateLayout: initName
LazilyUpdateComponentSp: onCreateLayout: 
···
点击后:
LazilyUpdateComponentSp: onCreateLayout: UpdateName
LazilyUpdateComponentSp: onCreateLayout: TestData
```
同时 UI 上也被更新:
![](https://raw.githubusercontent.com/appdev/gallery/refs/heads/main/img/blog/blog/16467268535123514261726.png)
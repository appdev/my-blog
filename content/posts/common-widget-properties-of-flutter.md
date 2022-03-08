---
title: "Flutter 常用 Widget 属性"
slug: "common-widget-properties-of-flutter"
date: 2018-12-13T17:16:07+08:00
categories: [Android,Flutter]
tags: [Android,Flutter]
showToc: true
TocOpen: true
draft: false
description: "TextStyleconstTextStyle({this.inherit:true,//为f"

---
                
#### TextStyle
```Java
const TextStyle({
    this.inherit: true,         // 为false的时候不显示
    this.color,                    // 颜色 
    this.fontSize,               // 字号
    this.fontWeight,           // 字重，加粗也用这个字段  FontWeight.w700
    this.fontStyle,                // FontStyle.normal  FontStyle.italic斜体
    this.letterSpacing,        // 字符间距  就是单个字母或者汉字之间的间隔，可以是负数
    this.wordSpacing,        // 字间距 句字之间的间距
    this.textBaseline,        // 基线，两个值，字面意思是一个用来排字母的，一人用来排表意字的（类似中文）
    this.height,                // 当用来Text控件上时，行高（会乘以fontSize,所以不以设置过大）
    this.decoration,        // 添加上划线，下划线，删除线 
    this.decorationColor,    // 划线的颜色
    this.decorationStyle,    // 这个style可能控制画实线，虚线，两条线，点, 波浪线等
    this.debugLabel,
    String fontFamily,    // 字体
    String package,
  }) : fontFamily = package == null ? fontFamily : 'packages/$package/$fontFamily',
       assert(inherit != null);
```

#### Tooltip
当用户长按被Tooltip包裹的Widget时，会自动弹出相应的操作提示
```java
Tooltip({
    Key key,
    @required this.message,//提示的内容
    this.height = 32.0,//Tooltip的高度
    this.padding = const EdgeInsets.symmetric(horizontal: 16.0),//padding
    this.verticalOffset = 24.0,//具体内部child Widget竖直方向的距离
    this.preferBelow = true,//是否显示在下面
    this.excludeFromSemantics = false,
    this.child,
  })
```
tip的宽度不会改变，如果想要修改tip的同时宽度和高度，使用padding是一个不错的选择
`padding: EdgeInsets.symmetric(vertical: 50.0, horizontal: 50.0)`
#### Snackbar
底部快捷提示和Android中的可以说是相似度很高的，用法也很简单。
```java
const SnackBar({
    Key key,
    @required this.content,//内容
    this.backgroundColor,//背景
    this.action,//其他操作
    this.duration: _kSnackBarDisplayDuration,//显示时长
    this.animation,//进出动画
  })
```
够造方法很简单，只不过action参数需要说明下，action就是可以在SnackBar的右侧显示的Widget(按钮、文字等)，点击这个Widget可以触发相应的操作，如常见的 撤回 操作。

虽然构造方法很简单，但是我们并不能直接显示SnackBar，我们可以借助于

`Scaffold.of(context).showSnackBar（）`来显示一个SnackBar，值得注意的是这个context必须不能是Scaffold节点下的context,因为Scaffold.of（）方法需要从Widget树中去找到Scaffold的Context，所以如果直接在Scaffold中使用showSnackBar，需要在外城包括上Builder Widget，这个Builder不做任何的其他操作，只不过把Widget树往下移了一层而已。

```java
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        appBar: new AppBar(
          title: new Text("SnackBar"),
        ),
        body: new Center(
          child: new Builder(builder: (BuildContext context) {
            return new RaisedButton(
              onPressed: () {
                Scaffold.of(context).showSnackBar(new SnackBar(
                      content: new Text("Snackbar"),
                      action: new SnackBarAction(
                        label: "撤回",
                        onPressed: () {},
                      ),
                    ));
              },
              child: new Text("点我啊"),
              color: Colors.blue,
              highlightColor: Colors.lightBlueAccent,
              disabledColor: Colors.lightBlueAccent,
            );
          }),
        ));
  }
}
```
#### Dialog
##### SimpleDialog
```java
const SimpleDialog({
    Key key,
    this.title,//标题
    this.titlePadding,标题padding
    this.children,//内容
    this.contentPadding,内容padding
  })
```
##### AlertDialog
AlertDialog其实就是simpleDialog的封装，更加方便开发者使用，只不过在simpeDialog的基础上新增了action操作而已
```java
  showDialog(
    context: context,
    builder: (BuildContext context) => AlertDialog(
          title: Text("AlertDialog"),
          content: Text("我是AlertDialog"),
          actions: <Widget>[
            FlatButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text('确定')),
            FlatButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text('取消'))
          ],
        ),
  );
```
##### AboutDialog
AboutDialog也是在SimpleDialog基础上的封装，可以很方便的显示关于应用的Dialog。
##### BottomSheet
要显示BottomSheet我们可以调用，showBottomSheet（）或者showModalBottomSheet（）方法。这两种方法都可以显示BottomSheet，只不过第一个是从新打开了一个界面来显示，第二个方法是直接在当前界面的下面来显示。

#### Chip
中文翻译为碎片的意思，一般也是用作商品或者一些东西的标签。
```java
Chip({
    Key key,
    this.avatar,//标签左侧Widget，一般为小图标
    @required this.label,//标签
    this.labelStyle,
    this.labelPadding,//padding
    this.deleteIcon//删除图标,
    this.onDeleted//删除回调，为空时不显示删除图标,
    this.deleteIconColor//删除图标的颜色,
    this.deleteButtonTooltipMessage//删除按钮的tip文字,
    this.shape//形状,
    this.clipBehavior = Clip.none,
    this.backgroundColor//背景颜色,
    this.padding,
    this.materialTapTargetSize//删除图标material点击区域大小,
  })
```
#### ExpansionTile
是一个有标题可以展开的控件而已，其他就跟其他的layout没有很大的差别
```java
ExpansionTile({
    Key key,
    this.leading,//和ListTitle类似，在文字前面的Widget
    @required this.title,//和ListTitle类似，文字
    this.backgroundColor,//背景
    this.onExpansionChanged,//展开或者关闭的监听
    this.children = const <Widget>[],//内部孩子
    this.trailing,//和ListTitle类似，右侧图标
    this.initiallyExpanded = false,//默认是否展开
  })
```
#### ExpansionPanelList
构造方法很简单，接收ExpansionPanel类型的List集合，展开关闭的回调和展开时间三
个参数。
ExpansionPanelList的构造方法：
```java
ExpansionPanelList({
    Key key,
    this.children = const <ExpansionPanel>[],
    this.expansionCallback,//展开关闭回调
    this.animationDuration = kThemeAnimationDuration,//展开进行时间
  })
```
ExpansionPanel的构造方法：
```java
ExpansionPanel({
    @required this.headerBuilder,//标题构造器
    @required this.body,//内容区域
    this.isExpanded = false//是否展开
  })
```
需要注意的是ExpansionPanel不是一个Widget它是一个单独类，只能配合ExpansionPanelList使用
- 使用ExpansionPanelList可以实现带动画的展开布局效果
- ExpansionPanelList中的ExpansionPanel是需要受ExpansionPanelList的点击事件处理的
- 使用ExpansionPanelList.radio（）限制每次只能有一个打开的Item

#### SliverAppBar
```java
SliverAppBar({
    Key key,
    this.leading,//前导标题
    this.automaticallyImplyLeading: true,
    this.title,//标题
    this.actions,//菜单
    this.flexibleSpace,//可以展开区域，通常是一个FlexibleSpaceBar
    this.bottom,//底部内容区域
    this.elevation,//阴影
    this.forceElevated: false,
    this.backgroundColor,背景颜色
    this.brightness,//主题明亮
    this.iconTheme,图标主题
    this.textTheme,//文字主题
    this.primary: true,//是否预留高度
    this.centerTitle,标题是否居中
    this.titleSpacing: NavigationToolbar.kMiddleSpacing,
    this.expandedHeight,//展开高度
    this.floating: false,//是否随着滑动隐藏标题
    this.pinned: false,//是否固定在顶部
    this.snap: false,//与floating结合使用
 })
```
#### Wrap

Wrap的中文意思就是包裹的意思，使用它能很方便的完成流式布局效果
```java
Wrap({
   Key key,
   this.direction = Axis.horizontal,//方向
   this.alignment = WrapAlignment.start,//内容排序方式
   this.spacing = 0.0,//两个widget之间横向的间隔
   this.runAlignment = WrapAlignment.start,
   this.runSpacing = 0.0,两个widget之间纵向的间隔，当为纵向时则为横向间隔
   this.crossAxisAlignment = WrapCrossAlignment.start,
   this.textDirection,//文字排序方向
   this.verticalDirection = VerticalDirection.down,//direction为Vertical时排序顺序
   List<Widget> children = const <Widget>[],//widgets
 })
```
#### ListView
```java
ListView({
    Key key,
    Axis scrollDirection: Axis.vertical,//滚动方向
    bool reverse: false,//十分反向显示数据
    ScrollController controller,
    bool primary,
    ScrollPhysics physics,//物理滚动
    bool shrinkWrap: false,
    EdgeInsetsGeometry padding,
    this.itemExtent,//item有效范围
    bool addAutomaticKeepAlives: true,//自动保存视图缓存
    bool addRepaintBoundaries: true,//添加重绘边界
    List<Widget> children: const <Widget>[],
  })
```

`ListView.builder（）`和`ListView.custom（）`的用法基本相同，只不过custom可以根据自己的需要控制Item显示方式，如Item显示大小。
```java
ListView.builder({
    Key key,
    Axis scrollDirection: Axis.vertical,
    bool reverse: false,
    ScrollController controller,
    bool primary,
    ScrollPhysics physics,
    bool shrinkWrap: false,
    EdgeInsetsGeometry padding,
    this.itemExtent,
    @required IndexedWidgetBuilder itemBuilder,//item构建者
    int itemCount,//item数量
    bool addAutomaticKeepAlives: true,
    bool addRepaintBoundaries: true,
  })
```
#### GridView
```java
GridView({
    Key key,
    Axis scrollDirection: Axis.vertical,
    bool reverse: false,
    ScrollController controller,
    bool primary,
    ScrollPhysics physics,
    bool shrinkWrap: false,
    EdgeInsetsGeometry padding,
    @required this.gridDelegate,//没错，它就是控制GridView的
    bool addAutomaticKeepAlives: true,
    bool addRepaintBoundaries: true,
    List<Widget> children: const <Widget>[],
  })
```
gridDelegate参数

可以传入`SliverGridDelegateWithFixedCrossAxisCount`对象和`SliverGridDelegateWithMaxCrossAxisExtent`对象。

其中`SliverGridDelegateWithFixedCrossAxisCount`可以直接指定每行（列）显示多少个Item，`SliverGridDelegateWithMaxCrossAxisExtent`会根据GridView的宽度和你设置的每个的宽度来自动计算没行显示多少个Item

#### Scaffold
Scaffold的中文意思是脚手架，顾名思义就是帮助我们快速构建APP
```java
const Scaffold({
    Key key,
    this.appBar,//标题栏
    this.body,//内容
    this.floatingActionButton,//悬浮按钮
    this.persistentFooterButtons,底部持久化现实按钮
    this.drawer,//侧滑菜单左
    this.endDrawer,//侧滑菜单右
    this.bottomNavigationBar,//底部导航
    this.backgroundColor,//背景颜色
    this.resizeToAvoidBottomPadding: true,//自动适应底部padding
    this.primary: true,试用使用primary主色
  })
```
#### AppBar
appBar指的就是页面最上面用来显示页面状态或者信息的导航条
```java
AppBar({
    Key key,
    this.leading,主导Widget
    this.automaticallyImplyLeading: true,
    this.title,
    this.actions,其他附加最贱右上角
    this.flexibleSpace,//伸缩空间，显示在title上面
    this.bottom,//显示在title下面
    this.elevation: 4.0,//阴影高度
    this.backgroundColor,
    this.brightness,明暗模式
    this.iconTheme,
    this.textTheme,
    this.primary: true,是否是用primary
    this.centerTitle,//标题是否居中
    this.titleSpacing: NavigationToolbar.kMiddleSpacing,//title与leading的间隔
    this.toolbarOpacity: 1.0,//title级文字透明度
    this.bottomOpacity: 1.0,//底部文字透明度
  })
```
#### FloatingActionButton
这个组件可以说是跟Android上面的一模一样，连名字都是一样的
```java
const FloatingActionButton({
    Key key,
    this.child,
    this.tooltip,//提示，长按按钮提示文字
    this.backgroundColor,//背景颜色
    this.heroTag: const _DefaultHeroTag(),//页面切换动画Tag
    this.elevation: 6.0,//阴影
    this.highlightElevation: 12.0,//高亮阴影
    @required this.onPressed,//点击事件
    this.mini: false//是否使用小图标
  })
```

#### Drawer
Flutter中的菜单组件
```java
const Drawer({
    Key key,
    this.elevation: 16.0,//设置阴影宽度
    this.child,//菜单区域
  })
```
#### BottomNavigationBar
 bottomNavigationBar底部导航按钮
```java
BottomNavigationBar({
    Key key,
    @required this.items,//List<BottomNavigationBarItem>
    this.onTap,//tap事件
    this.currentIndex: 0,//当前位置
    BottomNavigationBarType type,//底部item类型，fixed自适应，shifting选择放大
    this.fixedColor,选中颜色
    this.iconSize: 24.0,//图标大小
  })
```
#### Table
类似表格布局的组
```java
Table({
    Key key,
    this.children: const <TableRow>[],
    this.columnWidths,//列宽
    this.defaultColumnWidth: const FlexColumnWidth(1.0),
    this.textDirection,//文字方向
    this.border,//边框
    this.defaultVerticalAlignment: TableCellVerticalAlignment.top,//对齐方式
    this.textBaseline//基线
  })
```
#### IndexedStack
IndexedStack的用法和Stack一样，只不过IndexedStack只显示指定位置的Widget,其他的位置的Widget不会显示。
```java
new IndexedStack(
       index: 1,
       children: <Widget>[
         new Icon(
           Icons.check_circle,
           size: 100.0,
           color: Colors.green,
         ),
         new Icon(
           Icons.error_outline,
           size: 100.0,
           color: Colors.red,
         )
       ],
       alignment: Alignment.bottomRight,
     )
```
#### Container
alignment: 内部Widget对齐方式，左上对齐topLeft、垂直顶部对齐，水平居中对齐topCenter、右上topRight、垂直居中水平左对齐centerLeft、居中对齐center、垂直居中水平又对齐centerRight、底部左对齐bottomLeft、底部居中对齐bottomCenter、底部右对齐bottomRight

padding： 内间距，子Widget距Container的距离。

color： 背景颜色

decoration： 背景装饰

foregroundDecoration： 前景装饰

width：容器的宽

height：容器的高

constraints：容器宽高的约束，容器最终的宽高最终都要受到约束中定义的宽高影响

margin：容器外部的间隔

transform： Matrix4变换

child：内部子Widget
```java
Container({
   	Key key,
   	this.alignment,//内部widget对齐方式
    this.padding,//内边距
   	Color color,//背景颜色，与decoration只能存在一个
    Decoration decoration,//背景装饰，与decoration只能存在一个
    this.foregroundDecoration//前景装饰,
    double width,//容器的宽
   	double height,//容器的高
   	BoxConstraints constraints//,
   	this.margin,
   	this.transform,
   	this.child,
})
```
#### Icon
```java
const Icon(this.icon//IconDate, {
   Key key,
   this.size,//大小
   this.color,//颜色
   this.semanticLabel,//标志位
   this.textDirection,//绘制方向，一般使用不到
 }) 
```
#### IconData
```java
const IconData(
  this.codePoint,//必填参数，fonticon对应的16进制Unicode {
  this.fontFamily,//字体库系列
  this.fontPackage,//字体在那个包中，不填仅在自己程序包中查找
  this.matchTextDirection: false,图标是否按照图标绘制方向显示
});
```
#### Text
```java
const Text(this.data//内容, {
Key key,
this.style//样式
this.textAlign//对齐方式,
this.textDirection//文本方向,
this.softWrap//是否换行显示,
this.overflow//超出文本的处理方式,
this.textScaleFactor//每个逻辑像素的字体像素数，控制字体大小,
this.maxLines//最大行数,
  })
```
#### TextStyle
```java
const TextStyle({
this.inherit: true,
this.color//颜色,
this.fontSize//大小，默认10像素,
this.fontWeight,
this.fontStyle,
this.letterSpacing//字间距,
this.wordSpacing//字符间距,
this.textBaseline,
this.height,
this.decoration,
this.decorationColor,
this.decorationStyle,
this.debugLabel,
String fontFamily//字体,
String package,
  })

```
textAlign文本的对齐方式，【left：左对齐】、【right：右对齐】、【center：居中对齐】、【justify：自适应】、【start：文本开头，和textDirection有关】、【end：文本结尾，，和textDirection有关】

textDirection文本方向，【rtl:right to left 从右向左】、【ltr:left to right 从左向右】

overflow超出屏幕，是否换行显示 bool，传入true则换行，传入false这不换行

textScaleFactor传入double值，值越大字体大小越大，默认为1.0

maxLines最大显示行数
#### Image
- new Image, 用于从ImageProvider获取图像。
- new Image.asset, 用于从AssetBundle获取图像。
- new Image.network, 用于从URL获取图像。
- new Image.file, 用于从文件中获取图像。
- new Image.memory, 用于从内存中获取图像

Image支持JPEG, PNG, GIF, Animated GIF, WebP, Animated WebP, BMP, 和 WBMP

#### TabBar
```java
const TabBar({
   Key key,
   @required this.tabs,//WidgetList，一般使用系统提供的Tab作为Widget哦
   this.controller,//控制器
   this.isScrollable: false,//总内容超出自动宽展区域并可以滚动
   this.indicatorColor,//指示器颜色
   this.indicatorWeight: 2.0,指示器宽度
   this.indicatorPadding: EdgeInsets.zero,//指示器padding
   this.indicator,//自定义指示器
   this.indicatorSize,//指示器大小
   this.labelColor,//文字颜色
   this.labelStyle,//文字style
   this.unselectedLabelColor,//未选中文字颜色
   this.unselectedLabelStyle,//未选中文字style
 })
```

#### ProgressIndicator
在Flutter中`ProgressIndicator`是个抽象类，它有两个子类。

`LinearProgressIndicator`和`CircularProgressIndicator`，分别代表线性进度条和原型进度条，当然两个进度条的应用场景也会有不同，`LinearProgressIndicator`主要用于明确刻度的进度表示，`CircularProgressIndicator`主要用于未知刻度的进度表示。

#### LinearProgressIndicator
```java
const LinearProgressIndicator({
  Key key,
  double value,//当前进度0-1之间
  Color backgroundColor,//背景颜色
  Animation<Color> valueColor,//选中颜色，需要用到动画的知识，以后讲
})
```
#### CircularProgressIndicator
CircularProgressIndicator的构造方法和LinearProgressIndicator类似，只不过多了strokeWidth（边款宽度）
```java
const CircularProgressIndicator({
  Key key,
  double value,
  Color backgroundColor,
  Animation<Color> valueColor,
  this.strokeWidth: 4.0,
})
```
#### ListTile
```java
this.leading,              // item 前置图标
this.title,                // item 标题
this.subtitle,             // item 副标题
this.trailing,             // item 后置图标
this.isThreeLine = false,  // item 是否三行显示
this.dense,                // item 直观感受是整体大小
this.contentPadding,       // item 内容内边距
this.enabled = true,
this.onTap,                // item onTap 点击事件
this.onLongPress,          // item onLongPress 长按事件
this.selected = false,     // item 是否选中状态
```

#### DropdownButton
```java
DropdownButton({
    Key key,
    //下拉菜单显示的条目集合信息
    @required this.items,
    //下拉菜单选择完之后,呈现给用的值
    this.value,
    //提示文字,第一次不指定默认的值即value值为null,我们的hint就起到了作用
    //一般hint展示：请选择一个条目,或者我们第一次把hint展示位下拉菜单条目的第一个值
    this.hint,
    //下拉菜单item点击之后的回调
    @required this.onChanged,
    this.elevation: 8,
    //TextStyle
    this.style,
    //下拉菜单icon按钮大小
    this.iconSize: 24.0,
    this.isDense: false,
  })
```


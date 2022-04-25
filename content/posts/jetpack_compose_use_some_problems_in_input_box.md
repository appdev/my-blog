---
title: "在 Jetpack Compose 中使用输入框（TextField ）遇到的一些问题"
slug: "jetpack_compose_use_some_problems_in_input_box"
date: 2021-08-20T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "在JetpackCompose中使用输入框（TextField）遇到的一些问题为了更好的阅读体验，在阅读本文之前，你需要对"
cover: 
    image: "https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726860420webp"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
# 在 Jetpack Compose 中使用输入框（TextField ）遇到的一些问题

> 为了更好的阅读体验，在阅读本文之前，你需要对 [Compose](https://developer.android.com/jetpack/compose)或者 Flutter (实在太像了)有过基础的了解

Compose 虽然发布已经快一个月了。但是真正用到项目中的应该是少之又少了。靠着以前写 Flutter 积累的少许经验，最近决定试试水，在项目中使用，接下来大概率会更新一些在使用 `Compose` 遇到的问题

# 先定一个小目标

日常开发中，类似下面这中搜索功能应该是很常见的需求了，接下来我们就来实现它

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726860420webp)

## TextField 的简单使用

`TextField` 提供了很多的参数用法，我们先参照 Google 开发文档的基础用法尝试完成以下 UI 给的样式。

稍微了解的同学都知道这个实现起来很简单：row + icon + TextField 完事

还是贴一下简单的代码吧。主要看`TextField` 部分

```kotlin
var text by remember { mutableStateOf("") }
    Row(
        Modifier
            .fillMaxWidth()
            .padding(end = 20.dp, start = 10.dp)
            .background(Color.White),
        verticalAlignment = Alignment.CenterVertically
    ) {
    
···· 省略 ····
        TextField(
            value = text,
            onValueChange = {
                text = it
                onValueChange.invoke(it)
            },
            singleLine = true,
            placeholder = { Text(value, fontSize = 16f.sp, color = colorResource(id = R.color.color_BFBFBF)) },
            leadingIcon = { BuildImageIcon(R.drawable.icon_search_black, 24.dp) },
            trailingIcon = {
                BuildImageIcon(R.drawable.icon_edit_clean, 24.dp) {
                    text = ""
                }
            },
            textStyle = TextStyle(color = colorResource(id = R.color.color_262626), fontSize = 16.sp),
            modifier = Modifier
                .fillMaxSize()
                .padding(start = 20.dp)
                .background(colorResource(id = R.color.colorF5F5F5))
                .defaultMinSize(minHeight = 40.dp),
            shape = RoundedCornerShape(8.dp),
               colors = TextFieldDefaults.textFieldColors(
                backgroundColor = colorResource(id = R.color.colorF5F5F5),
            ),
        )
    }
}
```

凭我多年的经验，我想已经可以开始划水了。🎉

然而。。。。、运行后却是这个样子~~~

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726860823webp)

1. 多了一个下划线，这个很好去除
2. 高度不对
3. 文字显示不全。

那么我们接下来就来修改这些问题。

## TextField 细节修改

首先改最简单的下划线：

只需要修改`TextField`  的 colors 就可以了：

```kotlin
colors = TextFieldDefaults.textFieldColors(
                backgroundColor = colorResource(id = R.color.colorF5F5F5),
            +   focusedIndicatorColor = Color.Transparent,
            +   unfocusedIndicatorColor = Color.Transparent
            ),
```

高度不对：

这个直接修改 `Modifier` 就好了。

```Java
Modifier.fillMaxSize().height(40.dp).padding(start = 20.dp),
```

接下来是最关键的文字显示不全了:

## 修改 `TextField` 内部边距

`TextField`

试了很多属性，都不能直接取消 TextField 内置 padding

查看源代码可以发现。`TextField` 是基于`BasicTextField` 的，在内部写了默认高度：

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726861232webp)

那么修改这个默认高度呢，尝试了一下，没有效果

·····

很遗憾，试了很多办法， Google、stackoverflow 找了几个小时，没有办法。

`TextField` 就只能这样，全文完！！！😪

# 对`BasicTextField` 进行修改

`TextField` 可以看到是在 `androidx.compose.material` 包下的一个类，可以看做是一个符合 Material Design 设置的输入框，想要让它完全符合国内的设计确实有点难。好在我们看到了`BasicTextField` 这个类，我们可以直接使用`BasicTextField` 来实现。

## `BasicTextField` 的使用

`BasicTextField` 用起来跟 `TextField` 区别不大：

> `BasicTextField`没有提供 leading、trailing 属性，我们使用 Row + icon + BasicTextField + icon 来自己实现

贴一下代码：

> `BuildImageIcon`  是自己封装的一个本地 drawable 的 Image

> 一定要记得给`Row`  加上 `verticalAlignment`  而不是给 `textStyle` 加上。因为它只能控制文字在 horizontal 方向上的位置

```kotlin
var text by remember { mutableStateOf("") }
   Row(
            Modifier
                .fillMaxWidth()
                .background(
                    colorResource(id = R.color.colorF5F5F5),
                    shape = RoundedCornerShape(8.dp)
                )
                .height(40.dp)
                .padding(start = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BuildImageIcon(R.drawable.icon_search_black, 24.dp)
            BasicTextField(
                value = text,
                onValueChange = {
                    text = it
                    onValueChange.invoke(it)
                },
                singleLine = true,
                modifier = Modifier
                    .weight(1f)
                    .padding(start = 10.dp),
                textStyle = TextStyle(
                    color = colorResource(id = R.color.color_262626),
                    fontSize = 16.sp,
                ),
         
                keyboardActions = KeyboardActions(onSearch = {
                    onSearch?.invoke(text)
                }),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search)
            )
            BuildImageIcon(R.drawable.icon_edit_clean, 24.dp) {
                text = ""
            }
        }
```

运行后效果还是非常接近设计图的：

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726861561webp)

输入文字测试一下也没有问题：

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726861984webp)

以为这就完了吗？不不，还有一个明显的问题，输入框没有 hint (或者说 placeholder )

## 给 `BasicTextField` 增加 placeholder

这个问题还是很好解决的。稍微查看一下 `BasicTextField` 的源码，有一个 decorationBox 属性，在注释里写的很清楚：

> Composable lambda that allows to add decorations around text field, suc  as icon, placeholder, helper messages or similar, and automatically increase the hit target area of the text field. To allow you to control the placement of the inner text field relative to your decorations, the text field implementation will pass in a framework-controlled composable  parameter "innerTextField" to the decorationBox lambda you provide. You must call  innerTextField exactly once.

大致意思是说，通过它你可以在文本字段周围添加装饰物，如图标、占位符、帮助信息或类似的东西，并自动增大文本字段的目标区域

而且 `TextField` 的这些功能也是通过这个实现的

这里直接贴一下 decorationBox 这块的代码：

```kotlin
decorationBox = { innerTextField ->
                    if (text.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .padding(start = 5.dp)
                                .fillMaxSize(), contentAlignment = Alignment.CenterStart
                        ) {
                            Text(
                               "这里是占位部分", fontSize = 16f.sp,
                                modifier = Modifier
                                    .fillMaxWidth(),
                                style = TextStyle(
                                    color = colorResource(id = R.color.color_BFBFBF),
                                    fontSize = 16.sp,
                                ),
                            )
                        }

                    } else
                        innerTextField()
                },
```

> 说一下我的理解 innerTextField 这个就是当前 BasicTextField 自身的文字输入部分，我们先根据上面的 text 判断一下是否有输入的文字，如果没有就展示我们的占位 Text。

运行看看效果：

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726862364webp)

可以说是跟效果图几乎一样了，非常完美。

这次真的可以 说要收工了。😚

但是！！！！发现点击输入框后不显示光标。这个体验是真的不好。

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726862772webp)

如果有多个输入框的情况下，用户根本不知道点的是那个。

发现去掉了我们设置的 placeholder 后，再点击就正常了。但是 placeholder 去掉后就跟设计图不符了，肯定是不能去掉的。

这个问题真的困扰我很久。

## `BasicTextField` 有 placeholder 的情况下还能显示光标

这个问题我也没有找到好的办法，如果哪位大佬有办法希望能不吝赐教。

进过半天的思索无果后，最后只能使用终极办法：

用 Box 将两个控件放到一起

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726863142webp)

运行后的效果

![webp](https://myblog-1251192683.cos.ap-shanghai.myqcloud.com/images/blog/1646726863587webp)

这样处理之后，确实是符合要求了，但是感觉写法上不是很优雅。希望评论区能有个更优雅的写法

最后，送上封装后的 `BasicTextField`,更符合实际项目中使用：

```Kotlin
@Composable
fun CustomTextField(
    modifier: Modifier = Modifier,
    hint: String? = null,
    showCleanIcon: Boolean = false,
    onTextChange: String.() -> Unit = {},
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: String.() -> Unit = {},
    textFieldStyle: TextStyle = defaultTextStyle,
    hintTextStyle: TextStyle = defaultHintTextStyle,

    ) {
    var text by remember { mutableStateOf("") }
    Row(
        modifier,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        leadingIcon?.invoke()
        BasicTextField(
            value = text,
            onValueChange = {
                text = it
                onTextChange.invoke(it)
            },
            cursorBrush = SolidColor(colorResource(id = R.color.color_currency)),
            singleLine = true,
            modifier = Modifier
                .weight(1f)
                .padding(start = 10.dp),
            textStyle = textFieldStyle,
            decorationBox = { innerTextField ->
                if (text.isBlank() && hint.isNotNullEmpty())
                    Box(
                        modifier = Modifier
                            .fillMaxHeight(),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        innerTextField()
                        CustomText(hint ?: "", 16f.sp, colorResource(id = R.color.color_BFBFBF))
                        Text(
                            hint ?: "",
                            modifier = Modifier
                                .fillMaxWidth(),
                            style = hintTextStyle,
                        )
                    } else innerTextField()

            },
            keyboardActions = KeyboardActions {
                keyboardActions(text)
            },
            keyboardOptions = keyboardOptions
        )
        trailingIcon?.invoke()
        if (showCleanIcon)
            ImageIcon(R.drawable.icon_edit_clean, 24.dp) {
                text = ""
            }
    }
}
```


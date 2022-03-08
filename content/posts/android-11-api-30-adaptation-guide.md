---
title: "android 11 [api 30] 适配指南"
slug: "android-11-api-30-adaptation-guide"
date: 2020-09-15T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

cover: 
    image: "https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268551223689144764.jpg"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                

转眼之间就该适配Android 11，记得距离上次写 [Android 10 适配指南](https://www.apkdv.com/android-10-api-29-adaptation-guide.html)才过去不久.

### 行为变更：所有应用

这些变化，影响所有的应用，不管你的应用的`targetSdkVersion`是多少，只要是运行在Android 11 上都会影响，应该格外的关注：

#### 数据访问审核

> 为了让应用及其依赖项访问用户私密数据的过程更加透明，Android 11 引入了数据访问审核功能。借助此流程得出的见解，您可以更好地识别和纠正可能出现的意外数据访问。

您的应用可以注册 `AppOpsManager.OnOpNotedCallback` 实例，该实例可在每次发生以下任一事件时执行相应操作：

应用的代码访问私密数据。为了帮助您确定应用的哪个逻辑部分调用了事件，您可以按归因标记审核数据访问。
依赖库或 SDK 中的代码访问私密数据。
数据访问审核是在发生数据请求的线程上调用的。这意味着，如果应用中的第三方 SDK 或库调用访问私密数据的 API，您的 OnOpNotedCallback 可以调用数据访问审核检查有关该调用的信息。通常，此回调对象可以通过查看应用的当前状态（例如当前线程的堆栈轨迹）以判断调用是来自您的应用还是来自 SDK。

#### 单次授权

> 在 Android 11 中，每当应用请求与位置信息、麦克风或摄像头相关的权限时，面向用户的权限对话框会包含仅限这一次选项。如果用户在对话框中选择此选项，系统会向应用授予临时的单次授权。

在申请与`位置信息`、`麦克风`或`摄像头`相关的权限时，系统会自动提供一个单次授权的选项，只供这一次权限获取。然后用户下次打开app的时候，系统会再次提示用户授予权限。这个影响应该不大，只要我们每次使用的时候都去判断权限，没有就去申请即可。放一张新版本权限获取样式：
 
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268551223689144764.jpg)


#### JobScheduler API 调用限制调试

`JobScheduler`任务调度器，可以在设备空闲时做一些任务处理。Android11中如果你设置为`debug`模式（debuggable 清单属性设置为 true），超出速率限制的JobScheduler API调用将返回 RESULT_FAILURE。这个有什么用呢？应该可以帮助我们发现一些性能问题，感兴趣的可以自己试试。

顺便提下，Jetpack组件WorkManager也是用到了JobScheduler，不熟悉的同学可以去了解下，JobScheduler是由SystemServer进程启动的一个系统服务，所以才可以有这么大的权限。


#### 应用使用情况统计信息

> 为了更好地保护用户，Android 11 将每个用户的应用使用情况统计信息存储在凭据加密存储空间中。

`UsageStatsManager`是Android提供统计应用使用情况的服务。通过这个服务可以获取指定时间区间内应用使用统计数据、组件状态变化事件统计数据以及硬件配置信息统计数据。

比如`queryAndAggregateUsageStats`方法，可以获取指定时间区间内使用统计数据，以应用包名为键值进行数据合并。

但是在Android 11 设备中，系统和任何应用都无法访问该数据，除非 isUserUnlocked() 返回 true，这发生在出现以下某种情况之后：

- 用户在系统启动后首次解锁其设备。
- 用户在设备上切换到自己的帐号。  

#### 无障碍操作
在Android手机上有个预安装的屏幕阅读服务，叫做`TalkBack`，为视力障碍人士或者视力状态不佳的老年人提供。那我们应用为了让这个阅读器能够读懂你的自定义view操作，必须给与自定义控件定义处理程序，包括点击，长按等操作。原来版本可能对于`OnTouchListener`也支持无障碍触摸事件，而在Android 11中，必须专门制定点击或者长按事件才行了

```
class TriSwitch(context: Context) : Switch(context) {
    // 0, 1, or 2.
    var currentState: Int = 0
        private set

    init {
        updateAccessibilityActions()
    }

    private fun updateAccessibilityActions() {
        ViewCompat.replaceAccessibilityAction(this, ACTION_CLICK,
            action-label) {
            view, args -> moveToNextState()
        })
    }

    private fun moveToNextState() {
        currentState = (currentState + 1) % 3
    }
}

```
一个自定义控件TriSwitch，继承自Switch，由于和Switch的点击效果不一样，所以必须通过替换 ViewCompat.replaceAccessibilityAction() 来重新定义相应的无障碍操作。


#### 非SDK接口限制  

老样子，Android11也会限制一些接口，包括灰名单和白名单，具体看[非SDK接口列表](https://developer.android.google.cn/preview/non-sdk-11#r-list-changes)
#### Scudo Hardened Allocator  

> Scudo 是一个动态的用户模式内存分配器（也称为堆分配器），旨在抵御与堆相关的漏洞（如基于堆的缓冲区溢出、释放后再使用和双重释放），同时保持性能良好。它提供了标准 C 分配和取消分配基元（如 malloc 和 free），以及 C++ 基元（如 new 和 delete）   
https://source.android.google.cn/devices/tech/debug/scudo



#### 文件描述符排错程序 (fdsan)


> Android 10 引入了 fdsan（文件描述符排错程序）。fdsan 检测错误处理文件描述符所有权的错误，例如 use-after-close 和 double-close。在 Android 11 中，fdsan 的默认模式发生了变化。现在，fdsan 会在检测到错误时中止，而以前的行为则是记录警告并继续。如果您在应用中发现由于 fdsan 而导致的崩溃，请参阅 [fdsan documentation](https://android.googlesource.com/platform/bionic/+/master/docs/fdsan.md)。

后面两个对于普通应用开发者似乎不需要怎么适配，剩下的如果用到都需要适配 

### 以 Android 11 为目标平台的应用

Android 11 更新主要还是集中在隐私控制这块:

![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268557103226951747.png)


#### 分区存储强制执行

>对外部存储目录的访问仅限于应用专属目录，以及应用已创建的特定类型的媒体。 

`分区存储`，在Android10就已经推行了，简单的说，就是应用对于文件的读写只能在沙盒环境，也就是属于自己应用的目录里面读写。其他媒体文件可以通过`MediaStore`进行访问。
具体可以看这里 https://apkdv.com/android-10-api-29-adaptation-guide.html#menu_index_8


但是在android10的时候，Google还是为开发者考虑，留了一手。在targetSdkVersion = 29应用中，设置`android:requestLegacyExternalStorage="true"`，就可以不启动分区存储，让以前的文件读取正常使用。但是targetSdkVersion = 30中不行了，强制开启分区存储。

同时增加了`android:preserveLegacyExternalStorage="true"`，供覆盖升级的应用使用，它可以暂时关闭分区存储，好让开发者完成数据迁移的工作。但是只要卸载再次重装应用就会失效。

下面是关于旧版本的存储权限的相关运行状况：

1. `targetSdkVersion = 28`，运行后正常读写。
1. `targetSdkVersion = 29`，不删除应用，targetSdkVersion 由28修改到29，覆盖安装，运行后正常读写。
1. `targetSdkVersion = 29`，删除应用，重新运行，读写报错，程序崩溃（open failed: EACCES (Permission denied)）
1. `targetSdkVersion = 29`，添加android:requestLegacyExternalStorage="true"（不启用分区存储），读写正常不报错
1. `targetSdkVersion = 30`，不删除应用，targetSdkVersion 由29修改到30，读写报错，程序崩溃（open failed: EACCES (Permission denied)）
1. `targetSdkVersion = 30`，不删除应用，targetSdkVersion 由29修改到30，增加`android:preserveLegacyExternalStorage="true"`，读写正常不报错
1. `targetSdkVersion = 30`，删除应用，重新运行，读写报错，程序崩溃（open failed: EACCES (Permission denied)）


三种方法访问文件：
1）应用专属目录
```java
//分区存储空间
val file = File(context.filesDir, filename)

//应用专属外部存储空间
val appSpecificExternalDir = File(context.getExternalFilesDir(), filename)
```

2）访问公共媒体目录文件
```java
val cursor = contentResolver.query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, null, null, null, "${MediaStore.MediaColumns.DATE_ADDED} desc")
if (cursor != null) {
    while (cursor.moveToNext()) {
        val id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID))
        val uri = ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id)
        println("image uri is $uri")
    }
    cursor.close()
}

```
3) SAF(存储访问框架--Storage Access Framework)
```java
    val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
    intent.addCategory(Intent.CATEGORY_OPENABLE)
    intent.type = "image/*"
    startActivityForResult(intent, 100)

    @RequiresApi(Build.VERSION_CODES.KITKAT)
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (data == null || resultCode != Activity.RESULT_OK) return
        if (requestCode == 100) {
            val uri = data.data
            println("image uri is $uri")
        }
    }
```
#### 媒体文件访问权限
> 为了在保证用户隐私的同时可以更轻松地访问媒体，Android 11 增加了以下功能。

执行批量操作  

这里的批量操作指的是Android 11 向 MediaStore API 中添加了多种方法，用于简化特定媒体文件更改流程（例如在原位置编辑照片），分别是：

`createWriteRequest()` 用户向应用授予对指定媒体文件组的写入访问权限的请求。
`createFavoriteRequest()`用户将设备上指定的媒体文件标记为“收藏”的请求。对该文件具有读取访问权限的任何应用都可以看到用户已将该文件标记为“收藏”。
`createTrashRequest()` 用户将指定的媒体文件放入设备垃圾箱的请求。垃圾箱中的内容会在系统定义的时间段后被永久删除。
`createDeleteRequest()` 用户立即永久删除指定的媒体文件（而不是先将其放入垃圾箱）的请求。

具体的使用方法可以看Google提供的相关文档 https://developer.android.google.cn/preview/privacy/storage#media-file-access

#### 所有文件访问权限

可通过执行以下操作，向用户请求名为“所有文件访问权限”的特殊应用访问权限：

在清单中声明 `MANAGE_EXTERNAL_STORAGE` 权限。  
使用 `ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION` intent 操作将用户引导至一个系统设置页面，在该页面上，用户可以为应用启用以下选项：授予所有文件的管理权限。  

![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268551223689144764.jpg)

```java
 //判断是否获取MANAGE_EXTERNAL_STORAGE权限：
    val isHasStoragePermission= Environment.isExternalStorageManager()
```
`MANAGE_EXTERNAL_STORAGE` 权限会授予以下权限：

- 对共享存储空间中的所有文件的读写访问权限。

`注意：/sdcard/Android/media⁠ 目录是共享存储空间的一部分。
对 MediaStore.Files 表的内容的访问权限。`

- 对 USB On-The-Go (OTG) 驱动器和 SD 卡的根目录的访问权限。

- 除 /Android/data/、/sdcard/Android 和 /sdcard/Android 的大多数子目录外，对所有内部存储目录⁠的写入权限。此写入权限包括文件路径访问权限。

获得此权限的应用仍然无法访问属于其他应用的应用专用目录，因为这些目录在存储卷上显示为 Android/data/ 的子目录。

当应用具有 `MANAGE_EXTERNAL_STORAGE` 权限时，它可以使用 MediaStore API 或文件路径访问这些额外的文件和目录。但是，当您使用存储访问框架时，只有在您不具备 `MANAGE_EXTERNAL_STORAGE` 权限也能访问文件或目录的情况下才能访问文件或目录。

#### 自动重置权限

> 如果应用以 Android 11 为目标平台并且数月未使用，系统会通过自动重置用户已授予应用的运行时敏感权限来保护用户数据。此操作与用户在系统设置中查看权限并将应用的访问权限级别更改为拒绝的做法效果一样。如果应用已遵循有关在运行时请求权限的最佳做法，那么您不必对应用进行任何更改。这是因为，当用户与应用中的功能互动时，您应该会验证相关功能是否具有所需权限。

**请求用户停用自动重置功能**

将用户引导至系统设置中您应用的页面，请调用包含 `Intent.ACTION_AUTO_REVOKE_PERMISSIONS` intent 操作的 intent。在此屏幕中，用户可以通过执行以下操作来阻止系统重置应用的权限：

![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268565243235753632.png)

点按权限，系统会加载应用权限设置屏幕。

**确定是否已停用自动重置功能**  
调用 `isAutoRevokeWhitelisted()`。如果此方法返回 true，则系统不会自动重置应用的权限。。


#### 电话号码相关权限

> Android 11 更改了您的应用在读取电话号码时使用的与电话相关的权限。

具体改了什么呢？其实就是两个API：

- TelecomManager 类中的 getLine1Number() 方法
- TelecomManager 类中的 getMsisdn() 方法

> TelephonyManager 类中不受支持的 getMsisdn() 方法。
如果您的应用声明 READ_PHONE_STATE 

也就是当用到这两个API的时候，原来的`READ_PHONE_STATE`权限不管用了，需要`READ_PHONE_NUMBERS`权限才行。

#### 系统提醒窗口变更
> 从 Android 11 开始，已弃用自定义消息框视图。如果您的应用以 Android 11 为目标平台，包含自定义视图的消息框在从后台发布时会被屏蔽

也就是自定义Toast被启用了。如果在后台使用了自定义Toast会有一个警告，不过这里刚好有一个第三方库，兼容Android 11 新API的
https://github.com/getActivity/ToastUtils （这个库跟我没啥关系，刚好看到而已 ^_^）

#### 相机

从 Android 11 开始，只有预装的系统相机应用可以响应以下 intent 操作：

`android.media.action.VIDEO_CAPTURE`
`android.media.action.IMAGE_CAPTURE`
`android.media.action.IMAGE_CAPTURE_SECURE`
如果有多个预装的系统相机应用可用，系统会显示一个对话框，供用户选择应用。如果您希望自己的应用使用特定的第三方相机应用来代表其捕获图片或视频，可以通过为 intent 设置软件包名称或组件来使这些 intent 变得明确。

#### 5G


新的Android11也是支持了5G相关的一些功能，包括：

- 检测是否连接到了5G网络
- 检查按流量计费性

**5G 检测**
从 Android 11 开始，您可以使用基于回调的 API 调用来检测设备是否连接到了 5G 网络。您可以检查连接的是 5G NR（独立）网络，还是 NSA（非独立）网络。

调用 `TelephonyManager.listen()` 并传入 `LISTEN_DISPLAY_INFO_CHANGED`，以确定用户是否连接到了 5G 网络。替换 `onDisplayInfoChanged()` 方法，以确定应用连接到的网络类型：

|返回类型|	网络|
| :- | :- |
|OVERRIDE_NETWORK_TYPE_LTE_ADVANCED_PRO|	高级专业版 LTE (5Ge)|
|OVERRIDE_NETWORK_TYPE_NR_NSA|	NR (5G) - 5G Sub-6 网络|
|OVERRIDE_NETWORK_TYPE_NR_NSA_MMWAVE|	5G+/5G UW - 5G mmWave 网络|


**检查按流量计费性**

```java
NetworkCapabilities.hasCapability(NET_CAPABILITY_NOT_METERED) ||
  NetworkCapabilities.hasCapability(NET_CAPABILITY_TEMPORARILY_NOT_METERED)
```
如果值为 true，则您可以将网络视为不按流量计费。

#### 后台位置信息访问权限

> 在搭载 Android 11 的设备上，当应用中的某项功能请求在后台访问位置信息时，用户看到的系统对话框不再包含用于启用后台位置信息访问权限的按钮。如需启用后台位置信息访问权限，用户必须在设置页面上针对应用的位置权限设置一律允许选项。

主要涉及到两点：

- 从Android10系统的设备开始，就需要请求后台位置权限（`ACCESS_BACKGROUND_LOCATION`），并选择`Allow all the time （始终允许）`才能获得后台位置权限。Android11设备上再次加强对后台权限的管理，主要表现在系统对话框上，对话框不再提示始终允许字样，而是提供了位置权限的设置入口，需要在设置页面选择始终允许才能获得后台位置权限。
- 在搭载Android11系统的设备上，`targetVersion`小于30的时候，可以前台后台位置权限一起申请，并且对话框提供了文字说明，表示需要随时获取用户位置信息，进入设置选择始终允许即可。但是`targetVersion`为30的时候，你必须单独申请后台位置权限，而且要在获取前台权限之后，顺序不能乱。并且无任何提示，需要开发者自己设计提示样式。

可能有点绕，操作几个例子说明：
1. Android10设备，申请前台和后台位置权限（任意targetSdkVersion）：
```java
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```
执行效果：  

![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726856880668891338.jpg)

2. Android11设备，targetSdkVersion<=29(Android 10),申请前台和后台位置权限：
```java
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```
执行效果：  
![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/1646726857243511464266.jpeg)


3. Android11设备，targetSdkVersion=30(Android 11),申请前台和后台位置权限：
```java
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```
执行无反应  

4. Android11设备，targetSdkVersion=30(Android 11),先申请前台位置权限，后申请后台位置权限：  

![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268579423186618193.jpg)

```java
requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION), 100)
```
执行效果：
```java
requestPermissions(arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION), 100)
```
执行效果(直接跳转到设置页面，无任何说明)：  

![](https://gitee.com/huclengyue/my-gallery/raw/master/images/blog/16467268583143880000975.jpeg)
所以，该怎么适配呢:

- `targetSdkVersion<30`情况下，如果你之前就有判断过前台和后台位置权限，那就无需担心，没有什么需要适配。
- `targetSdkVersion>30`情况下,需要分开申请前后台位置权限，并且对后台位置权限申请做好说明和引导，当然也是为了更好的服务用户。

权限申请的demo代码：
```java
    val permissionAccessCoarseLocationApproved = ActivityCompat
        .checkSelfPermission(this, permission.ACCESS_COARSE_LOCATION) ==
        PackageManager.PERMISSION_GRANTED

    if (permissionAccessCoarseLocationApproved) {
       val backgroundLocationPermissionApproved = ActivityCompat
           .checkSelfPermission(this, permission.ACCESS_BACKGROUND_LOCATION) ==
           PackageManager.PERMISSION_GRANTED

       if (backgroundLocationPermissionApproved) {
            //前后台位置权限都有
       } else {
            //申请后台权限
            if (applicationInfo.targetSdkVersion < Build.VERSION_CODES.R){
                ActivityCompat.requestPermissions(this,
                        arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                        200)
            }else{
                AlertDialog.Builder(this).setMessage("需要提供后台位置权限，请在设置页面选择始终允许")
                        .setPositiveButton("确定", DialogInterface.OnClickListener { dialog, which ->
                            ActivityCompat.requestPermissions(this,
                                    arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                                    200)
                        }).create().show()
            }

       }
    } else {
        if (applicationInfo.targetSdkVersion < Build.VERSION_CODES.R){
            //申请前台和后台位置权限
            ActivityCompat.requestPermissions(this,
                    arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                    100)
        }else{
            //申请前台位置权限
            ActivityCompat.requestPermissions(this,
                    arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION),
                    100)
        }
    }
```

#### 软件包可见性

>Android 11 更改了应用查询用户已在设备上安装的其他应用以及与之交互的方式。使用新的  元素，应用可以定义一组自身可访问的其他应用。通过告知系统应向您的应用显示哪些其他应用，此元素有助于鼓励最小权限原则。此外，此元素还可帮助 Google Play 等应用商店评估应用为用户提供的隐私权和安全性。

也就是说，Android11中，如果你想去获取其他应用的信息，比如包名，名称等等，不能直接获取了，必须在清单文件中添加<queries>元素，告知系统你要获取哪些应用信息或者哪一类应用。  

比如我这段查询应用信息的代码：
```java
    val pm = this.packageManager
    val listAppcations: List<ApplicationInfo> = pm
            .getInstalledApplications(PackageManager.GET_META_DATA)
    for (app in listAppcations) {
        Log.e("lz",app.packageName)
    }
```
在Android11版本，只能查询到自己应用和系统应用的信息，查不到其他应用的信息了。怎么呢？添加<queries>元素，两种方式：
1. 元素中加入具体包名
```xml
<manifest package="com.example.game">
    <queries>
        <package android:name="com.example.store" />
        <package android:name="com.example.services" />
    </queries>
    ...
</manifest>
```
2. 元素中加入固定过滤的intent
```xml
<manifest package="com.example.game">
    <queries>
        <intent>
            <action android:name="android.intent.action.SEND" />
            <data android:mimeType="image/jpeg" />
        </intent>
    </queries>
</manifest>
```
可能还是有人会疑惑，那我的应用是浏览器或者设备管理器咋办呢？我就要获取所有包名啊？  
放心，Android11还引入了 `QUERY_ALL_PACKAGES` 权限，清单文件中加入即可。但是Google Play可不一定能滥用哦，它为需要`QUERY_ALL_PACKAGES` 权限的应用会提供相关指南，但是还没出来，具体要看后面的消息了。

#### 设备到设备文件传输

> 如果您的应用以 Android 11 为目标平台，您将无法再使用 allowBackup 属性停用应用文件的设备到设备迁移。系统会自动启用此功能。不过，即使您的应用以 Android 11 为目标平台，您也可以通过将 allowBackup 属性设置为 false 来停用应用文件的云端备份和恢复。

`android:allowBackup`属性

代表是否允许应用参与备份和恢复基础架构。如果将此属性设为 false，则永远不会为该应用执行备份或恢复，即使是采用全系统备份方法也不例外（这种备份方法通常会通过 adb 保存所有应用数据）。此属性的默认值为 true。

所以这里是不能停用文件的`设备到设备`迁移，但是可以停用`云端备份和恢复`

#### 限制对 APN 数据库的读取访问

> 以 Android 11 为目标平台的应用现在必须具备 Manifest.permission.WRITE_APN_SETTINGS 特权，才能读取或访问电话提供程序 APN 数据库。如果在不具备此权限的情况下尝试访问 APN 数据库，会生成安全异常。

就是说如果没有`Manifest.permission.WRITE_APN_SETTINGS`权限就不能读取APN数据库了，但是！这个权限很早之前就被限定只有系统程序才能申请这个权限了，现在这个特权没理解到是什么意思，难道系统程序都不能随便申请了？

#### 在元数据文件中声明“无障碍”按钮使用情况

> 从 Android 11 开始，您的无障碍服务无法在运行时声明与系统的“无障碍”按钮的关联。如果您将 AccessibilityServiceInfo.FLAG_REQUEST_ACCESSIBILITY_BUTTON 附加到 AccessibilityServiceInfo 对象的 flags 属性，框架就不会将“无障碍”按钮回调事件传递给您的服务。

做过无障碍辅助功能的应该都知道`AccessibilityServiceInfo`要设置flag为`FLAG_REQUEST_ACCESSIBILITY_BUTTON`，`getAccessibilityButtonController`方法获取辅助功能按钮控制器，并且可用于查询辅助功能按钮的状态并注册监听器以进行交互和辅助功能按钮的状态更改。  

但是，Android 11开始，这样写不能获取辅助按钮回调事件了，得换成另外一种写法。在元数据文件（通常为 res/raw/accessibilityservice.xml）中使用 `flagRequestAccessibilityButton` 标记声明您的无障碍服务与“无障碍”按钮的关联。

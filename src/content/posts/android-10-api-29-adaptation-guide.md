---
title: "android 10 [API 29] 适配指南"
slug: "android-10-api-29-adaptation-guide"
published: 2019-12-09T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---  
Android 11[API 30] 已经发布正式版，来看看全新的 [android 11 \[api 30\] 适配指南][1] 
### 非 SDK 接口
google 针对 [非 SDK 接口的限制][2] 
#### 非 SDK 接口检测工具
官方给出了一个检测工具，下载地址：[veridex][3]
veridex 使用方法：
`appcompat.sh --dex-file=apk.apk`
#### blacklist、greylist、greylist-max-o、greylist-max-p 含义
以上截图中，blacklist、greylist、greylist-max-o、greylist-max-p 含义如下：
`blacklist` 黑名单：禁止使用的非 SDK 接口，运行时直接 Crash（因此必须解决）
`greylist` 灰名单：即当前版本仍能使用的非 SDK 接口，但在下一版本中可能变成被限制的非 SDK 接口
`greylist-max-o`：在 targetSDK<=O 中能使用，但是在 targetSDK>=P 中被禁止使用的非 SDK 接口
`greylist-max-p`：在 targetSDK<=P 中能使用，但是在 targetSDK>=Q 中被禁止使用的非 SDK 接口
### 设备 ID
从 Android 10 开始已经无法完全标识一个设备，曾经用 mac 地址、IMEI 等设备信息标识设备的方法，从 Android 10 开始统统失效。而且无论你的 APP 是否是配过 Android 10。
#### IMEI 等设备信息
从 Android10 开始普通应用不再允许请求权限 android.permission.READ_PHONE_STATE。而且，**无论你的 App 是否适配过 Android Q（既 targetSdkVersion 是否大于等于 29），均无法再获取到设备 IMEI 等设备信息**。
受影响的 API  
```java
Build.getSerial();
TelephonyManager.getImei();
TelephonyManager.getMeid();
TelephonyManager.getDeviceId();
TelephonyManager.getSubscriberId();
TelephonyManager.getSimSerialNumber();
```
`targetSdkVersion<29` 的应用，其在获取设备 ID 时，会直接返回 null
`targetSdkVersion>=29` 的应用，其在获取设备 ID 时，会直接跑出异常 `SecurityException`
如果您的 App 希望在 Android 10 以下的设备中仍然获取设备 IMEI 等信息，可按以下方式进行适配：
```xml
<uses-permission
        android:name="android.permission.READ_PHONE_STATE"
        android:maxSdkVersion="28" />
```
#### Mac 地址随机分配
从 Android10 开始，默认情况下，在搭载 Android 10 或更高版本的设备上，系统会传输随机分配的 MAC 地址。（既从 Android 10 开始，普通应用已经无法获取设备的真正 mac 地址，标识设备已经无法使用 mac 地址）
#### 唯一 ID 的替代
Google 给出的解决方案是：如果您的应用有 追踪非登录用户重装 的需求，可用 `ANDROID_ID` 来标识设备。
`ANDROID_ID` 的生成规则为：签名 + 设备信息 + 设备用户
`ANDROID_ID`重置规则：设备恢复出厂设置时，`ANDROID_ID` 将被重置
```java
String androidId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);
```
也就是从 Android 10 开始已经无法完全标识一个设备，曾经用 mac 地址、IMEI 等设备信息标识设备的方法，从 Android 10 开始统统失效。而且无论你的 APP 是否是配过 Android 10。
### 外部存储
为了使用户更改的管理 Sdcard 中的文件，解决文件混乱的问题。从 Android 10 开始（API level 29），Android 将对外部存储进行一定的限制。默认情况下，对于外部存储，App 只能通过 Context.getExternalFilesDir() 访问自己的特定文件目录；以及系统特定的文件类型目录（例：照片、屏幕快照、视频 等）。
#### 着重说一下存储
1、Android Q 为每个应用程序在外部存储设备提供了一个独立的存储沙箱，应用直接通过文件路径保存的文件都会保存在应用的沙箱目录，另外应用卸载的时候默认所有应用沙箱目录是会被删除。
2、共享集合：不希望应用卸载删除的文件，需要应用通过 MediaProvider 或者 SAF 的方式保存在公共共享集合目录，公共集合目录包括：多媒体文件集合（音频、视频和图片）以及下载文件集合。
3、权限变更：应用读写自己沙箱和共享集合目录中应用自己的文件是不需要申请任何权限的，但是如果应用需要读取其他应用生成的多媒体文件就需要申请权限：
（1）读取其他应用存放在共享集合的图片和视频文件，就需要分别申请 READ_MEDIA_IMAGES 和 READ_MEDIA_VIDEO 权限，具体要申请哪个权限取决于应用需要访问的文件类型；
（2）读取其他应用存放在共享集合的音乐类型文件，就需要申请 READ_MEDIA_AUDIO 权限；
（3）读取其他应用生成的多媒体文件，需要通过 MediaProvider 的接口读取，无法直接通过文件路径读取；
（4）系统只提供了多媒体文件的读权限，没有提供写权限，应用无法通过申请写权限修改其他应用生成的文件；
（5）下载目录的文件没有增加对应的权限，读取下载目录的文件需要通过 SAF 的方式读取。
4、写其他应用的多媒体文件，需要通过申请成为默认系统图库和音乐应用，或者让用户主动授权的方式实现。
5、需要读写指定的任意目录的文件只能通过 SAF 的方式实现。
#### APP 专属路径
对于 App 专属 内部存储路径与外部存储路径的访问，将不再需要 `READ_EXTERNAL_STORAGE` 与 `WRITE_EXTERNAL_STORAGE` 权限：
内部存储路径 `/data/data/<包名>/`
外部存储路径  `/storage/Android/data/<包名>/`
#### 手机共享路径
读取其他 APP 创建的共享文件，例：相册、屏幕快照 等，则需要申请 READ_EXTERNAL_STORAGE 权限：
图片：Photos、Screenshots 使用 [MediaStore.Images][4] API 访问
视频 使用 [MediaStore.Video][5] API 访问
音频 使用 MediaStore.Audio API 访问
#### Downloads 文件夹
读取手机的 Downloads 文件夹，不需要任何权限，需要使用 API [Storage Access Framework][6]
### 权限相关
主要包括：
- 在后台运行时访问设备位置信息
Android 10 引入了 `ACCESS_BACKGROUND_LOCATION` 权限。若应用在后台运行时，访问手机位置，需要动态申请该权限，用户则可以选择拒绝。官方给出的数据，大部分用户对位置信息是比较敏感的。而且大部分用户是不允许应用在后台使用位置信息的。
- [从后台启动 Activity 的限制][7]
- 屏幕录制
不需要手动申请权限，但官方 API 内部会向用户弹窗申请权限
- 摄像头和麦克风
 Android 9 摄像头和麦克风 后台权限已经移除了
#### 活动探知——新增权限
在访问用户步数或其他物理活动类别是需要获取运行时权限
#### 剪切板隐私限制
从 Android P 开始，除非你的应用是默认输入法，否则它无法访问用户的剪贴板数据；但向剪切板写入数据不影响。
  [1]: https://apkdv.com/android-11-api-30-adaptation-guide.html
  [2]: https://developer.android.com/distribute/best-practices/develop/restrictions-non-sdk-interfaces#test-for-non-sdk
  [3]: https://android.googlesource.com/platform/prebuilts/runtime/+/master/appcompat
  [4]: https://developer.android.com/reference/android/provider/MediaStore.Images
  [5]: https://developer.android.com/reference/android/provider/MediaStore.Video
  [6]: https://developer.android.com/guide/topics/providers/document-provider
  [7]: https://developer.android.com/guide/components/activities/background-starts
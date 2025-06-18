---
title: "Android系统NFC读写简介"
slug: "Android-system-NFC-reading-and-writing"
published: 2018-06-25T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
在 Android NFC 应用中，Android 手机通常是作为通信中的发起者，也就是作为各种 NFC 卡的读写器。Android 对 NFC 的支持主要在 android.nfc 和 android.nfc.tech 两个包中。
android.nfc 包中主要类如下：
<!--more-->
NfcManager 可以用来管理 Android 设备中指出的所有 NFCAdapter，但由于大部分 Android 设备只支持一个 NFC Adapter，所以一般直接调用 getDefaultAapater 来获取手机中的 Adapter。
NfcAdapter 相当于一个 NFC 适配器，类似于电脑装了网络适配器才能上网，手机装了 NfcAdapter 才能发起 NFC 通信。
NDEF: NFC Data Exchange Format，即 NFC 数据交换格式。
NdefMessage 和 NdefRecord NDEF 为 NFC forum 定义的数据格式。
Tag 代表一个被动式 Tag 对象，可以代表一个标签，卡片等。当 Android 设备检测到一个 Tag 时，会创建一个 Tag 对象，将其放在 Intent 对象，然后发送到相应的 Activity。
android.nfc.tech 中则定义了可以对 Tag 进行的读写操作的类，这些类按照其使用的技术类型可以分成不同的类如：NfcA, NfcB, NfcF，以及 MifareClassic 等。其中 MifareClassic 比较常见。
当手机开启了 NFC，并且检测到一个 TAG 后，TAG 分发系统会自动创建一个封装了 NFC TAG 信息的 intent。如果多于一个应用程序能够处理这个 intent 的话，那么手机就会弹出一个框，让用户选择处理该 TAG 的 Activity。TAG 分发系统定义了 3 中 intent。按优先级从高到低排列为：
NDEF_DISCOVERED, TECH_DISCOVERED, TAG_DISCOVERED
当 Android 设备检测到有 NFC Tag 靠近时，会根据 Action 申明的顺序给对应的 Activity 发送含 NFC 消息的 Intent。
```java
ackage org.reno;
import android.app.Activity;
import android.content.Intent;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.MifareClassic;
import android.os.Bundle;
import android.widget.TextView;
public class Beam extends Activity {
NfcAdapter nfcAdapter;
TextView promt;
@Override
public void onCreate(Bundle savedInstanceState) {
super.onCreate(savedInstanceState);
setContentView(R.layout.main);
promt = (TextView) findViewById(R.id.promt);
// 获取默认的 NFC 控制器
NfcAdapter //相当于一个 NFC 适配器，类似于电脑装了网络适配器才能上网，手机装了 NfcAdapter 才能发起 NFC 通信。
nfcAdapter = NfcAdapter.getDefaultAdapter(this);
if (nfcAdapter == null) { //如果 NFC 不存在
promt.setText(“设备不支持 NFC！”);
finish();
return;
}
if (!nfcAdapter.isEnabled()) {//如果 NFC 未开启
promt.setText(“请在系统设置中先启用 NFC 功能！”);
finish();
return;
}
}
@Override
protected void onResume() {
super.onResume();
//得到是否检测到 ACTION_TECH_DISCOVERED 触发
if (NfcAdapter.ACTION_TECH_DISCOVERED.equals(getIntent().getAction())) {
//处理该 intent
processIntent(getIntent());
}
}
//字符序列转换为 16 进制字符串
private String bytesToHexString(byte[] src) {
StringBuilder stringBuilder = new StringBuilder(“0x”);
if (src == null || src.length <= 0) {
return null;
}
char[] buffer = new char[2];
for (int i = 0; i < src.length; i++) {
buffer[0] = Character.forDigit((src[i] >>> 4) & 0x0F, 16);
buffer[1] = Character.forDigit(src[i] & 0x0F, 16);
System.out.println(buffer);
stringBuilder.append(buffer);
}
return stringBuilder.toString();
}
//系统来检测到 NFC , 将其封装成 Tag 类，存放到 Intent 的 NfcAdapter.EXTRA_TAG Extra 数据包中，
//使用 MifareClassic.get(Tag) 获取对象的 MifareClassic 类。
//取出 NFC 中的数据
 private void processIntent(Intent intent) {
 //取出封装在 intent 中的 TAG
 Tag tagFromIntent = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
 for (String tech : tagFromIntent.getTechList()) {
 System.out.println(tech);
 }
 boolean auth = false;
 MifareClassic mfc = MifareClassic.get(tagFromIntent);
 try {
 String metaInfo = “”;
 //Enable I/O operations to the tag from this TagTechnology object.
 mfc.connect();
//因此读写 Mifare Tag //首先需要有正确的 Key 值（起到保护的作用），如果鉴权成功，然后才可以读写该区数据。
 int type = mfc.getType();//获取 TAG 的类型
 int sectorCount = mfc.getSectorCount();//获取 TAG 中包含的扇区数
 String typeS = “”;
 switch (type) {
 case MifareClassic.TYPE_CLASSIC:
 typeS = “TYPE_CLASSIC”;
 break;
 case MifareClassic.TYPE_PLUS:
 typeS = “TYPE_PLUS”;
 break;
 case MifareClassic.TYPE_PRO:
 typeS = “TYPE_PRO”;
 break;
 case MifareClassic.TYPE_UNKNOWN:
 typeS = “TYPE_UNKNOWN”;
 break;
 }
 metaInfo += “卡片类型：” + typeS + “n 共” + sectorCount + “个扇区 n 共”
 + mfc.getBlockCount() + “个块 n 存储空间：” + mfc.getSize() + “Bn”;
 for (int j = 0; j < sectorCount; j++) {
 //读写 Mifare Tag 首先需要有正确的 Key 值（起到保护的作用），如果鉴权成功：
 auth = mfc.authenticateSectorWithKeyA(j,
 MifareClassic.KEY_DEFAULT);
 int bCount;
 int bIndex;
if (auth) {
 metaInfo += “Sector” + j + “:验证成功 n”;
 // 读取扇区中的块
 bCount = mfc.getBlockCountInSector(j);
 bIndex = mfc.sectorToBlock(j);
 for (int i = 0; i < bCount; i++) {
 byte[] data = mfc.readBlock(bIndex);
 metaInfo += “Block” + bIndex + ” : ”
 + bytesToHexString(data) + “n”;
 bIndex++;
 }
 } else {
 metaInfo += “Sector” + j + “:验证失败 n”;
 }
 }
 promt.setText(metaInfo);
 } catch (Exception e) {
 e.printStackTrace();
 }
 }
```
关于 MifareClassic 卡的背景介绍：数据分为 16 个区 (Sector) ,每个区有 4 个块 (Block) ，每个块可以存放 16 字节的数据。
每个区最后一个块称为 Trailer，主要用来存放读写该区 Block 数据的 Key，可以有 A，B 两个 Key，每个 Key 长度为 6 个字节，缺省的 Key 值一般为全 FF 或是 0. 由 MifareClassic.KEY_DEFAULT 定义。
因此读写 Mifare Tag 首先需要有正确的 Key 值（起到保护的作用），如果鉴权成功，然后才可以读写该区数据。
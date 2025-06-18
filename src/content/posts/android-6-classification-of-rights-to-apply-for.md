---
title: "Android 6.0需要申请的权限分类"
slug: "android-6-classification-of-rights-to-apply-for"
published: 2018-07-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
6.0 之前开发者申请各种权限，只需要在清单列表（AndroidManifest.xml）中进行声明就可以了。对开发者来说是相当便利，但对用户来说是体验不好，6.0 的权限换成了用户可以随时更改的操作，类似 IOS 的权限申请。
#### 常规的权限
>和以前一样，在清单中申请，这里不作累述
####需要申请的权限
google 是以权限组进行分类的，一旦组内的某个权限被赋予了，那么这个组的其他权限也将自动被赋予
<table border="1" cellpadding="2" cellspacing="0">
<tbody>
<tr>
<th scope="col">权限组</th>
<th scope="col">权限</th>
</tr>
<tr>
<td>
<code>android.permission-group.CALENDAR(日历数据)</code></td>
<td>
<ul>
<li><code>android.permission.READ_CALENDAR</code></li><li><code>android.permission.WRITE_CALENDAR</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.CAMERA(相机)</code></td>
<td>
<ul>
<li><code>android.permission.CAMERA</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.CONTACTS(联系人)</code></td>
<td>
<ul>
<li><code>android.permission.READ_CONTACTS</code></li><li><code>android.permission.WRITE_CONTACTS</code></li><li><code>android.permission.GET_ACCOUNTS</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.LOCATION(位置)</code></td>
<td>
<ul>
<li><code>android.permission.ACCESS_FINE_LOCATION</code></li><li><code>android.permission.ACCESS_COARSE_LOCATION</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.MICROPHONE(麦克风)</code></td>
<td>
<ul>
<li><code>android.permission.RECORD_AUDIO</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.PHONE(电话)</code></td>
<td>
<ul>
<li><code>android.permission.READ_PHONE_STATE</code></li><li><code>android.permission.CALL_PHONE</code></li><li><code>android.permission.READ_CALL_LOG</code></li><li><code>android.permission.WRITE_CALL_LOG</code></li><li><code>com.android.voicemail.permission.ADD_VOICEMAIL</code></li><li><code>android.permission.USE_SIP</code></li><li><code>android.permission.PROCESS_OUTGOING_CALLS</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.SENSORS(传感器)</code></td>
<td>
<ul>
<li><code>android.permission.BODY_SENSORS</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.SMS(短信)</code></td>
<td>
<ul>
<li><code>android.permission.SEND_SMS</code></li><li><code>android.permission.RECEIVE_SMS</code></li><li><code>android.permission.READ_SMS</code></li><li><code>android.permission.RECEIVE_WAP_PUSH</code></li><li><code>android.permission.RECEIVE_MMS</code></li><li><code>android.permission.READ_CELL_BROADCASTS</code></li></ul>
</td>
</tr>
<tr>
<td>
<code>android.permission-group.STORAGE(存储)</code></td>
<td>
<ul>
<li><code>android.permission.READ_EXTERNAL_STORAGE</code></li><li><code>android.permission.WRITE_EXTERNAL_STORAGE</code></li></ul>
</td>
</tr>
</tbody>
</table>
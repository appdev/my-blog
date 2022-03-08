---
title: "Android中GPS定位(获取经纬度)"
slug: "gps-positioning-in-android-obtaining-latitude-and-longitude"
date: 2018-06-27T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "AndroidGPS定位问题,众所周知是一个蛮麻烦的问题.当初我是新手,现在我也是新手,也搞了我头大,网上搜索了很多的例子,一直处于僵持阶段"

---
                
AndroidGPS定位问题,众所周知是一个蛮麻烦的问题.当初我是新手,现在我也是新手,也搞了我头大,网上搜索了很多的例子,一直处于僵持阶段,而现在终于搞定了,因为我现在只需要获取到经纬度就可以了,反正获取经纬度可以从我这篇文章中看看;上代码。

在AndroidManifest.xml中加入权限：
```xml
<uses-permission android:name=”android.permission.ACCESSFINELOCATION”/>
<uses-permission android:name=”android.permission.ACCESSCOARSELOCATION”/>
```
 


<!--more-->


```java
package com.example.tt;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

 @Override
 protected void onCreate(Bundle savedInstanceState) {
 super.onCreate(savedInstanceState);
 setContentView(R.layout.activity_main);

 Button button=(Button)findViewById(R.id.button1);
 button.setOnClickListener(new OnClickListener() {

 @Override
 public void onClick(View arg0) {
 // TODO Auto-generated method stub
 String serviceString=Context.LOCATION_SERVICE;
 LocationManager locationManager=(LocationManager)getSystemService(serviceString);
 String provider=LocationManager.GPS_PROVIDER;
 Location location=locationManager.getLastKnownLocation(provider);
 getLocationInfo(location);
 locationManager.requestLocationUpdates(provider, 2000, 0, locationListener);
 }
 });
 }
 private void getLocationInfo(Location location) {
 String latLongInfo;
 TextView lo=(TextView)findViewById(R.id.textView1);
 if(location!=null){
 double lat=location.getLatitude();
 double lng=location.getLongitude();
 latLongInfo=”Lat:”+lat+”nLong:”+lng;
 lo.setText(latLongInfo);
 }else {
 latLongInfo=”No location found”;
 lo.setText(latLongInfo);
 }
 }
 private final LocationListener locationListener =new LocationListener() {
 @Override
 public void onStatusChanged(String provider, int status, Bundle extras) {
 // TODO Auto-generated method stub

 }
 @Override
 public void onProviderEnabled(String provider) {
 getLocationInfo(null);

 }
 @Override
 public void onProviderDisabled(String provider) {
 getLocationInfo(null);
 }
 @Override
 public void onLocationChanged(Location location) {
 getLocationInfo(location);
 Toast.makeText(MainActivity.this, “位置改变了::::::::::::”, 3000).show();
 }
 };
}
```

当需要使用基站定位时,可以将String provider=LocationManager.GPS_PROVIDER;改为**String provider=LocationManager.NETWORK_PROVIDER;
**
具体如果还要判断GPS搜索不到时切换基站定位,那样的功能就不要我写了,新手都应该会.
还有就是如果用到Google定位到哪个城市地点什么的,也easy了。
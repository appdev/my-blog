---
title: "unable to connect to 5555: connection refused"
slug: "unable-to-connect-to-5555-connection-refused"
published: 2018-07-17T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
I had the same issue since the android 6 upgrading. I noticed that for some reason the device is playing "hard to get" when you try to contact it over WIFI.
Try these following steps:
Make sure that Aggressive Wi-Fi to Cellular handover under Networking section in the device's developer options is turned off.
ping continuously from your pc to the device to make sure it's not in network idle mode ping -t 192.168.1.10 (windows cmd), unlock the device and even try to surf to some website just to make it get out of the network idle.
If ping doesn't work, turn off / on Android Wifi and go back to step 2.
When it replies to the ping, connect it via usb, and:
```
adb usb
adb tcpip 5555
adb connect 192.168.10.1:5555
```
In casr it's still not connected, try to switch the usb connection mode as MTP / PTP / Camera while the device is connected through usb and repeat these steps over again...
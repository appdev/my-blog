---
title: "Android调用手机中的应用市场"
slug: "Android-calls-the-app-market-in-mobile-phones"
date: 2018-07-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "javapublicstaticvoidgoToMarket(Contextcontext,StringpackageName"

---
                
```java
public static void goToMarket(Context context, String packageName) {
        Uri uri = Uri.parse("market://details?id=" + packageName);
        Intent goToMarket = new Intent(Intent.ACTION_VIEW, uri);
        try {
            context.startActivity(goToMarket);
        } catch (ActivityNotFoundException e) {
            e.printStackTrace();
        }
    }
```
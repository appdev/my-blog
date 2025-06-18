---
title: "Android清除本地数据缓存代码"
slug: "android-scavenging-local-data-cache-code"
published: 2018-06-28T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
/* 
 * 文 件 名：DataCleanManager.java  
 * 描    述：主要功能有清除内/外缓存，清除数据库，清除 sharedPreference，清除 files 和清  除自定义目录  
 */  
<!--more-->
```java
import java.io.File;  
import android.content.Context;  
import android.os.Environment;  
/** * 本应用数据清除管理器 */  
public class DataCleanManager {  
    /** * 清除本应用内部缓存 (/data/data/com.xxx.xxx/cache) * * @param context */  
    public static void cleanInternalCache(Context context) {  
        deleteFilesByDirectory(context.getCacheDir());  
    }  
    /** * 清除本应用所有数据库 (/data/data/com.xxx.xxx/databases) * * @param context */  
    public static void cleanDatabases(Context context) {  
        deleteFilesByDirectory(new File(“/data/data/”  
                + context.getPackageName() + “/databases”));  
    }  
    /** 
     * * 清除本应用 SharedPreference(/data/data/com.xxx.xxx/shared_prefs) * * @param 
     * context 
     */  
    public static void cleanSharedPreference(Context context) {  
        deleteFilesByDirectory(new File(“/data/data/”  
                + context.getPackageName() + “/shared_prefs”));  
    }  
    /** * 按名字清除本应用数据库 * * @param context * @param dbName */  
    public static void cleanDatabaseByName(Context context, String dbName) {  
        context.deleteDatabase(dbName);  
    }  
    /** * 清除/data/data/com.xxx.xxx/files 下的内容 * * @param context */  
    public static void cleanFiles(Context context) {  
        deleteFilesByDirectory(context.getFilesDir());  
    }  
    /** 
     * * 清除外部 cache 下的内容 (/mnt/sdcard/android/data/com.xxx.xxx/cache) * * @param 
     * context 
     */  
    public static void cleanExternalCache(Context context) {  
        if (Environment.getExternalStorageState().equals(  
                Environment.MEDIA_MOUNTED)) {  
            deleteFilesByDirectory(context.getExternalCacheDir());  
        }  
    }  
    /** * 清除自定义路径下的文件，使用需小心，请不要误删。而且只支持目录下的文件删除 * * @param filePath */  
    public static void cleanCustomCache(String filePath) {  
        deleteFilesByDirectory(new File(filePath));  
    }  
    /** * 清除本应用所有的数据 * * @param context * @param filepath */  
    public static void cleanApplicationData(Context context, String… filepath) {  
        cleanInternalCache(context);  
        cleanExternalCache(context);  
        cleanDatabases(context);  
        cleanSharedPreference(context);  
        cleanFiles(context);  
        for (String filePath : filepath) {  
            cleanCustomCache(filePath);  
        }  
    }  
    /** * 删除方法 这里只会删除某个文件夹下的文件，如果传入的 directory 是个文件，将不做处理 * * @param directory */  
    private static void deleteFilesByDirectory(File directory) {  
        if (directory != null && directory.exists() && directory.isDirectory()) {  
            for (File item : directory.listFiles()) {  
                item.delete();  
            }  
        }  
    }  
}  
```
---
title: "解决Android拍照保存在系统相册不显示的问题"
slug: "solve-the-problem-that-android-photo-preservation-is-not-displayed-in-the-system-album"
published: 2018-07-08T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
可能大家都知道我们保存相册到 Android 手机的时候，然后去打开系统图库找不到我们想要的那张图片，那是因为我们插入的图片还没有更新的缘故，先讲解下插入系统图库的方法吧，很简单，一句代码就能实现
```
MediaStore.Images.Media.insertImage(getContentResolver(), mBitmap, "", ""); 
```
通过上面的那句代码就能插入到系统图库，这时候有一个问题，就是我们不能指定插入照片的名字，而是系统给了我们一个当前时间的毫秒数为名字，有一个问题郁闷了很久，我还是先把 insertImage 的源码贴出来吧
```
 /**
             * Insert an image and create a thumbnail for it.
             *
             * @param cr The content resolver to use
             * @param source The stream to use for the image
             * @param title The name of the image
             * @param description The description of the image
             * @return The URL to the newly created image, or <code>null</code> if the image failed to be stored
             *              for any reason.
             */
            public static final String insertImage(ContentResolver cr, Bitmap source,
                                                   String title, String description) {
                ContentValues values = new ContentValues();
                values.put(Images.Media.TITLE, title);
                values.put(Images.Media.DESCRIPTION, description);
                values.put(Images.Media.MIME_TYPE, "image/jpeg");
                Uri url = null;
                String stringUrl = null;    /* value to be returned */
                try {
                    url = cr.insert(EXTERNAL_CONTENT_URI, values);
                    if (source != null) {
                        OutputStream imageOut = cr.openOutputStream(url);
                        try {
                            source.compress(Bitmap.CompressFormat.JPEG, 50, imageOut);
                        } finally {
                            imageOut.close();
                        }
                        long id = ContentUris.parseId(url);
                        // Wait until MINI_KIND thumbnail is generated.
                        Bitmap miniThumb = Images.Thumbnails.getThumbnail(cr, id,
                                Images.Thumbnails.MINI_KIND, null);
                        // This is for backward compatibility.
                        Bitmap microThumb = StoreThumbnail(cr, miniThumb, id, 50F, 50F,
                                Images.Thumbnails.MICRO_KIND);
                    } else {
                        Log.e(TAG, "Failed to create thumbnail, removing original");
                        cr.delete(url, null, null);
                        url = null;
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Failed to insert image", e);
                    if (url != null) {
                        cr.delete(url, null, null);
                        url = null;
                    }
                }
                if (url != null) {
                    stringUrl = url.toString();
                }
                return stringUrl;
            }
```
上面方法里面有一个 title，我刚以为是可以设置图片的名字，设置一下，原来不是，郁闷，哪位高手知道 title 这个字段是干嘛的，告诉下小弟，不胜感激！
当然 android 还提供了一个插入系统相册的方法，可以指定保存图片的名字，我把源码贴出来吧
```
/** 
          * Insert an image and create a thumbnail for it. 
          * 
          * @param cr The content resolver to use 
          * @param imagePath The path to the image to insert 
          * @param name The name of the image 
          * @param description The description of the image 
          * @return The URL to the newly created image 
          * @throws FileNotFoundException 
          */  
         public static final String insertImage(ContentResolver cr, String imagePath,  
                 String name, String description) throws FileNotFoundException {  
             // Check if file exists with a FileInputStream  
             FileInputStream stream = new FileInputStream(imagePath);  
             try {  
                 Bitmap bm = BitmapFactory.decodeFile(imagePath);  
                 String ret = insertImage(cr, bm, name, description);  
                 bm.recycle();  
                 return ret;  
             } finally {  
                 try {  
                     stream.close();  
                 } catch (IOException e) {  
                 }  
             }  
         }  
```
啊啊，贴完源码我才发现，这个方法调用了第一个方法，这个 name 就是上面方法的 title，晕死，这下更加郁闷了，反正我设置 title 无效果，求高手为小弟解答，先不管了，我们继续往下说
上面那段代码插入到系统相册之后还需要发条广播  
`sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, Uri.parse("file://"+ Environment.getExternalStorageDirectory())));`  
上面那条广播是扫描整个 sd 卡的广播，如果你 sd 卡里面东西很多会扫描很久，在扫描当中我们是不能访问 sd 卡，所以这样子用户体现很不好，用过微信的朋友都知道，微信保存图片到系统相册并没有扫描整个 SD 卡，所以我们用到下面的方法
```
Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);     
 Uri uri = Uri.fromFile(new File("/sdcard/image.jpg"));     
 intent.setData(uri);     
 mContext.sendBroadcast(intent);    
或者用 MediaScannerConnection
[java] view plain copy
final MediaScannerConnection msc = new MediaScannerConnection(mContext, new MediaScannerConnectionClient() {     
  public void onMediaScannerConnected() {     
   msc.scanFile("/sdcard/image.jpg", "image/jpeg");     
  }     
  public void onScanCompleted(String path, Uri uri) {     
   Log.v(TAG, "scan completed");     
   msc.disconnect();     
  }     
 });     
```
也行你会问我，怎么获取到我们刚刚插入的图片的路径？呵呵，这个自有方法获取，`insertImage(ContentResolver cr, Bitmap source,String title, String description)`，这个方法给我们返回的就是插入图片的 Uri，我们根据这个 Uri 就能获取到图片的绝对路径
```
private  String getFilePathByContentResolver(Context context, Uri uri) {  
        if (null == uri) {  
            return null;  
        }  
        Cursor c = context.getContentResolver().query(uri, null, null, null, null);  
        String filePath  = null;  
        if (null == c) {  
            throw new IllegalArgumentException(  
                    "Query on " + uri + " returns null result.");  
        } try {  
            if ((c.getCount() != 1) || !c.moveToFirst()) {  
            } else {  
                filePath = c.getString(  
                        c.getColumnIndexOrThrow(MediaColumns.DATA));  
            }  
        } finally {  
            c.close();  
        }  
        return filePath;  
    }  
```
根据上面的那个方法获取到的就是图片的绝对路径，这样子我们就不用发送扫描整个 SD 卡的广播了，呵呵，写到这里就算是写完了，写的很乱，希望大家将就的看下，希望对你有帮助！
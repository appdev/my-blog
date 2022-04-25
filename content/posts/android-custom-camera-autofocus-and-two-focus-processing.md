---
title: "Android 自定义相机自动对焦、二次对焦处理"
slug: "android-custom-camera-autofocus-and-two-focus-processing"
date: 2018-07-06T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

cover: 
    image: "https://static.apkdv.com/blog/blog/1646726827543QQ20180706-114646.png"
    # alt: "alt text" # image alt text
    # caption: "display caption under cover" # display caption under cover
    relative: false # when using page bundles set this to true
---
                
由于android碎片化严重，而且各大厂商极有可能去修改相关API的实现，其中遇到了不少坑，包括实时相机高斯模糊，自动对焦的兼容问题，以及一系列性能问题。换过很多搜索引擎，访问过很多网站，访问过很多网站，拜读过很多代码，没有发现对于相机实时自动对焦特别完美的实现方式。现对相机的自动对焦问题单独做一个记录，算是对这部分的一个总结。也希望后人在这部分能够快速地解决问题，不必浪费过多的时间。测试手机包括：MX4 pro，小米4，华为荣耀3C等等。


<!--more-->

### 一些对焦方案的尝试
#### autoFocus()的尝试
```java
    private fun takePhoto() {
        mCamera?.apply {
            autoFocus { success, camera ->
                if (success) {
                    //前两个参数可以为空,第三个方法是照片的回调
                    try {
                        mCamera?.takePicture(null, null, mPictureCallback)
                    } catch (e: Exception) {
                        Log.e("Preview or takePicture failed")
                    }
                }
            }
        }
    }
```
在一部分手机上，始终只对焦一次，也就是说根本不能实现。
还见部分博客把autoFocus()方法放在Camera预览SurfaceView的surfaceChanged()中的一些实现，发现也只对焦了一次。
#### 设置对焦模式FOCUS_MODE_CONTINUOUS_PICTURE
![](https://static.apkdv.com/blog/blog/1646726827543QQ20180706-114646.png)
经过测试，发现大部分手机可以连续对焦，但是在对焦过程中屏幕会连续闪烁，而且体验极其不好。魅族MX4不支持此种方式的对焦。也就是说第二，第三种方案都要放弃。
#### 触摸对焦
```java
 /**
     * 手动聚焦
     *
     * @param point 触屏坐标
     */
    protected boolean onFocus(Point point, Camera.AutoFocusCallback callback) {
        if (mCamera == null) {
            return false;
        }

        Camera.Parameters parameters = null;
        try {
            parameters = mCamera.getParameters();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        //不支持设置自定义聚焦，则使用自动聚焦，返回

        if(Build.VERSION.SDK_INT >= 14) {

            if (parameters.getMaxNumFocusAreas() <= 0) {
                return focus(callback);
            }

            Log.i(TAG, "onCameraFocus:" + point.x + "," + point.y);

            //定点对焦
            List<Camera.Area> areas = new ArrayList<Camera.Area>();
            int left = point.x - 300;
            int top = point.y - 300;
            int right = point.x + 300;
            int bottom = point.y + 300;
            left = left < -1000 ? -1000 : left;
            top = top < -1000 ? -1000 : top;
            right = right > 1000 ? 1000 : right;
            bottom = bottom > 1000 ? 1000 : bottom;
            areas.add(new Camera.Area(new Rect(left, top, right, bottom), 100));
            parameters.setFocusAreas(areas);
            try {
                //本人使用的小米手机在设置聚焦区域的时候经常会出异常，看日志发现是框架层的字符串转int的时候出错了，
                //目测是小米修改了框架层代码导致，在此try掉，对实际聚焦效果没影响
                mCamera.setParameters(parameters);
            } catch (Exception e) {
                // TODO: handle exception
                e.printStackTrace();
                return false;
            }
        }


        return focus(callback);
    }

    private boolean focus(Camera.AutoFocusCallback callback) {
        try {
            mCamera.autoFocus(callback);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
```
### 自动对焦方案
#### 监听传感器，来自动对焦
打开了其他已经实现自定义相机而且能够完美对焦的app，一番操作后，发现很多app都是在我移动手机或者有轻微晃动才进行了第二次对焦，这不就是基于传感器实现的吗？
我们完全可以判断手机的运动状态啊，比如静止和移动。在移动一定时间后去对焦。 

```
import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

import java.util.Calendar;

public class SensorControler implements SensorEventListener {
    public static final String TAG = "SensorControler";
    private SensorManager mSensorManager;
    private Sensor mSensor;

    private int mX, mY, mZ;
    private long lastStaticStamp = 0;
    Calendar mCalendar;

    boolean isFocusing = false;
    boolean canFocusIn = false;  //内部是否能够对焦控制机制
    boolean canFocus = false;

    public static final int DELEY_DURATION = 500;

    public static final int STATUS_NONE = 0;
    public static final int STATUS_STATIC = 1;
    public static final int STATUS_MOVE = 2;
    private int STATUE = STATUS_NONE;

    private CameraFocusListener mCameraFocusListener;

    private static SensorControler mInstance;

    private int foucsing = 1;  //1 表示没有被锁定 0表示被锁定

    private SensorControler() {
        mSensorManager = (SensorManager) context.getSystemService(Activity.SENSOR_SERVICE);
        mSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);// TYPE_GRAVITY
    }

    private static Context context;
    public static SensorControler getInstance(Context _context) {
        context = _context;
        if (mInstance == null) {
            mInstance = new SensorControler();
        }
        return mInstance;
    }

    public void setCameraFocusListener(CameraFocusListener mCameraFocusListener) {
        this.mCameraFocusListener = mCameraFocusListener;
    }

    public void onStart() {
        restParams();
        canFocus = true;
        mSensorManager.registerListener(this, mSensor,
                SensorManager.SENSOR_DELAY_NORMAL);
    }

    public void onStop() {
        mSensorManager.unregisterListener(this, mSensor);
        canFocus = false;
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }



    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor == null) {
            return;
        }

        if (isFocusing) {
            restParams();
            return;
        }

        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            int x = (int) event.values[0];
            int y = (int) event.values[1];
            int z = (int) event.values[2];
            mCalendar = Calendar.getInstance();
            long stamp = mCalendar.getTimeInMillis();// 1393844912
            int second = mCalendar.get(Calendar.SECOND);// 53
            if (STATUE != STATUS_NONE) {
                int px = Math.abs(mX - x);
                int py = Math.abs(mY - y);
                int pz = Math.abs(mZ - z);
//                Log.d(TAG, "pX:" + px + "  pY:" + py + "  pZ:" + pz + "    stamp:"
//                        + stamp + "  second:" + second);
                double value = Math.sqrt(px * px + py * py + pz * pz);

//                Log.d("TAG", "value:"+value);
                Log.d("TAG", "canFocusIn:"+canFocusIn);
//                Log.d("TAG", "stamp - lastStaticStamp > DELEY_DURATION:"+(stamp - lastStaticStamp > DELEY_DURATION));
//                Log.d("TAG", "!isFocusing:"+!isFocusing);
                if (value > 1.4) {
//                    textviewF.setText("检测手机在移动..");
//                    Log.i(TAG,"mobile moving");
                    STATUE = STATUS_MOVE;
                } else {
//                    textviewF.setText("检测手机静止..");
//                    Log.i(TAG,"mobile static");
                    //上一次状态是move，记录静态时间点
                    if (STATUE == STATUS_MOVE) {
                        lastStaticStamp = stamp;
                        canFocusIn = true;
                    }

                    if (canFocusIn) {
                        if (stamp - lastStaticStamp > DELEY_DURATION) {
                            //移动后静止一段时间，可以发生对焦行为
                            if (!isFocusing) {
                                canFocusIn = false;
                                if (mCameraFocusListener != null) {
                                    mCameraFocusListener.onFocus();
                                }
                            }
                        }
                    }

                    STATUE = STATUS_STATIC;
                }
            } else {
                lastStaticStamp = stamp;
                STATUE = STATUS_STATIC;
            }

            mX = x;
            mY = y;
            mZ = z;
        }
    }

    private void restParams() {
        STATUE = STATUS_NONE;
        canFocusIn = false;
        mX = 0;
        mY = 0;
        mZ = 0;
    }

    /**
     * 对焦是否被锁定
     *
     * @return
     */
    public boolean isFocusLocked() {
        if(canFocus) {
            return foucsing <= 0;
        }
        return false;
    }

    /**
     * 锁定对焦
     */
    public void lockFocus() {
        isFocusing = true;
        foucsing--;
        Log.i(TAG, "lockFocus");
    }

    /**
     * 解锁对焦
     */
    public void unlockFocus() {
        isFocusing = false;
        foucsing++;
        Log.i(TAG, "unlockFocus");
    }

    public void restFoucs() {
        foucsing = 1;
    }

    public interface CameraFocusListener {
        void onFocus();
    }
}
```
用法：在需要传感器触发的位置，设置回调监听
```
//自动聚焦监听
SensorControler.getInstance(getContext()).setCameraFocusListener(new SensorControler.CameraFocusListener() {
    @Override
    public void onFocus() {
        mCameraView.onFocus(new Point(getWidth() / 2, getHeight() / 2), autoFocusCallback);
        //设置聚焦
        mFocusImageView.startFocus(new Point(getWidth() / 2, getHeight() / 2));
    }
});
```
#### Google的方案
这样基本可以解决所有的对焦问题，但是有人反应：
> 在5.0上是这样,7.0上就看出问题来了,实时浏览画面问题很多,是他影响的.

后来发现[Google Android](https://developer.android.com/reference/android/hardware/Camera.Parameters#FOCUS_MODE_CONTINUOUS_PICTURE)已经能给出了解决方案：
> Applications can call Camera.autoFocus(AutoFocusCallback) in this mode. If the autofocus is in the middle of scanning, the focus callback will return when it completes. If the autofocus is not scanning, the focus callback will immediately return with a boolean that indicates whether the focus is sharp or not. The apps can then decide if they want to take a picture immediately or to change the focus mode to auto, and run a full autofocus cycle. The focus position is locked after autoFocus call. If applications want to resume the continuous focus, cancelAutoFocus must be called. Restarting the preview will not resume the continuous autofocus. To stop continuous focus, applications should change the focus mode to other modes.


只需要在拍照完成之后，再次预览之前调用`cancelAutoFocus`就好了
```
  private fun startPreview() {
        //释放对焦
        mCamera?.cancelAutoFocus()
        try {
            mCamera?.setPreviewDisplay(surface_view.holder)
            mCamera?.setDisplayOrientation(90)
            mCamera?.startPreview()
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
```
自己测试小米手机上6.0\8.0均正常

---
Google的方案看似很简单，但是在某些手机上会存在一些兼容问题，不过自从Android6.0之后兼容问题也少了很多，可以多次试一下。用传感器来做可能效果没那么好，但是基本上每台机器都可以实现的。
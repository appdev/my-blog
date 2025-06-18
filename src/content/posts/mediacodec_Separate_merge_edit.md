---
title: "MediaCodec实现视频音视频分离、合并、编辑、压缩"
slug: "mediacodec_Separate_merge_edit"
published: 2018-11-05T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
### 介绍
android 上视频操作，主要有 OpenGL、FFmpeg、以及 4.1 之后的 `MediaCodec`,`MediaCodec`是 Android 上一个用来直接访问设备的媒体编解码器的接口，因为有硬件加速的效果，所以使用起来无论是效率，还是耗时，都会比 FFmpeg 好很多，今天了着重谈谈`MediaCodec` 的使用。
与 `MediaCodec` 相关，经常配合一起使用的媒体处理类主要有：
`MediaExtractor`用于音视频分路，和 `MediaMuxer`正好是反过程。`MediaFormat`用于描述多媒体数据的格式。`MediaRecorder` 用于录像 + 压缩编码，生成编码好的文件如 mp4, 3gpp，视频主要是用于录制`Camera preview`。`MediaPlayer`用于播放压缩编码后的音视频文件。`AudioRecord`用于录制 PCM 数据。`AudioTrack` 用于播放 PCM 数据
### 音视频分离
视频的分离和合成主要是用 `MediaExtractor`和`MediaMuxer` 这两个类，来处理视频中的视频信道和音频信道的拆分和组合。
逻辑大概如下：
#### 1.初始化对象，设置源文件 
` var extractor = MediaExtractor()`
` extractor.setDataSource(videoPath.absolutePath)`
#### 2.获取要追踪的 TrackIndex 信道 track index 
```java
//获得信道数
  val trackCount = extractor.trackCount
  var videoTrack = -1
        var audioTrack = -1
        for (i in 0 until trackCount) {
            val trackFormat = extractor.getTrackFormat(i)
            val format = trackFormat.getString(MediaFormat.KEY_MIME)
            //视频信道
            if (format.startsWith("video/")) {
                videoTrack = i
            }
            if (format.startsWith("audio/")) {
                audioTrack = i
            }
        }
```
打开 `MediaFormat` 可以看到所有支持的 mime
```java
  public static final String MIMETYPE_VIDEO_VP8 = "video/x-vnd.on2.vp8";
    public static final String MIMETYPE_VIDEO_VP9 = "video/x-vnd.on2.vp9";
    public static final String MIMETYPE_VIDEO_AVC = "video/avc";
    public static final String MIMETYPE_VIDEO_HEVC = "video/hevc";
    public static final String MIMETYPE_VIDEO_MPEG4 = "video/mp4v-es";
    public static final String MIMETYPE_VIDEO_H263 = "video/3gpp";
    public static final String MIMETYPE_VIDEO_MPEG2 = "video/mpeg2";
    public static final String MIMETYPE_VIDEO_RAW = "video/raw";
    public static final String MIMETYPE_VIDEO_DOLBY_VISION = "video/dolby-vision";
    public static final String MIMETYPE_VIDEO_SCRAMBLED = "video/scrambled";
    public static final String MIMETYPE_AUDIO_AMR_NB = "audio/3gpp";
    public static final String MIMETYPE_AUDIO_AMR_WB = "audio/amr-wb";
    public static final String MIMETYPE_AUDIO_MPEG = "audio/mpeg";
    public static final String MIMETYPE_AUDIO_AAC = "audio/mp4a-latm";
    public static final String MIMETYPE_AUDIO_QCELP = "audio/qcelp";
    public static final String MIMETYPE_AUDIO_VORBIS = "audio/vorbis";
    public static final String MIMETYPE_AUDIO_OPUS = "audio/opus";
    public static final String MIMETYPE_AUDIO_G711_ALAW = "audio/g711-alaw";
    public static final String MIMETYPE_AUDIO_G711_MLAW = "audio/g711-mlaw";
    public static final String MIMETYPE_AUDIO_RAW = "audio/raw";
    public static final String MIMETYPE_AUDIO_FLAC = "audio/flac";
    public static final String MIMETYPE_AUDIO_MSGSM = "audio/gsm";
    public static final String MIMETYPE_AUDIO_AC3 = "audio/ac3";
    public static final String MIMETYPE_AUDIO_EAC3 = "audio/eac3";
    public static final String MIMETYPE_AUDIO_SCRAMBLED = "audio/scrambled";
```
#### 3.得到每一帧的时间差
**注意：音频 视频的帧数时间差要分别算**
```java
mediaExtractor.readSampleData(byteBuffer, 0)
        //跳过 I 帧，要 P 帧（视频是由个别 I 帧和很多 P 帧组成）h264 编码中有 IBP 帧 I 为关键帧。
        if (mediaExtractor.sampleFlags == MediaExtractor.SAMPLE_FLAG_SYNC) {
            mediaExtractor.advance()
        }
        mediaExtractor.readSampleData(byteBuffer, 0)
        // 得到第一帧的 PTS
        val firstVideoPTS = mediaExtractor.sampleTime
        //下一帧
        mediaExtractor.advance()
        mediaExtractor.readSampleData(byteBuffer, 0)
        val SecondVideoPTS = mediaExtractor.sampleTime
        val sampleTime = Math.abs(SecondVideoPTS - firstVideoPTS)
        // 重新切换此信道，不然上面跳过了 3 帧，造成前面的帧数模糊
        mediaExtractor.unselectTrack(videoTrack)
        mediaExtractor.selectTrack(videoTrack)
```
#### 4.依据信道 index 获取信道 ByteBuffer 数据，并进行处理
```java
        //一次缓冲大小
        val byteBuffer = ByteBuffer.allocate(500 * 1024)
        //创建 mediaMuxer
        val mediaMuxer = MediaMuxer(outVideoPath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        //切换信道
        extractor.selectTrack(videoTrack)
        val trackFormat = extractor.getTrackFormat(videoTrack)
        //追中次信道
        val index = mediaMuxer.addTrack(trackFormat)
        val bufferInfo = MediaCodec.BufferInfo()
        mediaMuxer.start()
        var videoSampleTime = getSampleTime(extractor, byteBuffer, videoTrack)
        while (true) {
            val data = extractor.readSampleData(byteBuffer, 0)
            if (data < 0) {
                Log.i("video", "分离结束")
                break
            }
            extractor.advance()
            bufferInfo.size = data
            bufferInfo.offset = 0
            bufferInfo.flags = extractor.sampleFlags
            bufferInfo.presentationTimeUs += videoSampleTime
            mediaMuxer.writeSampleData(index, byteBuffer, bufferInfo)
        }
        mediaMuxer.stop()
        mediaMuxer.release()
        extractor.release()
```
#### 分离完成
至此，视频、音频分离已经完成。记得在结尾释放 mediaMuxer、MediaExtractor。
### 视频合并
`MediaMuxer` 将音频和视频进行混合生成多媒体文件，缺点是支持一个 audio track 和一个 video track，而且仅支持 mp4 输出。可以用编辑视频，例如剪裁，加入背景音乐，搞笑音乐等
#### 音、视频合并
音视频合并同和分离基本操作相同，
- 初始化音频、视频的 MediaExtractor 对象，设置数据源
- 查找音频、视频的信道。
- 得到每一帧的时间差
- 通过 MediaMuxer 分别将音频、视频写入输出的文件中
下面是个完整的代码
```java
//分别初始化视频、音频的 Extractor
        val videoExtractor = MediaExtractor()
        videoExtractor.setDataSource(outVideoPath.absolutePath)
        val audioExtractor = MediaExtractor()
        audioExtractor.setDataSource(outAudioPath.absolutePath)
        val videoTrack = getTrack(videoExtractor, "video/")
        val audioTrack = getTrack(audioExtractor, "audio/")
        videoExtractor.selectTrack(videoTrack)
        audioExtractor.selectTrack(audioTrack)
        val videoBufferInfo = MediaCodec.BufferInfo()
        val audioBufferInfo = MediaCodec.BufferInfo()
        //写入新的视频
        if (outMergeVideoPath.exists())
            outMergeVideoPath.createNewFile()
        val byteBuffer = ByteBuffer.allocate(500 * 1024)
        val mediaMuxer = MediaMuxer(outMergeVideoPath.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        val writeVideoTrackIndex = mediaMuxer.addTrack(videoExtractor.getTrackFormat(videoTrack))
        val writeAudioTrackIndex = mediaMuxer.addTrack(audioExtractor.getTrackFormat(audioTrack))
        mediaMuxer.start()
        val videoSampleTime = getSampleTime(videoExtractor, byteBuffer, videoTrack)
        while (true) {
            val data = videoExtractor.readSampleData(byteBuffer, 0)
            if (data < 0) {
                break
            }
            videoBufferInfo.size = data
            videoBufferInfo.offset = 0
            videoBufferInfo.flags = videoExtractor.sampleFlags
            videoBufferInfo.presentationTimeUs += videoSampleTime
            mediaMuxer.writeSampleData(writeVideoTrackIndex, byteBuffer, videoBufferInfo)
            videoExtractor.advance()
        }
        val audioSampleTime = getSampleTime(audioExtractor, byteBuffer, audioTrack)
        while (true) {
            val data = audioExtractor.readSampleData(byteBuffer, 0)
            if (data < 0) {
                break
            }
            audioBufferInfo.size = data
            audioBufferInfo.offset = 0
            audioBufferInfo.flags = audioExtractor.sampleFlags
            audioBufferInfo.presentationTimeUs += audioSampleTime
            mediaMuxer.writeSampleData(writeAudioTrackIndex, byteBuffer, audioBufferInfo)
            audioExtractor.advance()
        }
        Log.i("video", "合并完成")
        mediaMuxer.stop()
        mediaMuxer.release()
        videoExtractor.release()
        audioExtractor.release()
```
需要注意的是**MediaMuxer 是不能直接写入 mp3 音乐格式的数据，但是 MediaMuxer 支持 aac 和 m4a 格式的音乐直接写入合成文件。**
如果需要 MP3 格式的音频混合，需要先解码->编码->写入
#### 多视频合并
方法和音视频合并基本相同，最初步骤都一样:
- 初始化音频、视频的 MediaExtractor 对象，设置数据源
- 查找音频、视频的信道。
- 得到每一帧的时间差
- 第一部分视频合并完成之后，记录自后的 PTS 时间`ptsOffset = videoInfo.presentationTimeUs + 10000L`
- 在合并之后的视频中加上时间偏移量` MediaCodec.BufferInfo.presentationTimeUs += (videoSampleTime + ptsOffset)`，同时记录最后的 PTS 时间。以此类推
### 视频裁切
关键帧预览，可以使用`MediaMetadataRetriever.getFrameAtTime(long timeUs, @Option int option)`获取视频的指定帧的图片，可以每隔 1 秒获取一张图片，对获取的 `Bitmap` 使用
`RecyclerView` 来展示。
#### 视频裁切
视频裁切仍然是通过 `MediaExtractor`和`MediaMuxer` 这两个类，方法和音视频合并基本相同，最初步骤都一样:
- 初始化音频、视频的 MediaExtractor 对象，设置数据源
- 查找音频、视频的信道。
- 得到每一帧的时间差
- **在设置的位置查找关键帧，`MediaExtractor.seekTo(timeUs, MediaExtractor.SEEK_TO_PREVIOUS_SYNC)`**有三种模式 `SEEK_TO_PREVIOUS_SYNC`、`SEEK_TO_NEXT_SYNC`、`SEEK_TO_CLOSEST_SYNC` 具体使用哪种模式可以根据需要，
- 通过 MediaMuxer 分别将音频、视频写入输出的文件中
### 压缩
...待续

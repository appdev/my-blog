---
title: "在视频列表中，实现对当前显示的视频的自动播放、跟踪、暂停"
slug: "video-listplayback-tracking-and-pause-of-the-video"
date: 2018-08-14T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false

---
                
简单说一下原理，当`RecycleView`处于停滞状态的时候,通过`findFirstVisibleItemPosition()` `findLastVisibleItemPosition()`取出所有可视的Item，通过recyclerView.getChildAt(i)取出相应的Item的布局**recyclerView.getChildAt(0)取出的永远是当前可见的第一个**，在对所有的可见的item中的视频播放控件的可见区域作对比这里是通过`Rect`作比较的，如果有多个完整可见的视频播放控件，则可以比较视频播放控件是否在屏幕中央，距离屏幕中央的距离确认。


```java

/**
 * Created by LengYue on 2017/9/16.
 */

public class VideoPlayListener extends RecyclerView.OnScrollListener {

    private static final String TAG = "VideoPlayListener";
    private ArrayList<View> mViews;
    private IDataType mDataType;

    public VideoPlayListener(IDataType mDataType) {
        super();
        mViews = new ArrayList<>();
        this.mDataType = mDataType;
    }

    
    @Override
    public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
        super.onScrollStateChanged(recyclerView, newState);
        LinearLayoutManager manager = (LinearLayoutManager) recyclerView.getLayoutManager();
        //有当RecyclerView停止滑动时候才进行计算。
        if (newState == RecyclerView.SCROLL_STATE_IDLE) {
            int first = manager.findFirstVisibleItemPosition();
            int last = manager.findLastVisibleItemPosition();
            autoPlayVideo(recyclerView, first, last - first + 1, manager);
            stopPlay(first, last);
        }

    }

    @Override
    public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
        super.onScrolled(recyclerView, dx, dy);
    }


    /**
     * 计算当前屏幕中显示的item
     * (如果存在其他类型的item---优先判断item type 是否是视频)
     * 如果有完整显示的item 且仅有一个，判断item type 是否是视频,如果有多个 先判断item type 是否是视频 优先播放第一个
     * 根据以上规则，则每次只需要寻找第一个完全现实的视频item即可
     * <p>
     * 如果没有完整的item 则判断哪个显示的多，播放显示的多的item
     * 当正在播放的item滑出屏幕的时候则停止播放
     */
    private void autoPlayVideo(RecyclerView recyclerView, int first, int totle, LinearLayoutManager manager) {
        mViews.clear();
        for (int i = 0; i < totle; i++) {
            //提取可视item中是视频的
            if (mDataType.getDataType(i + first) && recyclerView.getChildAt(i) != null) {
                mViews.add(recyclerView.getChildAt(i));
            }
        }

        int maxHeight = 0;
        View maxHeightView = null;
        //对item分析
        if (!mViews.isEmpty()) {
            for (View view : mViews) {
                if (view.findViewById(R.id.videoplayer) != null) {
                    EmptyControlVideo video = view.findViewById(R.id.videoplayer);
                    Rect rect = new Rect();
                    video.getLocalVisibleRect(rect);
                    if (rect.top == 0 && rect.bottom == video.getHeight()) {
                        //play 发现全部显示的item 清除其他数据
                        maxHeight = 0;
                        maxHeightView = null;
                        playVideo(video,manager.getPosition(view));
                        break;
                    }
                    //比较每个item的可视高度
                    if (rect.bottom > maxHeight && rect.bottom >= (video.getHeight() / 4)) {
                        maxHeight = rect.bottom;
                        maxHeightView = view;
                    }
                }
            }
            //noinspection ConstantConditions
            if (maxHeight != 0 && maxHeightView != null) {
                //play
                playVideo(maxHeightView.findViewById(R.id.videoplayer),manager.getPosition(maxHeightView));
            }
        }
    }


    private void stopPlay(int firstVisibleItem, int lastVisibleItem) {
        //大于0说明有播放
        if (GSYVideoManager.instance().getPlayPosition() >= 0) {
            //当前播放的位置
            int position = GSYVideoManager.instance().getPlayPosition();
            //对应的播放列表TAG
            if (GSYVideoManager.instance().getPlayTag().equals(VideoItemViewBinder.TAG)
                    && (position < firstVisibleItem || position > lastVisibleItem)) {

                //如果滑出去了上面和下面就是否，和今日头条一样
                GSYVideoPlayer.releaseAllVideos();
//                mAdapter.notifyDataSetChanged();
            }
        }
    }

    /**
     * 播放视频
     *
     * @param video 播放控件
     */
    private void playVideo(EmptyControlVideo video, int videoPosition) {
        AudioPlayer.getInstance().pause();
        if (video != null) {
            // 有正在播放的 并且 正在播放的不是当前需要播放的 停止播放
            if (GSYVideoManager.instance().getPlayPosition() >= 0 && GSYVideoManager.instance().getPlayPosition() != videoPosition) {
                GSYVideoPlayer.releaseAllVideos(); //有正在播放的媒体 停止！
            }
            //播放当前视频 如果当前视频正在不放则不处理，否则播放当前item视频
            if (GSYVideoManager.instance().getPlayPosition() != videoPosition)
                video.startPlayLogic();
        }
    }

    public interface IDataType {
        boolean getDataType(int position);
    }
}

```
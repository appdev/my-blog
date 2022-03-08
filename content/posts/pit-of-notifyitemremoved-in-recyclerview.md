---
title: "RecyclerView里notifyItemRemoved的坑"
slug: "pit-of-notifyitemremoved-in-recyclerview"
date: 2018-08-14T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "RecyclerView很多时候是展示静态的数据，并不会有删除的操作，讲到RecyclerView时，会提到它提供了一个很好的展现删除操作动"

---
                
RecyclerView很多时候是展示静态的数据，并不会有删除的操作，讲到RecyclerView时，会提到它提供了一个很好的展现删除操作动画的函数，代码片段一般是这样的
```
@Override
        public void onBindViewHolder(final CommonViewHolder holder, final int position) {   
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    contentList.remove(position);
                    notifyItemRemoved(position);            
                }
            });
        }
```
这样写的话，很快会产生数据删除错乱和超出索引异常导致崩溃。 
原因是函数里面的传入的参数position，它是在进行onBind操作时确定的，在删除单项后，已经出现在画面里的项不会再有调用onBind机会，这样它保留的position一直是未进行删除操作前的postion值。 
对于尚未进入画面的单项来说，它会使用新的position值，这个值是正确的，如果在单项里加上下面的代码
```
  holder.textView.setText(contentList.get(position) + "#" + String.valueOf(position));
```
在删除第一屏的一项后，向上滚动，会发现新滚上来的一行和它上面的一行的textview显示是一样的。

解决办法也很简单
先remove,再notifyItemRemoved， 最后再notifyItemRangeChanged 
```
remove：把数据从list中remove掉， 
notifyItemRemoved：显示动画效果 
notifyItemRangeChanged：对于被删掉的位置及其后range大小范围内的view进行重新onBindViewHolder
```
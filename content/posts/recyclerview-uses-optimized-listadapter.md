---
title: "RecyclerView使用优化的ListAdapter"
slug: "recyclerview-uses-optimized-listadapter"
date: 2021-02-22T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "前言ListAdapter发布很久了，但是一直没有机会使用，这次终于因为性能问题对项目进行优化，再次做一下笔记，相比传统的Adapte"

---
                
## 前言
ListAdapter发布很久了，但是一直没有机会使用，这次终于因为性能问题对项目进行优化，再次做一下笔记，相比传统的Adapter，它能够用较少的代码实现更多的RecylerView的动画，并且可以自动存储之前的list。并且ListAdapter还带有异步的DiffUtil的工具，只有当items变化的时候进行刷新，而不用刷新整个list，这无疑能大大提高RecyclerView的性能。

## 具体实现
在项目具体实现中，如果原先使用的是RecyclerView.Adapter， 则替换起来非常简单，只需要将继承改成ListAdapter即可。
```java
public abstract class ListAdapter<T, VH extends RecyclerView.ViewHolder>
        extends RecyclerView.Adapter<VH>{
...
}
```
很明显，也只是多了一层继承（Android loves extends)。具体使用跟原来的实现差别并不大，不过多了些东西，下面列举一下。

### 构造方法变化
构造方法默认要实现DiffUtil.ItemCallback, 用于计算list的两个非空item的不同。具体要写两个抽象方法：

判断两个Objects 是否代表同一个item对象， 一般使用Bean的id比较
```java
public abstract boolean areItemsTheSame(T oldItem, T newItem);
public abstract boolean areContentsTheSame(T oldItem, T newItem);
```
DiffUtil.ItemCallback的实现正是ListAdapter拓展类实现的精髓所在，它根据判断对象的一致性和对象的内容是否相同来进行UI的刷新和动画的实现，在性能方面，一般情况下当然是可以有所提升的。

### 提交数据集合
使用了ListAdapter， 相比RecyclerView.Adapter， 另一个好处就是不用构建内部的数据集合了，很简单直接adapter::submitList即可，而获取item，则使用getItem(position)即可。
```java
//源码：提交list数据
public void submitList(List<T> list) {
	mHelper.submitList(list);
}

//源码：获取当前对象
protected T getItem(int position) {
	return mHelper.getCurrentList().get(position);
}
```
### 对于分页
数据分页我们当然要摒弃原来的办法，拥抱PagedListAdapter， 该方法比较类似ListAdapter, 唯一不同的就是提交数据的时候，提交的是PagedList(用于构建分页的类，对此不了解的话，可以查看相应的API)。

```java
//源码：提交分页数据
public void submitList(PagedList<T> pagedList) {
	mDiffer.submitList(pagedList);
}
```
对于分页，要了解的东西其实还挺多的，这里不一一赘述。因为跟传统分页稍微有些不同，要适应起来要花点时间的。但是非常建议大家使用，无论是请求的分页，或者结合数据库使用（最好结合Room使用）。

## 源码部分剖析
对于一个新的类或工具，我们当然尽量不仅仅满足于使用，还要进来去深入了解其内部机理，这样才会在未来使用中遇到问题解决起来何以游刃有余。

对于ListAdapter， 本身不复杂， 其实我们更多的了解一下一个工具类`AsyncListDiffer`即可， 这是精髓所在。

我们会看到源码有这么一个东西——AsyncListDiffer,除了这个，整个类代码实现相当简洁。

```java
//用于计算提交的两个lists的不同，在后台进行
private final AsyncListDiffer<T> mHelper;
```
每次adapter submit 数据的时候，该帮助类都会在后台计算， 并发送数据改变的信号(signal)。而在ListAdapter内封装有AsyncListDiffer的默认实现，而如果了解了该工具类的使用之后，我们完全可以撇开ListAdaper自己来封装一个Adapter（当然一般情况下我们还是建议使用ListAdapter, 除非有特殊要求，不然谁无聊去写这么多代码）.

下面我们分析一下submit 数据的时候，该工具类做了什么事情呢？
```java
public void submitList(final List<T> newList) {
	if (newList == mList) {
                //同样一个集合，当然不做改变，直接返回即可。
		return;
	}

        //每次提交数据，增加调度代, 因为是后台计算内容， 我们最后只要刷新当代内容即可。
	final int runGeneration = ++mMaxScheduledGeneration;

        //如果list为null，相当remove数据。
	if (newList == null) {
		int countRemoved = mList.size();
		mList = null;
		mReadOnlyList = Collections.emptyList();
		//刷新remove
		mUpdateCallback.onRemoved(0, countRemoved);
		return;
	}

	// 第一次插入数据
	if (mList == null) {
		mList = newList;
		mReadOnlyList = Collections.unmodifiableList(newList);
		mUpdateCallback.onInserted(0, newList.size());
		return;
	}

	final List<T> oldList = mList;
        //后台操作，使用Executor类
	mConfig.getBackgroundThreadExecutor().execute(new Runnable() {
			@Override
			public void run() {
                        //计算不同
			final DiffUtil.DiffResult result = DiffUtil.calculateDiff(new DiffUtil.Callback() {
					@Override
					public int getOldListSize() {
					    return oldList.size();
					}

					@Override
					public int getNewListSize() {
					    return newList.size();
					}

					@Override
					public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
					    return mConfig.getDiffCallback().areItemsTheSame(
							oldList.get(oldItemPosition), newList.get(newItemPosition));
					}

					@Override
					public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
					    return mConfig.getDiffCallback().areContentsTheSame(
							oldList.get(oldItemPosition), newList.get(newItemPosition));
					}

					@Nullable
						@Override
						public Object getChangePayload(int oldItemPosition, int newItemPosition) {
							return mConfig.getDiffCallback().getChangePayload(
									oldList.get(oldItemPosition), newList.get(newItemPosition));
						}
			});
                        //回到主线程刷新
			mConfig.getMainThreadExecutor().execute(new Runnable() {
					@Override
					public void run() {
					if (mMaxScheduledGeneration == runGeneration) {
					   latchList(newList, result);
					}
					}
					});
			}
	});
}

private void latchList(@NonNull List<T> newList, @NonNull DiffUtil.DiffResult diffResult) {
	mList = newList;
	// notify last, after list is updated
	mReadOnlyList = Collections.unmodifiableList(newList);
	diffResult.dispatchUpdatesTo(mUpdateCallback);
}
```
提交数据的过程代码看起来虽然很多，但是基本就是几步：

对list进行初始判断（是否新数据，是否为空）
后台计算list是否相同
回主线程刷新数据
那么，它是怎么计算list的不同的呢？我们看看这段代码：
```java
//detectMoves 表示是否检测item 移动
public static DiffResult calculateDiff(Callback cb, boolean detectMoves) {
	final int oldSize = cb.getOldListSize();
	final int newSize = cb.getNewListSize();

	final List<Snake> snakes = new ArrayList<>();

	// instead of a recursive implementation, we keep our own stack to avoid potential stack
	// overflow exceptions
	final List<Range> stack = new ArrayList<>();

	stack.add(new Range(0, oldSize, 0, newSize));

	final int max = oldSize + newSize + Math.abs(oldSize - newSize);
	// allocate forward and backward k-lines. K lines are diagonal lines in the matrix. (see the
	// paper for details)
	// These arrays lines keep the max reachable position for each k-line.
	final int[] forward = new int[max * 2];
	final int[] backward = new int[max * 2];

	// We pool the ranges to avoid allocations for each recursive call.
	final List<Range> rangePool = new ArrayList<>();
	while (!stack.isEmpty()) {
		final Range range = stack.remove(stack.size() - 1);
		final Snake snake = diffPartial(cb, range.oldListStart, range.oldListEnd,
				range.newListStart, range.newListEnd, forward, backward, max);
		if (snake != null) {
			if (snake.size > 0) {
				snakes.add(snake);
			}
			// offset the snake to convert its coordinates from the Range's area to global
			snake.x += range.oldListStart;
			snake.y += range.newListStart;

			// add new ranges for left and right
			final Range left = rangePool.isEmpty() ? new Range() : rangePool.remove(
					rangePool.size() - 1);
			left.oldListStart = range.oldListStart;
			left.newListStart = range.newListStart;
			if (snake.reverse) {
				left.oldListEnd = snake.x;
				left.newListEnd = snake.y;
			} else {
				if (snake.removal) {
					left.oldListEnd = snake.x - 1;
					left.newListEnd = snake.y;
				} else {
					left.oldListEnd = snake.x;
					left.newListEnd = snake.y - 1;
				}
			}
			stack.add(left);

			// re-use range for right
			//noinspection UnnecessaryLocalVariable
			final Range right = range;
			if (snake.reverse) {
				if (snake.removal) {
					right.oldListStart = snake.x + snake.size + 1;
					right.newListStart = snake.y + snake.size;
				} else {
					right.oldListStart = snake.x + snake.size;
					right.newListStart = snake.y + snake.size + 1;
				}
			} else {
				right.oldListStart = snake.x + snake.size;
				right.newListStart = snake.y + snake.size;
			}
			stack.add(right);
		} else {
			rangePool.add(range);
		}

	}
	// sort snakes
	Collections.sort(snakes, SNAKE_COMPARATOR);
	return new DiffResult(cb, snakes, forward, backward, detectMoves);

}
```
上面计算不同的代码要理解起来还是有些挑战的，主要用了[Myers Diff Algorithm][1], 而我们日常使用的git diff就用到了该算法。

总结
总体而言，ListAdapter还是比较方便使用的，我现在所有新项目基本都开始采用它，并且结合LiveData使用也会更加方便。

参考
[PagedListAdapter][2]
[ListAdapter][3]


  [1]: https://en.wikipedia.org/wiki/Diff
  [2]: https://developer.android.com/reference/android/arch/paging/PagedListAdapter
  [3]: https://developer.android.com/reference/android/support/v7/recyclerview/extensions/ListAdapter
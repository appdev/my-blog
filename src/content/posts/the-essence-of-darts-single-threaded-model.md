---
title: "Dart 单线程模型的本质"
slug: "the-essence-of-darts-single-threaded-model"
published: 2024-05-11T18:02:20+08:00
# aliases: ["/first"]
# categories: [Linux]
# tags: [tools]
showToc: true
TocOpen: true
draft: false
---
众所周知 `Dart`​ 运行在单线程模型下，单线程模型在代码运行的过程中任意时刻只有一个线程参与（但整个周期内可能会有多个线程），意味着代码指令是顺序执行的也就不存在并发的情况。单线程模型的优点是实现简单、无资源竞争导致的异常，缺点是如果以 阻塞（Blocking）模式运行单线程模型的效率会非常低。为了提升单线程的运行效率 `Dart`​ 是以 非阻塞（Non-blocking）的模式运行在单线程模型中，因此 `Dart`​ 的单线程模型有着较高的效率，同时避免了资源竞争的问题。
> 阻塞（Blocking）：当程序执行一个阻塞操作时，主线程会被挂起，直到该操作完成后才能继续执行后续的指令。在这期间，主线程无法执行其他的任务，因此程序会暂停执行。典型的阻塞操作包括文件 I/O、网络 I/O、等待用户输入等。在阻塞操作完成之前，主线程无法继续执行后续的指令。
> 非阻塞（Non-blocking）：相比之下，当程序执行一个非阻塞操作时，主线程会立即返回，而不会被挂起等待操作完成。即使操作没有完成，主线程也可以继续执行后续的指令。
线程的阻塞、非阻塞通常与线程同步、异步对应。
阻塞：当程序执行一个阻塞任务时，当前线程会被挂起，只有在得到调用结果之后才会继续执行，这个过程称之为「同步调用」。
非阻塞：当程序执行一个阻塞任务时，当前线程不会停止执行，而是继续执行后面的其它任务，阻塞结束后再继续执行之前未完成的任务，这个过程称之为「异步调用」。
​`Dart`​ 以非阻塞（Non-blocking）的单线程模型运行，自然也支持「同步」或「异步」调用。在 `Dart`​ 中一般用 `Future`​ 实例代表一个异步调用过程（也称为「Event Handler 宏任务」），每个 `Future`​ 异步任务具有相同的优先级且总是以先入先出（FIFO）的顺序执行。为了进一步提高响应实时性 `Dart`​ 提出了微任务（MicroTask）的概念，微任务优先级高于所有宏任务而微任务之间仍然以 FIFO 的顺序执行。假如某些宏任务需要满足一些前置条件，而微任务的存在保证了前置条件可以在宏任务执行前被设置，这进一步提高了 `Dart`​单线程模型的实时性与灵活性。
​`Dart`​ 非阻塞的单线程模型由 **事件循环（EventLoop）**  来实现，它包含两个上面提到的两个队列：**宏任务队列（Event Queue）**  与 **微任务队列（MicroTask）** ；`EventLoop`​ 优先消费微任务队列（main 函数结束后立即消费微任务），待微任务完全消费完之后再消费宏任务队列。每个宏任务消费完毕之后都会去检查微任务队列是否为空，不为空则优先消费微任务队列。下图来描述上面的过程。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/869928e2-965f-4d21-9c65-983924daddc6.webp?raw=true)​
|实战 |
| ------|
宏任务可以用 `Future`​ 对象创建，微任务则使用 `scheduleMicrotask`​ 全局函数来创建。可以通过一个例子来了解他们之前的优先级关系。
```dart
void main() async {
  print('m1');
  var f = Future(() {
    print('f1');
    scheduleMicrotask(() {
      print('fs1');
    });
    return Future.value();
  });
  scheduleMicrotask(() {
    print('s1');
  });
  f = f.then((value) {
    print('f2');
    return '';
  });
  scheduleMicrotask(() {
    print('s2');
  });
  print('m2');
  await f;
}
```
先花上一分钟思考一下最终的输出结果！！！对比一下下面的结果看看与你的预期是否相符。
```null
m1
m2
s1
s2
f1
fs1
f2
```
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/bc596230-ea9d-4aff-af39-55e37fa8ddd4.webp?raw=true)​
​`Future`​ 与 `scheduleMicrotask`​ 均是以同步的方式向任务队列中添加任务，在 `main`​ 函数结束前 `EventLoop`​ 都不会消费任何队列中的任务，所以 `m1 m2`​ 会先按顺序同步输出。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/425bd9b2-4667-45d8-b23b-e70389f58c41.webp?raw=true)​
​`main`​ 函数结束后宏任务队列中的顺序是 `f1 f2`​，微任务队列中的顺序是 `s1 s2`​。至于 `fs1`​ 还在宏任务队列中待执行还没有添加到任何队列中。由于 `main`​ 函数结束后会先检查微任务队列因此 `s1 s2`​ 会接着 `m1 m2`​ 输出。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/5ebc3e9f-0706-4f4c-ac5d-4c4c4ca645dc.webp?raw=true)​
微任务队列执行完后，开始执行宏任务，此时微任务队列为空只剩宏任务。由于 `f1`​ 在宏任务队列的第一位，因此它会接着 `s1 s2`​ 输出。同时 `fs1`​ 作为微任务被添加到了微任务队列，宏任务还剩 `f2`​，微任务由空新增了 `fs1`​。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/b733ed44-6fe9-44c3-b6d6-e5f85182a6f0.webp?raw=true)​
​`f1`​ 宏任务被执行后会立即检查微任务队列，此时微任务还有 `fs1`​，因此 `fs1`​ 又会接着 `f1`​ 输出。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/1d92b1d5-3f3d-42de-83a8-2ccabb0cbb76.webp?raw=true)​
此时微任务再次为空，只剩宏任务 `f2`​ 了，所以 `f2`​ 会在最后被输出打印。
详解 MicroTask Queue
---
​`scheduleMicrotask`​ 全局函数用来向微任务队列中添加任务，可以由此函数开始探索微任务的实现机制。
```dart
void scheduleMicrotask(void Function() callback) {
  _Zone currentZone = Zone._current;
  if (identical(_rootZone, currentZone)) {
    _rootScheduleMicrotask(null, null, _rootZone, callback);
    return;
  }
}
void _rootScheduleMicrotask(
    Zone? self, ZoneDelegate? parent, Zone zone, void f()) {
  if (!identical(_rootZone, zone)) {
  }
  _scheduleAsyncCallback(f);
}
```
在 `main`​ 函数中直接调用 `scheduleMicrotask`​ 由于并没有创建新的 `Zone`​ 因此会走到 `Tag1`​ 分支处。同理，`_rootScheduleMicrotask`​ 函数内会直接调用到 `_scheduleAsyncCallback`​，这个函数接收的参数便是微任务函数。
```dart
void _scheduleAsyncCallback(_AsyncCallback callback) {
  _AsyncCallbackEntry newEntry = new _AsyncCallbackEntry(callback);
  _AsyncCallbackEntry? lastCallback = _lastCallback;
  if (lastCallback == null) {
    _nextCallback = _lastCallback = newEntry;
    if (!_isInCallbackLoop) {
      _AsyncRun._scheduleImmediate(_startMicrotaskLoop);
    }
  } else {
    lastCallback.next = newEntry;
    _lastCallback = newEntry;
  }
}
class _AsyncCallbackEntry {
  final _AsyncCallback callback;
  _AsyncCallbackEntry? next; 
  _AsyncCallbackEntry(this.callback);
}
```
​`_scheduleAsyncCallback`​ 会将最终的微任务回调包装成一个 `_AsyncCallbackEntry`​ 对象以便将任务组合成单向链表的数据结构以保证 FIFO 的顺序（从这里来看，链表即是微任务队列）。当链表初始为空时触发 `_startMicrotaskLoop`​ 来消费链表中的微任务回调。触发动作由 `_AsyncRun._scheduleImmediate`​ 函数进行，它是一个外部函数，传入的参数是 `_startMicrotaskLoop`​ 回调本身。也就是说，`_AsyncRun._scheduleImmediate`​ 的调用最终会使 `_startMicrotaskLoop`​ 被执行。
先看 `_startMicrotaskLoop`​ 的实现；
```dart
void _startMicrotaskLoop() {
  _isInCallbackLoop = true;
  try {
    _microtaskLoop();
  } finally {
    _lastPriorityCallback = null;
    _isInCallbackLoop = false;
    if (_nextCallback != null) {
      _AsyncRun._scheduleImmediate(_startMicrotaskLoop);
    }
  }
}
void _microtaskLoop() {
  for (var entry = _nextCallback; entry != null; entry = _nextCallback) {
    _lastPriorityCallback = null;
    var next = entry.next;
    _nextCallback = next;
    if (next == null) _lastCallback = null;
    (entry.callback)();
  }
}
```
使用 `scheduleMicrotask`​ 添加微任务实际上是向一个链表未尾添加一个节点，当微任务被执行时通过遍历链表取出任务回调依次执行。这个过程的关键是触发时机，通过上面的分析知道微任务有两个触发时机：一、`main`​函数结束后 二、`Future`​ 宏任务结束后。
而在上面的源码中只有一行 `_AsyncRun._scheduleImmediate(_startMicrotaskLoop)`​ 能触发微任务链表的执行，继续深入追踪看看它是如何在上面两种情况下触发微任务的执行。
```dart
@patch
class _AsyncRun {
  @patch
  static void _scheduleImmediate(void callback()) {
    final closure = _ScheduleImmediate._closure;
    if (closure == null) {
      throw new UnsupportedError("Microtasks are not supported");
    }
    closure(callback);
  }
}
class _ScheduleImmediate {
  static _ScheduleImmediateClosure? _closure;
}
@pragma("vm:entry-point", "call")
void _setScheduleImmediateClosure(_ScheduleImmediateClosure closure) {
  _ScheduleImmediate._closure = closure;
}
```
​`_AsyncRun._scheduleImmediate`​ 的实现是在 `sdk/lib/_internal/vm/lib/schedule_microtask_patch.dart#L10`​ 文件中。
其内部是调用到了一个 `_closure`​ 闭包类型的静态变量，并且发现它会通过 `_setScheduleImmediateClosure`​ 函数被赋值。由 `@pragma`​ 标记可知它是一个可以被 Runtime 调用的函数，调用位置可以在 Runtime 代码中找到。
```C++
Dart_Handle DartUtils::PrepareAsyncLibrary(Dart_Handle async_lib,
                                           Dart_Handle isolate_lib) {
  Dart_Handle schedule_immediate_closure =
      Dart_Invoke(isolate_lib, NewString("_getIsolateScheduleImmediateClosure"),
                  0, nullptr);
  RETURN_IF_ERROR(schedule_immediate_closure);
  Dart_Handle args[1];
  args[0] = schedule_immediate_closure;
  return Dart_Invoke(async_lib, NewString("_setScheduleImmediateClosure"), 1,
                     args);
}
```
通过上面 Runtime 源码发现 `_setScheduleImmediateClosure`​ 传入的参数是 `_getIsolateScheduleImmediateClosure`​ 函数的返回值，继续搜索这个函数实现。
```dart
void _isolateScheduleImmediate(void callback()) {
  assert((_pendingImmediateCallback == null) ||
      (_pendingImmediateCallback == callback));
  _pendingImmediateCallback = callback;
}
@pragma("vm:entry-point", "call")
Function _getIsolateScheduleImmediateClosure() {
  return _isolateScheduleImmediate;
}
```
​`_getIsolateScheduleImmediateClosure`​ 返回的是 `_isolateScheduleImmediate`​ 函数，也就是说 `_AsyncRun._scheduleImmediate(_startMicrotaskLoop)`​ 绕了一圈最终将参数 `_startMicrotaskLoop`​ 传到了 `_pendingImmediateCallback`​ 变量存储并结束。
到这里知道了 `_pendingImmediateCallback`​ == `_startMicrotaskLoop`​，可以得到结论：`_pendingImmediateCallback`​ 的调用时机便是微任务的触发时机。
```dart
@pragma("vm:entry-point", "call")
void _runPendingImmediateCallback() {
  final callback = _pendingImmediateCallback;
  if (callback != null) {
    _pendingImmediateCallback = null;
    callback();
  }
}
```
而 `_pendingImmediateCallback`​ 在且仅在 `_runPendingImmediateCallback`​ 函数中被调用，调用之后 `_pendingImmediateCallback`​ 会被清空需要再次设置。
​`_runPendingImmediateCallback`​ 函数仅有两处被调用，一处是 `_RawReceivePort`​ 的回调函数，另一处是 `_Timer`​ 的回调函数。
```dart
@pragma("vm:entry-point")
final class _RawReceivePort implements RawReceivePort {
  @pragma("vm:entry-point", "call")
  static _handleMessage(int id, var message) {
    final Function? handler = _portMap[id]?._handler;
    if (handler == null) {
      return null;
    }
    handler(message); 
    _runPendingImmediateCallback();
    return handler;
  }
}
```
​`_Timer`​ 触发 `_runPendingImmediateCallback`​ 的相关代码太长就不贴了，可自行查阅 [传送门](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdart-lang%2Fsdk%2Fblob%2F249895f979d484184f9d0b7a177b413a41726eb7%2Fsdk%2Flib%2F_internal%2Fvm%2Flib%2Ftimer_impl.dart%23L405 "https://github.com/dart-lang/sdk/blob/249895f979d484184f9d0b7a177b413a41726eb7/sdk/lib/_internal/vm/lib/timer_impl.dart#L405")。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/1b7a57b6-7865-4594-bd8c-3e37b1218192.webp?raw=true)​
微任务队列的触发函数 `_startMicrotaskLoop`​ 仅在 `_RawReceivePort`​ 内与 `_Timer`​ 内两处被调用。前面提到微任务只有两个触发时机：一、`main`​ 函数结束后 二、`Future`​ 宏任务结束后，这两个时机与 `_RawReceivePort`​ 和 `_Timer`​ 的回调能对应起来吗？
 `main`​ 函数就是在 `_RawReceivePort._handleMessage`​ 中的 **Tag2** 处被调用的。在 `main`​ 函数调用之后 `_runPendingImmediateCallback`​ 会被调用，这便与第一个触发时机（微任务会在 `main`​ 函数结束后被调用）对应。
> 可以在任意 Dart 项目 main 函数中添加断点进行验证。
至于第二个时机（`Future`​ 宏任务结束后）与 `_Timer`​ 回调的关系，且继续看下面的分析。
详解 Event Queue
---
本小节将探索 Dart 单线程模型中的宏任务队列，并将搞清楚宏任务与 `_Timer`​ 之间的关系。`Future`​ 可以用来创建宏任务，所以依然可以从 `Future`​ 相关的构造函数开始进行分析。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/f69b82e7-d79d-4311-bbe9-bde4452cba9c.webp?raw=true)​
如上图所示，`Future`​ 有多达 5 个构造函数，他们每个都与 `_Timer`​ 相关吗？其实不然。通过查看其实现可知，真正与 `_Timer`​ 相关的只有 `Future()`​ 、`Future.delay()`​ 两个，而 `Future.delay()`​ 的实现与 `Future()`​ 类似：都依赖 `Timer`​，只不过传入的时间参数不同。
另外 `Future.value()`​ 是个比较特殊的存在，根据其注释可知当参数不是一个 `Future`​ 类型时，其等效于 `Future.sync()`​ 构造函数。并且它们两个的实现均依赖了 `scheduleMicrotask`​ 来创建微任务，这导致它们的 `then`​ 回调均会在微任务队列中被触发执行。
```dart
Future.value(12); 
new Future<T>.sync(() => 12); 
```
用一个小测试来看看 `Future`​ 与 `Future.value`​ 之间的不同。
```dart
void main() async {
  var f = Future(() => '');
  f.then((value) {
    print('f1');
  });
  scheduleMicrotask(() {
    print('s1');
  });
}
void main() async {
  var f = Future.value('');
  f.then((value) {
    print('f1');
  });
  scheduleMicrotask(() {
    print('s1');
  });
}
```
由于 `Future.value`​ 的实现依赖微任务，因此它的 `then`​ 回调优先被微任务触发，而 `Future()`​ 不同，它是一个真正的宏任务，需要等微任务执行完毕才会执行。
注意：这里我们需要修正一个「**错误**」，前面说 `Future`​ 代表宏任务的表述其实是不严谨的，只有 `Future()`​，`Future.delay()`​ 两个构造函数创建的 `Future`​ 实例才代表一个宏任务。所以对于 `Future`​ 类型的创建当前只需关注 `Future()`​ 这个构造函数即可。
```dart
factory Future(FutureOr<T> computation()) {
  _Future<T> result = new _Future<T>();
  Timer.run(() {
    try {
        result._complete(computation());
    } catch (e, s) {
        _completeWithErrorCallback(result, e, s);
    }
  });
  return result;
}
static void run(void Function() callback) {
    new Timer(Duration.zero, callback);
}
```
可以看到 `Future()`​ 构造函数内部直接使用了 `Timer.run()`​，`Timer.run()`​ 默认时长参数为零（`Duration.zero`​），进一步追踪其实现，发现会调到 `_Timer`​ 类型来（`Timer`​ 背后的实现类是 `_Timer`​）。
```dart
 static _Timer _createTimer(
  void callback(Timer timer), int milliSeconds, bool repeating) {
  if (milliSeconds < 0) {
    milliSeconds = 0;
  }  
  int now = VMLibraryHooks.timerMillisecondClock();
  int wakeupTime = (milliSeconds == 0) ? now : (now + 1 + milliSeconds);   
  _Timer timer =
      new _Timer._internal(callback, wakeupTime, milliSeconds, repeating);
  timer._enqueue();
  return timer;
}
void _enqueue() {
  if (_milliSeconds == 0) {
    if (_firstZeroTimer == null) {
    _lastZeroTimer = this;
    _firstZeroTimer = this;
    } else {
    _lastZeroTimer._indexOrNext = this;
    _lastZeroTimer = this;
    }
    _notifyZeroHandler();
  } else {
    _heap.add(this);
    if (_heap.isFirst(this)) {
      _notifyEventHandler();
    }
  }
}
```
受限于篇幅这里不继续对 `_Timer`​ 进行展开了，只需要知道了一个事实：多个 0 时长 `Timer`​ 对象会在 `_Timer`​ 内部形成链表结构，当懒加载完 `_RawReceivePort`​ 后向其 `SendPort`​ 发送消息 Runtime 会触发 `handler`​ 回调，回调中取出链表第一个 `_Timer`​ 并执行其 `callback`​ 回调。
​![](https://github.com/appdev/gallery/blob/main/img/2024-5-11%2018-13-22/6d45e8dc-1ac1-4b70-94ca-1c3f9415c2f9.webp?raw=true)​
而 `_runPendingImmediateCallback`​ 回调会在 `callback`​ 执行后立即被调用。还记得吗？`_runPendingImmediateCallback`​ 就是 `_startMicrotaskLoop`​，而它会触发微任务队列的执行。`Future()`​ 构造函数创建宏任务，宏任务结束后立即触发了微任务的执行。
与微任务队列不同，实际不存在一个专门的宏任务队列，宏任务队列实际上就是 `Timer`​ 链表或最小堆结构，宏任务的执行依赖的是定时器。而定时器又依赖 `_ReceivePort`​ 的消息机制。

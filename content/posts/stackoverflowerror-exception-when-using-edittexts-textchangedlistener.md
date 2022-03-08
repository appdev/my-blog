---
title: "使用EditText的TextChangedListener时StackOverflowError异常"
slug: "stackoverflowerror-exception-when-using-edittexts-textchangedlistener"
date: 2018-07-02T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "在工作过程中，各种文本框的输入有各种特殊需求，如输入整数、字母等等需求。现公司业务需求，要求某文本输入框，只能输入整数，并且不能出现以“01"

---
                
在工作过程中，各种文本框的输入有各种特殊需求，如输入整数、字母等等需求。现公司业务需求，要求某文本输入框，只能输入整数，并且不能出现以“010”，数字出现以0开头的情形。

经过查询文档，发现EditText可以通过addTextChangedListener方法，添加文本变化的监听器。我们可以通过该监听器对以0开头的情形进行处理。


<!--more-->


于是有如下代码：

```java
editText = (EditText) findViewById(R.id.editText1); 
editText.addTextChangedListener(new TextWatcher() { 
    @Override 
    public void onTextChanged(CharSequence s, int start, int before, 
    int count) { 
 
    } 

    @Override 
    public void beforeTextChanged(CharSequence s, int start, int count, 
    int after) { 
 
    } 
 
    @Override 
    public void afterTextChanged(Editable s) { 
        //将字符串转换成整形，然后在转换成字符型。完成“010”--->"10"的转换 
        Integer integer = Integer.valueOf(s.toString()); 
        editText.setText(integer.toString()); 
    } 
});
```
运行程序，会有java.lang.StackOverflowError。

经过分析知道，在afterTextChanged方法中，使用setText()方法，会重新触发监听器，并不断的进行递归，最后程序崩溃。只要原因后，我们就有如下解决办法。
```java
editText = (EditText) findViewById(R.id.editText1); 
editText.addTextChangedListener(new TextWatcher() { 
    @Override 
    public void onTextChanged(CharSequence s, int start, int before, 
    int count) { 
    } 
 
    @Override 
    public void beforeTextChanged(CharSequence s, int start, int count, 
    int after) { 
    } 
 
    @Override 
    public void afterTextChanged(Editable s) { 
        //在afterTextChanged中，调用setText()方法会循环递归触发监听器，必须合理退出递归，不然会产生异常 
        if (s.length() > 1 && s.charAt(0) == '0') { 
            Integer integer = Integer.valueOf(s.toString()); 
            editText.setText(integer.toString()); 
        } 
    } 
});
```
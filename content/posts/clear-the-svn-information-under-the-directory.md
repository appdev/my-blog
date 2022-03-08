---
title: "清除目录下的SVN信息"
slug: "clear-the-svn-information-under-the-directory"
date: 2018-07-01T17:16:07+08:00
categories: [软件开发]
tags: [软件开发]
showToc: true
TocOpen: true
draft: false
description: "在项目开发和日常文档管理时，用到了SVN，由于要把一些文档发给同事，这时想删除SVN版本信息文件，于是上网在SVN中文论坛找到了一份资料："

---
                
在项目开发和日常文档管理时，用到了SVN，由于要把一些文档发给同事，这时想删除SVN版本信息文件，于是上网在SVN中文论坛找到了一份资料：

删除 .svn 文件

### 在linux下

删除这些目录是很简单的，命令如下
`find . -type d -name “.svn”|xargs rm -rf`

或者

`find . -type d -iname “.svn” -exec rm -rf {} ;`

### 在windows下用以下法子：

1、在项目平级的目录，执行dos命令：
`xcopy project_dir project_dir_1 /s /i`

project_dir 为你的项目目录

原理是复制可见文件 .svn是隐藏目录 不会复制
3、添加注册表(亲自动手测试过)
可以将“快速删除SVN版本信息”命名增加到资源管理器的右键上，这样，鼠标点两下就能把选中目录下的所有.svn目录干掉了。

代码为：
```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINESOFTWAREClassesFoldershellDeleteSVN]
@=”快速删除SVN版本信息”

[HKEY_LOCAL_MACHINESOFTWAREClassesFoldershellDeleteSVNcommand]
@=”cmd.exe /c D:工具批处理文件删除SVN版本信息.bat”
```
将这段代码保存为一个.reg文件，双击确认导入注册表中不完整，后来自己手工添加。注意：文件“批处理文件删除SVN版本信息.bat”不能放 在有空格的文件夹下，确认删除时请看一下当前目录不要删除不该删的目录下的SVN版本信息。不知道怎么改进“cmd.exe /c D:工具批处理文件删除SVN版本信息.bat”。

批处理文件删除SVN版本信息.bat文件内容如下：
```shell
@echo off
echo ***********************************************************
echo 清除SVN版本信 息
echo ***********************************************************
:start
::启动过程，切换目录
:set pwd=%cd%
:cd %1
echo 工作目录是：& chdir
:input
::获取输入，根据输入进行处理
set source=:
set /p source=确定要清楚当前目录下的.svn信息吗？[Y/N/Q]
set “source=%source:”=%”
if “%source%”==”y” goto clean
if “%source%”==”Y” goto clean
if “%source%”==”n” goto noclean
if “%source%”==”N” goto noclean
if “%source%”==”q” goto end
if “%source%”==”Q” goto end
goto input
:clean
::主处理过程，执行清理工作
@echo on
@for /d /r %%c in (.svn) do @if exist %%c ( rd /s /q %%c & echo??? 删除目录%%c)
@echo off
echo “当前目录下的svn信息已清除”
goto end
:noclean
::分支过程，取消清理工作
echo “svn信息清楚操作已取消”
goto end
:end
::退出程序
cd “%pwd%”
pause
```
注：最后一种方法，如果出现错误，就打开注册表，找到对应的项，吧“cmd.exe /c D:工具批处理文件删除SVN版本信息.bat “直接写入注册表中即可使用
---
title: "Centos7 软件源安装Python3.6环境"
slug: "centos7-yum-installation-of-python36-environment-super-simple"
published: 2018-07-17T17:16:07+08:00
categories: [Linux]
tags: [Linux]
showToc: true
TocOpen: true
draft: false
---
之前一直是编译安装，装的多了就感觉麻烦，写个脚本还要上传。。。
随意找了一下，发现软件源里有 Python。记录一下
配置好 Python3.6 和 pip3
安装 EPEL 和 IUS 软件源
```
yum install epel-release -y
yum install https://centos7.iuscommunity.org/ius-release.rpm -y
```
安装 Python3.6
```
yum install python36u -y
```
创建 python3 连接符
```
ln -s /bin/python3.6 /bin/python3
```
安装 pip3
```
yum install python36u-pip -y
```  
创建 pip3 链接符  
```
ln -s /bin/pip3.6 /bin/pip3
```
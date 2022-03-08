---
title: "Centos7 软件源安装Python3.6环境"
slug: "centos7-yum-installation-of-python36-environment-super-simple"
date: 2018-07-17T17:16:07+08:00
categories: [Linux]
tags: [Linux]
showToc: true
TocOpen: true
draft: false
description: "之前一直是编译安装，装的多了就感觉麻烦，写个脚本还要上传。。。随意找了一下，发现软件源里有Python。记录一下配置好Python3.6"

---
                
之前一直是编译安装，装的多了就感觉麻烦，写个脚本还要上传。。。

随意找了一下，发现软件源里有Python。记录一下

配置好Python3.6和pip3
安装EPEL和IUS软件源
```
yum install epel-release -y
yum install https://centos7.iuscommunity.org/ius-release.rpm -y
```
安装Python3.6
```
yum install python36u -y
```

创建python3连接符
```
ln -s /bin/python3.6 /bin/python3
```
安装pip3
```
yum install python36u-pip -y
```  

创建pip3链接符  

```
ln -s /bin/pip3.6 /bin/pip3
```
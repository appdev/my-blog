---
title: "sublime-text 简单的安装方式"
slug: "sublimetext-simple-installation-1"
published: 2018-07-05T17:16:07+08:00
categories: [Linux]
tags: [Linux]
showToc: true
TocOpen: true
draft: false
---
小巧、高效、强大到逆天的编辑器，相比之下 gedit，notepad++ 简直弱爆了。  
但是它不支持中文输入，之前介绍了如何让他支持中文输入，但是需要自己去编译，很麻烦。  
<br\>
近日发现一个简单的安装方式，直接支持中文和 fcitx  
sudo apt-get install git
`git clone https://github.com/stkevintan/sublpatcher.git &&cd sublpather
./install`
大概这样就 OK。。  
顺利的话界面已汉化，且完美支持 fcitx。  
主程序位置 /opt/sublime_text_2/  
卸载方式 sudo apt-get remove sublime-text

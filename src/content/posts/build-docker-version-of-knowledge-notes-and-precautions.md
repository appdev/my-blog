---
title: "搭建为知笔记Docker版，以及注意事项"
slug: "build-docker-version-of-knowledge-notes-and-precautions"
published: 2020-03-13T17:16:07+08:00
categories: [软件开发,Linux]
tags: [软件开发,Linux]
showToc: true
TocOpen: true
draft: false
---
好久没有关注为知笔记了，最近考虑迁移笔记的时候，看了一下各大笔记应用，开源笔记要么不支持全平台，要么客户端完善度或者同步问题不行。突然发现为知笔记支持 docker 版，可以自己部署，客户端还是使用官方客户端。
## 安装 docker
```
docker version > /dev/null || curl -fsSL get.docker.com | bash
service docker restart
```
## 启动为知笔记 docker
创建文件夹，跟官方保持一致，我们也在主目录创建文件
```
cd ~
mkdir wizdata
```
启动，如果你打算使用 nginx，或者配置 ssl，则需要把端口调整一下。比如我的 6789
```
docker run --name wiz --restart=always -it -d -v  ~/wizdata:/wiz/storage -v  /etc/localtime:/etc/localtime -p 80:80 -p 9269:9269/udp  wiznote/wizserver
```
接下来会自动下载并运行，喝杯咖啡，等一下就可以了。
或者，可以在这个时候配置 Nginx
## 配置 Nginx
开启 SSL 
```
    ssl_certificate    XXX/fullchain.pem; #你的证书地址
    ssl_certificate_key    XXX/privkey.pem; #你的证书地址
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!EXP;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    error_page 497  https://$host$request_uri;
```
OK 配置完成之后，打开你的域名，或者你的 IP:端口，比如 http://127.0.0.1:6789，默认管理员账号：admin@wiz.cn，密码：123456
### 配置云存储
默认笔记是保存在本地的，你可以使用本地 + 云同步的方式，或者像我一样直接使用云储存，
配置阿里 OSS
```
{
  "bucket": "weizhi-note",
  "region": "oss-cn-chengdu",
  "accessKeyId": "XXXXX",
  "accessKeySecret": "XXXX",
  "internal": false
}
```
参数都可以在阿里云 oss 找到
需要注意的是 internal 的设置，如果您的服务是部署在阿里云 ECS 上面，那么请设置为 true。如果您的服务没有部署在阿里云上面，那么请设置为 false
### HTTPS 不能新建笔记
当一切配置完成之后，你可能会发现 https 不能新建笔记，但是 http 可以。查找了官方文档，发现 Nginx 反向代理需要增加一些配置
```
  location / {  
    proxy_pass http://127.0.0.1:6789;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header x-wiz-real-ip $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
```
修改完成之后重启 Nginx 就可以新建笔记了。

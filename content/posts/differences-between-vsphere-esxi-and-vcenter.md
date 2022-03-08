---
title: "vSphere, ESXi 和 vCenter 的区别"
slug: "differences-between-vsphere-esxi-and-vcenter"
date: 2020-03-18T17:16:07+08:00
categories: [Linux]
tags: [Linux]
showToc: true
TocOpen: true
draft: false
descriptionDelete: "update:2020年03月26日经理了一番折腾之后，最终公司、家里都安装上PVE了，没错就是PVE。虽然最开始特别想使用ESXI。首先"

---
                
update:2020年03月26日
经理了一番折腾之后，最终公司、家里都安装上PVE了，没错就是PVE。虽然最开始特别想使用ESXI。

首先说一下之前的误解，KVM的界面是非常难看的，没想到这个基于KVM的PVE其实还好。UI还不错。
再有，ESXI不知道何故在联想的电脑上装上去打不开，UEFI BOIS 都试过了，网上的几种方法试了还是不行，在家里机器上试了一会下轻松装上~~。

最后不得不说，PVE真香~内存占用方面，最先版PVE 6.1基于Debian 9 ，内存方面控制的很好！！

---

最近准备把家里之前的Windows + Vmware 的服务器，物理机虚拟化。考虑了ESXI、PVE、XEN。

首先感觉XEN比较老，有点落伍，PVE 核心也是 KVM。所以最后无非就是在 ESXI 和 PVE 里选 这两个都没问题的。

最后选了ESXI。不选KVM主要是界面丑。真的丑。

 Vmware 用的最多的应该是虚拟机了。刚开始 Vmware vSphere、EXSi、vCenter 搞得有点蒙。所以查资料了解了一下 vSphere 和他的组件。

 首先弄清楚 vSphere，EXSi 和 vCenter 的区别是很重要的。我先在VMware Workstation 中安装了 vSphere。

vSphere是一个属于数据中心产品的软件套件。vSphere就像微软 Office 套装一样拥有许多产品，比如 Office，Excel等。vSphere同样也包括很多软件组件，比如 vCenter、ESXi、vSphere client 等等。所以这些软件的合集，就叫做vSphere。**vSphere不是一种你可以安装和使用的软件，它仅仅是一个软件套件的合集**。

ESXi、vSphere client 和 vCenter 都是 vSphere 的部件。ESXi server是最重要的部分，[ESXi是一个一类虚拟化管理器(type 1 hypervisor)][1]。所有的虚拟机或者客户机操作系统都安装在 ESXi 服务器上，同时，你可能还需要vSphere中的其他部件– vSphere client 或者 vCenter。管理员可以通过 vSphere client 连接 ESXi 服务器来访问或者管理虚拟机。vSphere client 是用来从客户端机器连接 ESXi 执行任务的。所以，现在的问题是，vCenter是什么？我们为什么需要他？我们完全可以通过 vSphere client来克隆虚拟机，而不需要 vCenter server。

vCenter server 和 vSphere client 类似，但是它是一个拥有更强大功能的服务器。vCenter server 可以安装在 Linux 或者 Window上。VMware vCenter server 是一个管理虚拟机和 ESXi 服务器的中心化管理应用。vSphere client可以通过访问 vCenter server来管理多个 ESXi 服务器。vCenter server有许多企业级特性，例如 vMotion，VMware高可用、VMware更新管理器和VMware 分布式资源调用器(DRS)。例如，你可以很方便的使用 vCenter server 克隆个已存在的虚拟机。所以vCenter是vSphere套装中的重要组成部分。你必须要单独购买vCenter的许可证。

vSphere套件示意图  

![vSphereProductSuite.png][2]

上面的示意图更为形象地展示了 vSphere 套件。vSphere是一个产品套装， ESXi是安装在物理机上的管理器。vSphere Client安装在一个笔记本或者桌面PC上，用于访问ESXi服务器进行虚拟机的创建和管理。vCenter server像一个虚拟机一样安装在 ESXi上面。vCenter server同样也可以安装在不同的独立物理服务器中，但为什么不适用虚拟化呢？在拥有多个ESXi服务器和数十个虚拟机时，vCenter server的应用就比较频繁了。在小环境下的管理，通常都会使用 vSphere client 来直连 ESXi 服务器。


ESXi与KVM之间的关系:

Hypervisor 按类型划分的话分两种，type 1 hypervisor是一种直接安装在裸机上的管理程序。通常用在服务器领域中，如EXSi, Hyper-V等。type 2 hypervisor通常需要一个宿主操作系统来提供虚拟化服务(如IO设备支持和内存管理)，通常用在个人PC，如VMware Workstation, VirtualBox等等。所以如何去划分等级，不是在于操作系统和虚拟化软件的安装顺序，而是在于虚拟化软件能够做到的事情。

而KVM，是一个基础Linux内核的一个虚拟化技术，译者理解应该属于type 1。像是OpenStack，国产zstack都是基于KVM的云计算平台。


  [1]: https://vapour-apps.com/what-is-hypervisor/
  [2]: https://static.apkdv.com/usr/uploads/2020/03/3366468040.png#mirages-width=450&mirages-height=166&mirages-cdn-type=2
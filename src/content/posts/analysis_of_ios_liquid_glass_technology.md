---
title: 在 Android 中实现 iOS 液态玻璃效果(二：折射与渗透效果)
published: 2025-07-13T14:26:55.726Z
description: ''
updated: ''
tags:
  - Note
draft: false
pin: 0
toc: true
lang: ''
abbrlink: ''
---

## 概述

本文解析了 iOS 26 中液态玻璃效果的实现原理，包括折射机制和渗透效果的数学模型。

## 技术架构

液态玻璃效果主要由两个核心组件构成：
1. **折射系统 (Refraction System)** - 负责光线弯曲和视觉扭曲效果
2. **渗透系统 (Penetration System)** - 负责颜色吸收和材质质感模拟

---

## 1. 折射系统 (Refraction System)

### 1.1 系统概述

iOS 的液态玻璃折射系统采用双层折射架构，包含内折射和外折射两个独立的处理层。

### 1.2 内折射 (Inner Refraction)

内折射是液态玻璃效果的核心组件，通过以下关键参数进行精确控制：

#### 1.2.1 折射量 (Refraction Amount)
<img src="https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417418384.jpg" alt="折射量效果对比" style="max-width: 60%;" />

**技术特性：**
- **数值范围：** 负数值，控制折射内容的强度
- **视觉影响：** 绝对值越大，边缘直角效果越明显
- **计算权重：** 直接影响最终折射距离的计算结果

#### 1.2.2 折射高度 (Refraction Height)

<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417423223.jpg'  alt="折射高度效果 - 小" style="max-width: 60%; " />

<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417421410.jpg' alt="折射高度效果 - 中" style="max-width: 60%; " />
  

<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417419710.jpg' alt="折射高度效果 - 大" style="max-width: 60%; " />
*图2c: 折射高度效果 - 大*

**技术特性：**
- **视觉效果：** 数值越大，玻璃边缘视觉厚度越明显
- **边界稳定性：** 在折射量固定时，最外边界颜色保持恒定
- **性能优化：** 影响SDF计算的精度要求

### 1.3 离心效果 (Centrifugal Effect)

#### 1.3.1 标准离心模式

<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417401771.jpg' alt="离心效果" style="max-width: 60%; " />
*图3: 离心效果 - 展示了具有离心效果的玻璃折射，可以看到从中心向外扩散的视觉效果*

**实现机制：**
- 折射方向由两个向量合成：SDF梯度向量 + 中心点相对方向向量
- 产生从中心向外扩散的视觉效果
- 适用于大部分UI组件

#### 1.3.2 纯梯度模式


<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417409425.jpg' alt="纯梯度效果" style="max-width: 60%; " />
*图4: 纯梯度效果 - 展示了没有离心效果的玻璃折射（仅SDF梯度），主要用于锁屏界面*

**应用场景：**
- 主要用于锁屏界面
- 折射方向仅由SDF梯度决定
- 提供更加统一的视觉方向性

### 1.4 外折射 (Outer Refraction)

外折射是一个精细的视觉增强层，将周围环境的颜色信息折射到玻璃外侧边缘，增强材质的真实感和深度感。

### 1.5 渗色效果 (Color Bleeding)


<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417406133.jpg' alt="渗色效果" style="max-width: 60%; " />
*图5: 渗色效果 - 展示了渗色效果与模糊的配合，颜色会自然扩散*

渗色效果与高斯模糊协同工作，创造更加自然的光线扩散效果。

### 1.6 折射数学模型

#### 1.6.1 核心计算公式

基于深入的逆向工程分析，折射系统的数学模型如下：

```glsl
// 圆映射函数 - 使用1/4圆函数
float C(float x) {
    return sqrt(1.0 - x * x); // 1/4圆函数
}

// 折射距离计算
float refractionDistance = C(1.0 - sdf / refractionHeight) * refractionAmount;

// 折射方向计算（需要归一化）
vec2 refractionDirection = normalize(sdfGradient + normalizedCenterOffset);
// 注意：移除 normalizedCenterOffset 可消除离心效果

// 最终坐标变换
vec2 refractedCoord = originalCoord + refractionDistance * refractionDirection;
```

#### 1.6.2 参数说明

| 参数 | 类型 | 作用 | 取值范围 |
|------|------|------|----------|
| `sdf` | float | 有向距离场值 | [0, +∞) |
| `refractionHeight` | float | 折射高度参数 | (0, +∞) |
| `refractionAmount` | float | 折射强度 | (-∞, 0] |
| `sdfGradient` | vec2 | SDF梯度向量 | 归一化向量 |
| `normalizedCenterOffset` | vec2 | 中心偏移向量 | 归一化向量 |

---

## 2. 渗透系统 (Penetration System)

### 2.1 系统原理

渗透效果模拟了真实玻璃材质对不同颜色光线的选择性透过特性。高灰度值（偏白色）的内容更难穿透玻璃表面，产生类似塑料材质的"吸色"视觉效果。

### 2.2 视觉效果展示

#### 2.2.1 渗透量对比


<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417413603.jpg' alt="渗透量对比" style="max-width: 60%; " />
渗透量对比 - 对比了无渗透效果和不同渗透量（-80, -110）下的视觉差异*

#### 2.2.2 吸色效果


<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417404453.jpg' alt="吸色效果" style="max-width: 60%; " />
吸色效果 - 展示了"吸色"效果，玻璃左上角的"15"数字颜色被吸走*

#### 2.2.3 混合渲染

<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417407456.jpg' alt="混合渲染效果" style="max-width: 60%; " />
 混合效果 - 展示了50%折射+50%渗透的混合渲染效果*



<img  src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417415964.jpg' alt="渗透效果详细展示" style="max-width: 60%; " />
渗透效果详细展示 - 展示了渗透系统的详细工作机制*

#### 2.2.4 高斯模糊集成

<img src='https://cdn.jsdelivr.net/gh/appdev/gallery@main/img/2025-07-13/1752417411525.jpg' alt="高斯模糊集成" style="max-width: 60%; " />
模糊集成 - 展示了叠加高斯模糊的渗透层效果*

### 2.3 技术参数

#### 2.3.1 渗透量 (Penetration Amount)
- **功能：** 控制颜色吸收的强度
- **数值特性：** 通常为负值，绝对值越大吸收效果越明显
- **性能影响：** 影响像素级别的颜色计算复杂度

#### 2.3.2 混合模式 (Blending Mode)
- **折射-渗透混合：** 支持任意比例的效果混合
- **常用配置：** 50% 折射 + 50% 渗透
- **实时调节：** 支持动态调整混合比例

#### 2.3.3 高斯模糊集成
- **模糊半径：** 可配置的模糊强度
- **性能警告：** 过大的模糊半径可能导致滑动时的视觉跳变
- **优化建议：** 根据设备性能动态调整模糊参数

---

## 3. 性能优化建议

### 3.1 计算优化
- **SDF预计算：** 对静态几何体预计算SDF值
- **梯度缓存：** 缓存常用的梯度计算结果
- **LOD系统：** 根据距离调整计算精度

### 3.2 渲染优化
- **分层渲染：** 分离折射和渗透的渲染通道
- **纹理压缩：** 使用适当的纹理格式减少带宽
- **批处理：** 合并相似的玻璃效果对象

---

## 4. 实现注意事项

### 4.1 数值稳定性
- 确保SDF计算的数值稳定性
- 避免除零和数值溢出
- 使用适当的浮点精度

### 4.2 边界处理
- 正确处理几何体边界的折射计算
- 避免边界处的视觉伪影
- 实现平滑的过渡效果

### 4.3 兼容性考虑
- 不同GPU架构的着色器兼容性
- 移动设备的性能限制
- 不同屏幕分辨率的适配

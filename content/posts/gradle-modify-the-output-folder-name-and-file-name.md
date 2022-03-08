---
title: "新版本Gradle修改打包的路径和文件名"
slug: "gradle-modify-the-output-folder-name-and-file-name"
date: 2018-09-08T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
description: "这里分为Gradle3.0之前和之后两种方法。3.0之前在release下添加下面代码applicationVariants.all"

---
                
这里分为Gradle3.0之前和之后两种方法。
### 3.0之前
在release 下添加下面代码
```java
applicationVariants.all { variant ->
                variant.outputs.each { output ->
                    if (outputFile != null && outputFile.name.endsWith('.apk')) {
                        def apkFile = new File(
                                output.outputFile.getParent(),  "${defaultConfig.versionName}_${variant.productFlavors[0].name}.apk")
                        output.outputFile = apkFile
                    }
                }
            }
```
### 3.0之后
3.0之后不允许修改 output.outputFile 会提示报错。
```java
applicationVariants.all { variant ->
    variant.outputs.all { output ->
        def outputFile = output.outputFile
        if (outputFile != null && outputFile.name.endsWith('.apk')) {
            def fileName = "${defaultConfig.versionName}_${variant.productFlavors[0].name}.apk"
            outputFileName = fileName
        }
    }
}
```
这样就可以修改apk的名称，但是还是会像刚才一样每个apk文件处于不同的文件夹中，在最后加上额外指定地址
```java
applicationVariants.all { variant ->
    variant.outputs.all { output ->
        def outputFile = output.outputFile
        if (outputFile != null && outputFile.name.endsWith('.apk')) {
            def fileName = "${defaultConfig.versionName}_${variant.productFlavors[0].name}.apk"
            outputFileName = fileName
            variant.packageApplication.outputDirectory = new File("/Users/joker/Android/AppOutPut/" + defaultConfig.versionName)
        }
    }
}
```
这样加入variant.packageApplication.outputDirectory就可以指定生成的目录。这样就会遇到一个问题，我直接运行时候，安装不上，看下错误日志是包不存在。怎么回事呢。原来是我们更换了生成指令，安装命令找不到apk文件。可是为什么我放在release中，debug运行还是会执行呢，这个我暂时不知道，知道的朋友可以评论告诉我。我的解决办法是加个判断。确保只在release时候执行。
```
applicationVariants.all { variant ->
    if (variant.buildType.name == 'release')
        variant.outputs.all { output ->
            def outputFile = output.outputFile
            if (outputFile != null && outputFile.name.endsWith('.apk')) {
                def fileName = "${defaultConfig.versionName}_${variant.productFlavors[0].name}.apk"
                outputFileName = fileName
                variant.packageApplication.outputDirectory = new File("/Users/joker/Android/AppOutPut/" + defaultConfig.versionName)
            }
        }
}
```
选择打包时候，你可能会发现，你的 buildTypes 中和 Flavors 进行全组合了，这样会导致很杂乱，我们只需要release和Flavors进行组合。

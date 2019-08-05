# xh-image-preview

>基于vue图片预览插件

## 说明
1. 具有预览图片基本功能：放大、缩小、1:1、旋转、拖拽、左右切换
1. 灵活配置：支持图片预览窗尺寸、操作按钮键可配置


## 使用

```
#安装
npm install xh-image-preview 
#引入
import xhImagePreview from 'xh-image-preview'
Vue.use(xhImagePreview)
```
##### 基本用法
```
#预览单张图
<imagePreview :visible.sync="visible" :images="images"></imagePreview>

#预览多张图
#支持左右切换，defaultImage为打开窗口第一张图片，默认为传入图片数组中第一张
<imagePreview :visible.sync="visible" :images="images" :defaultImage="defaultImage"></imagePreview>
```
##### 属性设置
```
#设置图片预览窗尺寸：600px*500px
<imagePreview :visible.sync="visible" :images="images" width="600px" height="500px"></imagePreview>

#设置图片操作按钮键:默认zoomIn,zoomOut,actualSize,rotate,total
<imagePreview :visible.sync="visible" :images="images" layout="zoomIn,zoomOut,rotate"></imagePreview>
```

## 属性介绍

参数| 说明| 类型| 可选值| 默认值
---|---|---|---|---
images | 预览图片集 |Array |— | —
defaultImage | 默认图片 |string |— | images[0]
width/height | 预览窗宽/高 |string |— | 750px/536px
layout | 操作按钮，<br> 参数名用逗号分隔 |string | zoomIn,zoomOut,<br>actualSize,rotate,total | zoomIn,zoomOut,<br>actualSize,rotate,total

## 事件

事件名称| 说明
---|---
prev | 预览上一张图片
next | 预览下一张图片
rotate | 逆时针旋转图片
zoomIn | 放大图片
zoomOut | 缩小图片
actualSize | 预览图片1:1尺寸

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
<template>
<div class="shade_bg" v-show="visible" @click.stop.prevent="" @scroll.stop.prevent="">
	<!-- <div class="image_preview_wapper" @click.stop=""> -->
	<div class="image_preview_wapper" :style="{ width: width, height: height}">
		<!-- 按钮控制器 -->
		<div class="control_bar">
			<div class="title">查看图片</div>
      <div class="image_num" v-show="layoutArr.indexOf('total') != -1">{{imgIndex+1}}/{{imgLen}}</div>
			<div class="control_btn">
				<i v-show="layoutArr.indexOf('zoomIn') != -1" class="zoom_in_icon" @click="zoomIn"></i>
				<i v-show="layoutArr.indexOf('actualSize') != -1" class="default_size_icon" @click="actualSize"></i>
				<i v-show="layoutArr.indexOf('zoomOut') != -1" class="zoom_out_icon" @click="zoomOut"></i>
				<i v-show="layoutArr.indexOf('rotate') != -1" class="rotate_icon" @click="rotate"></i>			
				<i class="splice_line"></i>
				<i class="close_icon" @click="handleClose"></i>
			</div>	
			
		</div>
		<!-- 图片展示区 -->
		<div class="image_show_box" ref="imgShowBox">
			<div class="drag_container" ref="dragContainer"
			@mousewheel.stop.prevent="handleMouseWheel"
			:style="{ 
				left: `${imgStyle.left}px`, 
				top: `${imgStyle.top}px`,
				transform: `scale(${imgStyle.scale}, ${imgStyle.scale}) rotate(${imgStyle.deg}deg)`
				}" >
				<img  ref="img"
				:class="{default_size: !imgStyle.isActualSize}"	
				:src="imgUrl" draggable="false"
				@mousedown.stop.prevent="handleMouseDown"
				/>
			</div>
			<!-- 左右按钮 -->
			<div
				v-show="imgIndex > 0"
				class="btn_prev" 
				@click="prev">
				<i class="prev_icon"></i>
				</div>
			<div
			v-show="imgIndex < imgLen - 1"
			class="btn_next" 
			@click="next">
				<i class="next_icon"></i>
				</div>
		</div>
	</div>
</div>
</template>
<script>
export default {
  name: 'XhImagePreview',
	data() {
		return {
			imgIndex: -1,
			imgUrl: '',
			imgStyle: {
				scale: 1,
				deg: 0,
				top: 0,
				left: 0,
				isActualSize: false,
			},
			// 鼠标坐标
			mousePoint: {
				x: 0,
				y: 0
			},
			showImagePreview: false,
			layoutArr: [],		
		}
	},
	props: {
		images: Array,
		width: {
			type: String,
			default: '750px'
		},
		height: {
			type: String,
			default: '536px'
		},
		defaultImage: {
			type: String,
			default: ''
		},
		layout: {
			type: String,
			default: "total, rotate, zoomIn, zoomOut, actualSize"
		},
		visible: {
			type: Boolean,
			default: false,
		}
	},
	watch: {
		defaultImage() {	
			this.imgUrl = this.defaultImage || this.images[0]
			this.imgIndex = this.images && this.images.indexOf(this.imgUrl)
		},
		images() {
			this.imgUrl = this.defaultImage || this.images[0]
			this.imgIndex = this.images && this.images.indexOf(this.imgUrl)
		},
		imgIndex() {
			this.imgUrl = this.images[this.imgIndex]
		}
	},
	computed: {
		imgLen() {
			return this.images && this.images.length || 0
		},
	},
	beforeDestroy() {

	},
	components: {},
	mounted() {
		// 有默认值传显示默认值，没有默认值，显示照片集第一张
		this.imgUrl = this.defaultImage || this.images && this.images[0] || require('../../../assets/no_data.png')
		this.imgIndex = this.images ? this.images.indexOf(this.imgUrl) : -1
		// 控制器动态显示
		this.layoutArr = this.layout && this.layout.split(',').map((item) => item.trim());
	},
	methods: {
		prev() {
      if (this.imgIndex <= 0) {
        this.imgIndex = this.images.length - 1
      } else {
				this.imgIndex--
      }
			this.resetData()
    },
    next() {
      if (this.imgIndex >= this.images.length - 1) {
        this.imgIndex = 0
      } else {
				this.imgIndex++
			}
			this.resetData()
		},
		rotate() {
			this.imgStyle.deg -= 90;
    },
		zoomIn() {
			this.imgStyle.scale += 0.3
		},
		zoomOut() {
			if (this.imgStyle.scale <= 0.3) {
				return 
			}
			this.imgStyle.scale -= 0.3
		},
		actualSize() {
			this.resetData()
			this.imgStyle.isActualSize = true
			// this.imgStyle.scale = 1
		},
		handleClose() {
			this.$emit('update:visible', false);
			this.resetData()
		},
		resetData() {
			this.imgStyle = {
				scale: 1,
				deg: 0,
				top: 0,
				left: 0,
				isActualSize: false
			}
		},
		// 鼠标事件
		handleMouseDown(e) {
			// 记录鼠标点击时的初始坐标
			 this.mousePoint = {
        x: e.clientX,
        y: e.clientY
			}
			document.onmousemove = this.handleMouseMove
			document.onmouseup = this.handleMouseUp
		},
		handleMouseMove(e) {
			const imgShowBox = this.$refs.imgShowBox.getBoundingClientRect()
			const img = this.$refs.img.getBoundingClientRect()
			/**
			 * rectObject = object.getBoundingClientRect();
			 * rectObject.top：元素上边到视窗上边的距离;
			 * rectObject.bottom：元素下边到视窗上边的距离;
			 * rectObject.left：元素左边到视窗左边的距离;
			 * rectObject.right：元素右边到视窗左边的距离;
			 */
			// 鼠标偏移量 = 初始坐标 - 当前坐标
			let dx = e.clientX - this.mousePoint.x
			let dy = e.clientY - this.mousePoint.y                                     
			// 余留四角60px*60PX不可拖拽
			// 设置左右拖拽范围
			if (dx < 0 && imgShowBox.left + 60 < img.right || dx > 0 && img.left + 60 <= imgShowBox.right) { 
				// 设置每次左右拖拽最大距离
				let newDx = dx > 0 ? Math.min(dx, imgShowBox.right - img.left - 60) : Math.max(dx, -(img.right - imgShowBox.left - 60))
				this.imgStyle.left += newDx
			} 
			// 设置上下拖拽范围
			if (dy < 0 && imgShowBox.top + 60 < img.bottom || dy > 0 && img.top + 60 <= imgShowBox.bottom) {
				// 设置每次上下拖拽最大距离
				let newDy = dy > 0 ? Math.min(dy, imgShowBox.bottom - img.top - 60) : Math.max(dy, -(img.bottom - imgShowBox.top - 60))
				this.imgStyle.top += newDy
			}
			// this.imgStyle.left += e.clientX - this.mousePoint.x
			// this.imgStyle.top += e.clientY - this.mousePoint.y
			this.mousePoint = {
        x: e.clientX,
        y: e.clientY
			}
		},
		handleMouseUp(e) {
			document.onmousemove = null
      document.onmouseup = null
		},
		handleMouseWheel(e) {
			// const wheelDeltaY = e.wheelDeltaY;
      // if (e.wheelDeltaY > 0) {
      //   this.imgStyle.scale += 0.1;
      // } else if (e.wheelDeltaY < 0) {
      //   if (this.imgStyle.scale <= 0.2) {
      //       return;
      //   }
      //   this.imgStyle.scale -= 0.1
      // }
		}
	},
}
</script>
<style lang="scss" scoped>
$imagePreview: '../../../assets/imagePreview';  
.shade_bg {
  position: fixed;
  z-index: 1999;
  top: 0;
  left: 0;
  background:rgba(0,0,0,0.5);
  width: 100%;
  height: 100%;
	// @include shade;
	.image_preview_wapper {
		position: relative;
		top: 50%;
	  left: 50%;
		transform: translate(-50%, -50%);
		width: 750px;
		height: 536px;
    background-color: #fff;
		border-radius: 4px;
		box-shadow:0px 4px 12px 0px rgba(0,0,0,0.2);
		overflow: hidden;
	}
	// 控制条
	.control_bar {
		width: 100%;
		height: 35px;
		line-height: 35px;
    box-sizing: border-box;
		padding: 0 24px;
		border-radius: 4px 4px 0 0;
    background-color: #F5F5F5;
		// display: flex;
		// justify-content: space-between;
		.title, .image_num {
      line-height: 35px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
      float: left;
		}
    .image_num {
      margin-left: 12px;
      color: #595959;
    }
		.control_btn {
			width: 176px;
			height: 100%;
      float: right;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			position: relative;
			i {
				display: block;
				width: 14px;
				height: 14px;
				line-height: 14px;
				margin-left:12px;
				cursor: pointer;
				background-size: 100% 100%;
			}
			.zoom_in_icon {
        background-image: url("../../../assets/imagePreview/zoom_in.svg");
				// @include img('/imagePreview/zoom_in.svg');
				&:hover{
          background-image: url("../../../assets/imagePreview/zoom_in_active.svg");
				}
			}
			.zoom_out_icon {
        background-image: url("../../../assets/imagePreview/zoom_out.svg");
				&:hover{
          background-image: url("../../../assets/imagePreview/zoom_out_active.svg");
				}
			}
			.default_size_icon {
         background-image: url("../../../assets/imagePreview/default_size.svg");
				&:hover{
          background-image: url("../../../assets/imagePreview/default_size_active.svg");
				}
			}
			.rotate_icon{
        background-image: url("../../../assets/imagePreview/rotate.svg");
				&:hover{
          background-image: url("../../../assets/imagePreview/rotate_active.svg");
				}
			}
			.close_icon {
        width: 12px;
				height: 12px;
				background-image: url("../../../assets/imagePreview/close.svg");
				&:hover{
          background-image: url("../../../assets/imagePreview/close_active.svg");
				}
			}
			.splice_line {
				width: 1px;
				height: 14px;
				background-color: #C8C8C8;
			}
		}
	
	}
	// 图片展示区
	.image_show_box {
		width: 100%;
		height: calc(100% - 35px);
		position: relative;
		overflow: hidden;
		// 左右翻页按钮
		.btn_prev, .btn_next {
			position: absolute;
			top: 50%;
			width: 50px;
			height: 50px;
			margin-top: -25px;
			background-size: 100% 100%;
			cursor: pointer;
		}
		.btn_prev {
			left: 16px;
      background-image: url("../../../assets/imagePreview/prev.svg");
			&:hover{
			  background-image: url("../../../assets/imagePreview/prev_active.svg");
			}
		}
		.btn_next {
			right: 16px;
      background-image: url("../../../assets/imagePreview/next.svg");
			&:hover{
        background-image: url("../../../assets/imagePreview/next_active.svg");
			}
		}
	}
	// 拖拽
	.drag_container {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		// transition: transform .4s;
		img {
			cursor: grab;
		}
		img.default_size  {
			max-width: 100%;
			max-height: 100%;
		}
	}

}
</style>

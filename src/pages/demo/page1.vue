<template>
    <div id="page">
      <div class="wrapper">
        <button style="position: absolute;right:0;z-index: 2" @click="upload">使用</button>
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :fixed="option.fixed"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          @realTime="onCubeImg"
        ></vueCropper>
      </div>
    </div>
</template>

<script>
  import request from '@/utils/request'
  import vueCropper from 'vue-cropper'
    export default {
      name: "page1",
      components: {
        vueCropper
      },
      data: function () {
        return {
          crap: false,
          previews: {},
          previews_data:'',
          option: {
            img: '',
            info: true,
            size: 1,
            outputType: 'jpeg',
            canScale: false,
            autoCrop: true,
            // 只有自动截图开启 宽度高度才生效
            autoCropWidth: 200,
            autoCropHeight: 200,
            // 开启宽度和高度比例
            fixed: true,
            fixedNumber: [1, 1],
            centerBox:true,
          },
          downImg: '#'
        }
      },
      methods: {
        upload(){
          var params = {
            user_id: 174,
            headImg:this.previews_data
          };
          request.updateUserHeadImg(params).then(data=>{
          })
        },
        // 确定裁剪图片
        onCubeImg() {
          // 获取cropper的截图的base64 数据
          this.$refs.cropper.getCropData(data => {
            this.previews_data = data;
          })
        },
      },
      mounted(){
        this.option.img = this.$route.query.img_data;
      }
    };
</script>

<style lang="less" scoped>
  #page{
    width: 100%;
    height: 100%;
    .wrapper{
      height: 100%;
    }
  }
</style>

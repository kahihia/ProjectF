<template>
    <div id="page">
      <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color" :showSuc="true" @publish="upload"></head_bar>
      <div class="wrapper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :canMoveBox="option.canMoveBox"
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
  import head_bar from '@/components/head_bar'
  import {getLocalData} from '@/utils/storages';
    export default {
      name: "page1",
      components: {
        vueCropper,
        head_bar
      },
      data(){
        return {
          tab_c:true,
          head:'截图',
          bg_color:'#f4f3f0',
          back_last: true,
          crap: false,
          previews: {},
          previews_data:'',
          option: {
            img: '',
            info: true,
            size: 1,
            outputType: 'jpeg',
            canScale: false,
            canMoveBox: false,
            autoCrop: true,
            // 只有自动截图开启 宽度高度才生效
            autoCropWidth: 300,
            autoCropHeight: 300,
            // 开启宽度和高度比例
            fixed: true,
            fixedNumber: [1, 1],
            centerBox:true,
          },
          downImg: '#',
          upload_type:'',//上传类型
          user_id: getLocalData('user_info').id,//用户id
        }
      },
      methods: {
        upload(){//上传个人头像
            let params = {user_id: this.user_id,headImg:this.previews_data};
            request.updateUserHeadImg(params).then(data=>{
              if(data.data.code==200){
                this.getUserInfo(this.user_id);//重新获取用户信息并存在本地
                this.$router.back(-1);
              }
            })
        },
        // 确定裁剪图片
        onCubeImg() { // 获取cropper的截图的base64 数据
          this.$refs.cropper.getCropData(data => {
            this.previews_data = data;
          })
        },
        getQuery(){
          this.option.img = this.$route.query.img_data;
        }
      },
      mounted(){
        this.getQuery();
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    };
</script>

<style lang="less" scoped>
  #page{
    width: 100%;
    height: 100%;
  }
</style>
<style lang="less">
  #page {
    .wrapper {
      height: 100%;
      .vue-cropper {
        background-image: none;
        background-color: #000;
        .crop-info {
          font-size: 20px;
        }
      }
    }
  }
</style>

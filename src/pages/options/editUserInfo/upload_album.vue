<template>
    <div id="uploadAlbum">
      <head_bar :backLast="back_last" :cancel="cancel" :tab_c="tab_c"
                :head="head" :bg_color="bg_color" :show_edit="show_edit"
                :check_all="check_all" @edit="editAlbum" @cancel="cancelEdit" @checkAll="checkAll">
      </head_bar>
      <div class="album_wrap">
        <div class="mixin-center" v-if="album_data.length===0"><img src="../images/nullPic.png"></div>
        <div class="album_item" v-else v-for="(item,index) in album_data" :key="index">
          <img :src="imgUrl(item.img)" class="mixin-img"/>
          <div class="not_checked checked" ref="cover" @click="selectItem($event,item)">
            <img src="../images/selected.png" />
          </div>
        </div>
      </div>
      <div class="upload_wrap">
        <div class="in_wrap">
          <button class="upload_btn" v-show="upOrDel" @click="ex_show=true">上传照片</button>
          <button class="upload_btn delete_btn" v-show="!upOrDel" @click="deleteAlbum">删除</button>
        </div>
      </div>
      <div class="img_upload" v-if="ex_show">
        <div class="input_wrap">
          <input type="file" ref="uploads" id="upload_camera" name="file" multiple="multiple" accept="image/*" capture="camera" @change="uploadAlbum('upload_camera')">
          <input type="file" ref="uploads" id="upload_file" name="file" multiple="multiple" accept="image/*" @change="uploadAlbum('upload_file')">
        </div>
      </div>
      <actionsheet v-model="ex_show" :menus="menu" show-cancel></actionsheet>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  import {formatDateTime} from '@/utils/format';
  import {Actionsheet} from 'vux';
    export default {
      name: "upload_album",
      components:{head_bar,Actionsheet},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'相册',
          checked:false,
          bg_color:'#f4f3f0',
          show_edit:true,
          check_all:false,
          upOrDel:true,
          cancel:false,
          timeStamp:formatDateTime(new Date()),//时间戳
          album_data:[],
          ex_show:false,
          menu:{
            menu1: '拍照',
            menu2: '从相册中选择'
          },
          album_ids:[],//相册id数组
          user_info: getLocalData('user_info'),//用户信息
          roles:this.$route.query.roles,
          upload_data:{//上传信息
            base_img:'',
            imgGroup:[]
          }
        }
      },
      methods:{
        getUserAlbum(){
          let params = {user_id:this.user_info.id,timeStamp:this.timeStamp};
          request.getUserPhotoAlbum(params).then(res=>{
            this.album_data = res.data.data;
          })
        },
        getMerchantsAlbum(){
          let params = {
            merchants_id:String(this.user_info.merchants_id),
            is_merchants_get:String(1),
            timeStamp:this.timeStamp
          };
          request.getMerchantsAlbum(params).then(res=>{
            this.album_data = res.data.data;
          })
        },
        uploadAlbum(idname){//多选上传图片
          let that=this;
          let files = document.getElementById(idname).files;
          let length = files.length;
          if(length<=1){
            that.compress(files[0]);
          }else {
            for(let i in files){
              if(i<files.length){
                that.compress(files[i])
              }
            }
          }
        },
        compress(item){//压缩图片上传
          let that=this;
          lrz(item, { width: 480 }).then(function(result) {
            let img = new Image();
            img.src = result.base64;
            return result;
          }).then(function (result) {
            if(that.roles=='user'){
              let params={user_id:that.user_info.id,img:result.base64};
              request.uploadUserPhotoAlbum(params).then(res=>{
                that.ex_show=false;
                that.getUserAlbum();
              })
            }else if(that.roles=='merchant'){
              let params={
                img:result.base64
              };
              request.uploadOneImg(params).then(res=>{
                that.ex_show=false;
                let img_src=res.data.data;
                if(res.data.code===200){
                  let add_params={
                    merchants_id:that.user_info.merchants_id,
                    img:img_src,
                    timeStamp:that.timeStamp
                  };
                  request.addMerchantsPhotoAlbum(add_params).then(res=>{
                    if(res.data.code===200){
                      that.getMerchantsAlbum()
                    }
                  })
                }
              })
            }
          });
        },
        selectItem(event,item){//选择图片
          if(this.check_all){
            if (event.target.className.indexOf("cover_selected checked") == -1) {
              event.target.className = "cover_selected checked";//切换按钮样式
              //写逻辑
              this.album_ids.push(item.id);
            } else {
              event.target.className = "not_checked checked";//切换按钮样式
              //写逻辑
              this.album_ids.map((val,key)=>{
                if(val==item.id){
                  this.album_ids.splice(key,1);
                }
              });
            }
          }
        },
        editAlbum(){//编辑相册
          this.show_edit=false;//隐藏编辑按钮
          this.back_last=false;//隐藏返回按钮
          this.check_all=true;//显示全选按钮
          this.cancel=true;//显示取消按钮
          this.upOrDel=false;//切换为删除按钮
        },
        cancelEdit(){//取消编辑
          this.show_edit=true;
          this.back_last=true;
          this.check_all=false;
          this.cancel=false;
          this.upOrDel=true;//切换为删除按钮
          this.$refs.cover.map((val,key)=>{
            this.$refs.cover[key].className='not_checked checked'
          });
          this.album_ids=[];
        },
        checkAll(){//全选
          this.$refs.cover.map((val,key)=>{
            this.$refs.cover[key].className='cover_selected checked';
            this.album_ids.push(this.album_data[key].id);
          })
        },
        deleteAlbum(){//删除相册图片
          if(this.album_ids.length>0){
            let ids_str = this.album_ids.join(',');
            if(this.roles==='user'){
              let params={id:ids_str,timeStamp:this.timeStamp};
              request.deleteUserPhotoAlbum(params).then(res=>{
                if(res.data.code==200){
                  this.cancelEdit();
                  this.getUserAlbum();
                  this.$refs.cover.map((val,key)=>{
                    this.$refs.cover[key].className='not_checked checked'
                  });
                }
              });
            }else if(this.roles==='merchant'){
              let params={
                merchants_id:this.user_info.merchants_id,
                id:ids_str,
                timeStamp:this.timeStamp
              };
              request.deleteMerchantsPhotoAlbum(params).then(res=>{
                this.cancelEdit();
                if(res.data.code===200){
                  this.album_ids=[];
                  this.getMerchantsAlbum()
                }
              })
            }
          }
        },
        judgeRole(){
          if(this.roles==='user'){
            this.getUserAlbum();
          }else if(this.roles==='merchant'){
            this.getMerchantsAlbum()
          }
        }
      },
      mounted(){
        this.judgeRole();
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../assets/less/reset";
  #uploadAlbum{
    position: relative;
    min-height: 100%;
    background-color: @bg-b;
    padding-top: 90px;
    .album_wrap{
      padding-top: 10px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .album_item{
        position: relative;
        width: 242px;
        height: 243px;
        float: left;
        margin: 4px;
        .checked{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          img{
            position: absolute;
            bottom: 20px;
            right: 20px;
          }
        }
        .cover_selected{
          background-color: rgba(0, 0, 0, 0.3);
        }
        .not_checked{
          opacity: 0;
        }
      }
    }
    .upload_wrap{
      position: fixed;
      bottom: 40px;
      left:50%;
      transform:translateX(-50%);
      .in_wrap{
        position: relative;
        input{
          position: absolute;
          display: block;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        .upload_btn{
          display: block;
          border: none;
          .mixin-setButton(500px,60px,@G1,@sign_bg,24px,none);
          .mixin-borderRadius(8px);
          box-shadow: 0 5px 9px 0
          rgba(0, 1, 1, 0.14);
        }
        .delete_btn{
          .mixin-setButton(500px,60px,@W1,@G1,24px,none);
        }
      }
    }
    .img_upload{
      position: fixed;
      left: 0;
      bottom: 77px;
      width: 100%;
      z-index: 5001;
      .input_wrap{
        input{
          width: 100%;
          display: block;
          position: relative;
          padding: 20px 0;
          opacity: 0;
          font-size: 24px;
        }
      }
    }
  }
</style>
<style lang="less">
  #uploadAlbum{
    .weui-actionsheet__cell{
      font-size: 24px;
      padding: 20px 0;
    }
  }
</style>

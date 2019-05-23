<template>
  <div id="evaluate">
    <head_bar :backLast="true" :tab_c="true" @publish="reportEva"
              :head="head" :bg_color="bg_color" :showSuc="true">
    </head_bar>
    <div class="content">
      <div class="evaluate_wrap card">
        <div class="evaluate_up" v-for="(item,index) in rules" v-if="index===0">
          <img :src="imgUrl(goods_query.goods_img)" class="goods_img">
          <span class="c-a mid_text">{{item.merchants_comments_name}}</span>
          <rater v-model="star[index]" star="★" active-color="#fac917" :margin="4"></rater>
        </div>
        <div class="evaluate_down">
          <textarea name="" class="textArea c-j" cols="30" rows="10" v-model="comment_content"
                    placeholder="此次购物体验满意吗，可以在这里说说你的感受哦！">
          </textarea>
          <div class="pic_wrap">
            <div class="item_pic" v-for="(item,index) in eva_images">
              <img class="del_btn" src="../../assets/images/icon/icon_del.png" @click="delEvaImages(index)">
              <img class="eva_image" :src="imgUrl(item)">
            </div>
            <div class="item_pic">
              <input class="input_val" id="eva_pic" ref="uploads" type="file" name="cover"
                     accept="image/*" @change="upOneImg('eva_pic',4)" multiple/>
              <img src="./images/icon_camera.png">
            </div>
          </div>
        </div>
        <div class="evaluate_up" v-for="(item,index) in rules" v-if="index>0">
          <span class="c-a mid_text">{{item.merchants_comments_name}}</span>
          <rater v-model="star[index]" star="★" active-color="#fac917" :margin="4"></rater>
        </div>
      </div>
    </div>
    <div class="notice" v-transfer-dom>
      <popup v-model="show_notice" position="top" :show-mask="false">
        <div class="position-vertical-demo">{{noticeMsg}}</div>
      </popup>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import {Rater} from 'vux';
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  import {Popup,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "evaluate",
      components:{head_bar,Rater,Popup},
      directives: {TransferDom},
      data(){
        return{
          head:'发表评论',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),
          timeStamp:formatDateTime(new Date()),//时间戳
          goods_query:{
            order_id:this.$route.query.order_id,
            goods_img:this.$route.query.goods_img,
          },
          star:[],
          comment_content:'',
          rules:[],
          eva_images:[],//评论图片
          show_notice:false,
          noticeMsg:'',//提示信息
        }
      },
      methods:{
        commentRoles(){
          let comment_rules={};
          this.rules.map((val,key)=>{
            comment_rules[val.id]=this.star[key];
          });
          return comment_rules
        },
        reportEva(){
          let comment_roles=encodeURIComponent(JSON.stringify(this.commentRoles()));
          let params={
            comment_user_id:String(this.user_info.id),
            comment_object_goods_order_id:String(this.goods_query.order_id),
            merchants_comment_rules:comment_roles,
            comment_content:this.comment_content,
            comment_img:this.eva_images.join(','),
          };
          request.commentsMerchantsGoods(params).then(res=>{
            this.show_notice=true;
            this.noticeMsg=res.data.message+',2秒后自动跳转...';
            setTimeout(()=>{
              this.$router.back(-1)
            },2000)
          })
        },
        upOneImg(idname,index){
          let that=this;
          let files = document.getElementById(idname).files;
          let length = files.length;
          if(length<=1){
            that.compress(files[0],index)
          }else {
            for(let i in files){
              if(i<files.length){
                that.compress(files[i],index)
              }
            }
          }
        },
        compress(item,index){//压缩图片上传
          let that=this;
          lrz(item, { width: 480 }).then(function(result) {
            let img = new Image();
            img.src = result.base64;
            return result;
          }).then(function (result) {
            let params={img:result.base64};
            request.uploadOneImg(params).then(res=>{
              that.eva_images.push(res.data.data)
            })
          });
        },
        delEvaImages(index){
          this.eva_images.splice(index,1)
        },
        getRules(){
          let params={timeStamp:this.timeStamp};
          let rules=[];
          request.getMerchantsCommentsRules(params).then(res=>{
            rules=res.data.data;
            rules.map((val,key)=>{
              this.star.push(0)
            });
            this.rules=rules;
          })
        }
      },
      created(){
        this.getRules();
      },
      mounted(){
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .card{
    background-color: @bg-c;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px)
  }
  #evaluate{
    min-height: 100%;
    background-color: @bg-b;
    .content{
      padding: 90px 32px 0;
      .evaluate_wrap{
        margin-top: 20px;
        padding: 40px 20px;
        .evaluate_up{
          display: flex;
          align-items: center;
          border-top: 1px solid @border_c;
          padding: 20px 0 0;
          &:first-child{
            border-bottom: 1px solid @border_c;
            border-top: none;
            padding: 0;
            .mid_text{
              margin: 0 20px;
            }
          }
          .goods_img{
            width: 80px;
            height: 80px;
          }
          .mid_text{
            margin-right: 20px;
          }
        }
      }
      .evaluate_down{
        .textArea{
          display: block;
          margin-top: 20px;
          width: 100%;
          height: 120px;
          border: none;
        }
        .pic_wrap{
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin: 20px 0;
          .item_pic{
            position: relative;
            margin-right: 20px;
            &:last-child{
              width: 154px;
              height: 130px;
              margin-right: 0;
              .input_val{
                position: absolute;
                display: block;
                width: 100%;
                height: 100%;
                opacity: 0;
              }
            }
            .eva_image{
              height: 130px;
            }
          }
        }
      }
    }
  }
</style>

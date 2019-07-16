<template>
  <div class="comment_wrap">
    <head_bar :backLast="back_last" :tab_c="true" :head="head" :bg_color="bg_color">
    </head_bar>
    <ul class="comment_list">
      <li class="comment_item" v-for="(item,index) in comment_list" :key="index">
        <div class="up_info">
          <div class="user_info">
            <div class="head_img"><img class="mixin-img" :src="imgUrl(item.head_img)"/></div>
            <span class="user_name c-o">{{item.user_name}}</span>
          </div>
          <div><img v-for="i in item.merchants_goods_comments_star_level" src="../../assets/images/icon/icon_star.png"/></div>
        </div>
        <div class="mid_text c-a">{{item.comment_content}}</div>
        <div class="down_imgs">
          <ul class="img_wrap">
            <li class="img_item" v-if="item.comment_img" v-for="(val,key) in item.comment_images" :key="key">
              <img class="previewer-img" :preview="index"  :preview-text="item.comment_content" :src="imgUrl(val)"/>
            </li>
          </ul>
          <!--放大图片组件-->
          <!--<div v-transfer-dom  v-if="item.comment_img">-->
          <!--</div>-->
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import head_bar from '@/components/head_bar'
  import {Previewer,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "comment",
      components: {Previewer,head_bar},
      directives: {
        TransferDom,
      },
      data(){
        return{
          back_last:true,
          head:'评论详情',
          bg_color:'#f4f3f0',
          comment_list:[],
          is_off:this.$route.query.is_off,
          goods_id:this.$route.query.goods_id,
        }
      },
      methods:{
        //获取商品评价列表
        getGfComments(){
          let that = this;
          let params={
            timeStamp:formatDateTime(new Date())
          };
          request.getGfGoodsComments(params).then(res=>{
            let comment_list = res.data.data;
            comment_list.forEach((val,key)=>{
              if(val.comment_img){
                val.comment_images=val.comment_img.split(',');
              }
            });
            this.comment_list=comment_list;
            this.$previewRefresh()
          })
        },
        getComments(){
          let that = this;
          let params = {goods_id:this.goods_id,timeStamp:formatDateTime(new Date())};
          request.getGoodsComments(params).then(res=>{
            let comment_list = res.data.data;
            comment_list.forEach((val,key)=>{
              val.comment_images=val.comment_img.split(',');
            });
            this.comment_list=comment_list;
            this.$previewRefresh()
          })
        },
        // 放大图片
        show (key,index) {
          this.show_index=index;
          console.log(this.$refs.previewer[index]);
          this.$refs.previewer[index].show(key);
        },
      },
      mounted() {
        if(this.is_off==0){
          this.getComments();
        }else if(this.is_off==1){
          this.getGfComments();
        }
        console.log(this.preview);
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed() {
        this.$store.commit('updateBottomNav', {showBottomNav: true})
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .comment_wrap{
    padding: 110px 32px;
    .head_title{
      position: relative;
      margin-bottom: 18px;
      .title{
        display: flex;
      }
    }
    .comment_list{
      .comment_item{
        margin-bottom: 30px;
        &:last-child{
          margin-bottom: 0;
        }
        .up_info{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          .user_info{
            display: flex;
            align-items: center;
            .head_img{
              width: 64px;
              height: 64px;
              .mixin-borderRadius(50%);
              overflow: hidden;
              margin-right: 18px;
            }
          }
        }
        .mid_text{
          .mixin-cliptext(2);
          margin-bottom: 13px;
        }
        .down_imgs{
          .img_wrap{
            display: flex;
            flex-wrap: wrap;
            .img_item{
              flex: 0 0 33.3333%;
              img{
                width: 222px;
                height: 160px;
                text-align: center;
                line-height: 160px;
              }
            }
          }
        }
      }
    }
  }
</style>

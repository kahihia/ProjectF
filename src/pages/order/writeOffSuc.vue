<template>
    <div id="writeOffSuc">
      <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
        <div class="container">
          <div class="up-wrap">
            <img class="up-img" src="./images/icon_suc.png">
            <p class="t_h wsuc">核销成功</p>
            <p class="c-t">消费成功，稍后可在-我的订单-中查看您的订单状态</p>
            <div class="btn-g">
              <button class="item-btn back-index" @click="toIndex">返回首页</button>
              <button class="item-btn to-comment" @click="reportEva(good_id,good_img)">去评论</button>
            </div>
          </div>
          <img class="divide" src="./images/guess.png">
          <div class="down-wrap">
            <div class="good-item clearfix" v-for="(item,index) in goods_list" @click="getGoodsInfo(item.id,item.distance)">
              <div class="good-img _left">
                <img class="mixin-img" :src="imgUrl(item.merchants_goods_img[0])">
              </div>
              <div class="good-txt _left">
                <div class="name ellipsis">
                  {{item.merchants_goods_name}}
                  <em class="c-b" v-if="item.distance">{{item.distance}}</em>
                </div>
                <div class="evaluate ellipsis">
                  <img v-for="i in item.merchants_goods_comments_star_level" src="../../assets/images/icon/icon_star.png"/>
                  <i class="c-b">{{item.merchants_goods_comments_number}}评价</i>
                </div>
                <em class="mark mixin-centerTop" v-show="item.merchants_goods_type==2">团</em>
                <div class="shop-name c-a ellipsis">
                  {{item.merchants_name}}
                </div>
                <div class="time ellipsis c-a">
                  {{item.merchants_goods_available_time}}
                  <span v-if="item.signEndTime==1">最后一天</span>
                </div>
                <div class="c-c price">
                  <div class="left-txt">
                    <span class="t-b-b">
                      ￥<em>{{item.merchatns_goods_platform_discount_price}}</em>
                    </span>
                    <em class="p-original c-Bc">原价 <span class="delete_line">￥{{item.merchatns_goods_platform_price}}</span></em>
                  </div>
                  <div class="right-sold c-b">已售{{item.merchants_goods_sold}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {formatDateTime} from '@/utils/format';
  import {getLocalPosition,getLocalData} from '@/utils/storages';
  import {getGreatCircleDistance,stop,move} from '@/utils/utils'
  import request from '@/utils/request';
  import {wxPayment} from '@/utils/wxInit';
    export default {
      name: "writeOffSuc",
      components:{head_bar},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'订单核销',
          bg_color:'#f4f3f0',
          good_id:'',
          good_img:'',
          timeStamp:formatDateTime(new Date()),
          goods_data:[],
          goods_list:[]
        }
      },
      methods:{
        getSimilarMerchantsGoodsLists(good_id){
          let that = this;
          let params={
            goods_id:good_id,
            timeStamp:this.timeStamp
          };
          request.getSimilarMerchantsGoodsLists(params).then(res=>{
            let resData = res.data;
            let goods_list=res.data.data;
            if(res.data.code==200){
              goods_list.map((item,index)=>{
                item.goods_imgArr = item.merchants_goods_img.split(',');
                // 距离
                getLocalPosition('position')?item.distance = getGreatCircleDistance(getLocalPosition('position').lat,
                  getLocalPosition('position').lng,item.merchants_latitude, item.merchants_longitude):item.distance='';
                // 图片
                item.merchants_goods_img = item.merchants_goods_img.split(",");
                if(item.merchants_goods_type==2){
                  let avalid_time = JSON.parse(item.merchants_goods_available_time);
                  let valid_arr=[];
                  let time_arr=[];
                  for (let key in avalid_time){
                    valid_arr.push(that.weekFn(key));
                    time_arr=avalid_time[key];
                  }
                  let week_str = valid_arr.join(',');
                  let time_str = time_arr.join(',');
                  item.merchants_goods_available_time=week_str+' '+time_str;
                }
              });
            }else {
              this.goods_data = resData;
            }
            this.goods_list=goods_list;
          })
        },
        //跳转商品详情
        getGoodsInfo(good_id,distance){
          this.$router.push({path:'/goodsdetail',query:{good_id:good_id,distance:distance}})
        },
        reportEva(order_id,goods_img){
          this.$router.push({path:'/evaluate',query:{order_id:order_id,goods_img:goods_img}})
        },
        toIndex(){
          this.$router.push({path:'/'})
        }
      },
      mounted(){
        this.good_id=this.$route.query.good_id;
        this.good_img=this.$route.query.good_img;
        this.getSimilarMerchantsGoodsLists(this.$route.query.good_id);
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #writeOffSuc{
    min-height: 100%;
    background-color: @bg-b;
    .container{
      padding: 110px 32px 90px;
      .up-wrap{
        width:100%;
        padding: 42px 20px;
        background:rgba(255,255,255,1);
        box-shadow:0 0 15px 1px rgba(0,1,1,0.05);
        .mixin-borderRadius(10px);
        text-align: center;
        .up-img{
          width: 140px;
        }
        .wsuc{
          margin: 50px 0 27px;
        }
        .btn-g{
          display: flex;
          justify-content: space-between;
          width: 485px;
          margin: 63px auto 0;
          .item-btn{
            border: none;
            .mixin-borderRadius(10px)
          }
          .back-index{
            .mixin-setButton(160px,60px,@W1,@G1,24px,none);
          }
          .to-comment{
            .mixin-setButton(160px,60px,@G1,@Y2,24px,none);
          }
        }

      }
      .divide{
        width: 100%;
        margin: 40px 0 20px;
      }
      .good-item {
        width: 100%;
        background: @bg-c;
        padding: 24px;
        .mixin-borderRadius(12px);
        margin-bottom: 8px;
        .good-img {
          display: block;
          width: 170px;
          height: 170px;
          margin-right: 20px;
        }
        .good-txt {
          width: calc(100% - 190px);
          position: relative;
          .name {
            width: 80%;
            padding-bottom: 4px;
            font-size: 26px;
            font-weight: bold;
            color: #363636;
            em {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
          .evaluate {
            padding-bottom: 6px;
            position: relative;
            padding-right: 68px;
            img {
              margin-left: 4px;
              &:first-child {
                margin-left: 0;
              }
            }
            em {
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              width: 62px;
              background: @hot;
              color: @bg-c;
              font-size: 18px;
              text-align: center;
              padding: 6px 0;
            }
          }
          .shop-name {
            padding-bottom: 4px;
          }
          .time {
            padding-bottom: 8px;
            span {
              color: @sign;
              border: 1px solid @sign;
              padding: 2px;
              .mixin-borderRadius(4px);
            }
          }
          .price {
            position: relative;
            .left-txt {
              span {
                position: relative;
                em {
                  background: linear-gradient(to bottom, #fff 0%, #fff 28%, @Y2 30%, @Y2 100%);
                  padding-left: 2px;
                  padding-right: 6px;
                }
                .p-original {
                  padding-left: 12px;
                }
              }
            }
            .right-sold {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }
    }
  }
</style>

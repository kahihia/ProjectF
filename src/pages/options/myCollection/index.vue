<template>
  <div id="MyCollection">
    <head_bar :backLast="back_last" :cancel="cancel" :tab_c="tab_c"
              :head="head" :bg_color="bg_color" :show_edit="show_edit"
              :check_all="check_all">
    </head_bar>
    <div class="content">
      <div class="collect_item card" v-for="(item,key) in collect_list">
        <div class="Header" @click="toMerchants(item.merchants_goods_merchants_id,item.distance)">
          <div class="Shop">
            <div class="ShopImg"><img class="mixin-img" :src="imgUrl(item.merchants_img)"/></div>
            <div class="ShopName c-a">{{item.merchants_name}}</div>
            <img  src="./images/icon_left.png" class="icon_left">
          </div>
          <div class="getCard c-a">领券</div>
        </div>
        <div class="GoodsDeil" @click="toGoodDetail(item.goods_id,item.distance)">
          <!--<div class="Select"></div>-->
          <!--<div class="GoodsImg" :style="{background:'url('+GoodsImg+') center/cover no-repeat'}"></div>-->
          <div class="GoodsImg"><img class="mixin-img" :src="imgUrl(item.goods_img)"/></div>
          <div class="GoodsText">
            <div class="GoodsName">
              <span class="Name">{{item.merchants_goods_name}}</span>
              <span class="c-b">760m</span>
            </div>
            <div class="evaluat">
              <img src="./images/icon_star.png" v-for="i in item.merchants_goods_comments_star_level" >
              <span>{{item.merchants_goods_comments_number}} 评价</span>
            </div>
            <div class="time c-a">{{item.merchants_goods_available_time}}</div>
            <div class="c-c price">
              <div class="left-txt">
            <span class="t-b-b">
              ￥<em>{{item.merchatns_goods_platform_discount_price}}</em>
            </span>
                <em class="p-original c-Bc">原价 ￥{{item.merchatns_goods_platform_price}}</em>
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
  import head_bar from '@/components/head_bar';
  import request from '@/utils/request';
  import {getLocalData,getLocalPosition} from '@/utils/storages';
  import {getGreatCircleDistance} from '@/utils/utils'
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "index",
      components:{head_bar},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'我的收藏',
          checked:false,
          bg_color:'#f4f3f0',
          show_edit:true,
          check_all:false,
          upOrDel:true,
          cancel:false,
          timeStamp:formatDateTime(new Date()),//时间戳
          user_info:getLocalData('user_info'),//用户信息
          collect_list:[],//收藏列表
        }
      },
      methods:{
        toGoodDetail(good_id,distance){
          this.$router.push({
            path:'/goodsdetail',
            query:{good_id:good_id,distance:distance}
          })
        },
        toMerchants(id,distance){
          this.$router.push({
            path:'/shopdetail',
            query:{merchant_id:id,distance:distance}
          })
        },
        getCollectGoods(){
          let that = this;
          let params={
            user_id:this.user_info.id,
            timeStamp:formatDateTime(new Date())
          };
          request.getUserCollectionGoodsLists(params).then(res=>{
            this.collect_list=res.data.data;
            this.collect_list.map((item,key)=>{
              // 距离
              getLocalPosition('position')?item.distance = getGreatCircleDistance(getLocalPosition('position').lat,
                getLocalPosition('position').lng,item.merchants_latitude, item.merchants_longitude):item.distance='';
              // 时间格式
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
                item.goods_img=item.merchants_goods_img.split(',')[0];
              }
            })
          })
        }
      },
      created(){
        this.getCollectGoods();
      },
      mounted() {
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed() {
        this.$store.commit('updateBottomNav', {showBottomNav: true})
      }
    }
</script>

<style lang="less" scoped>
  @import "../../../assets/less/reset";
  .card{
    background-color: @W1;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px);
  }
  #MyCollection{
    position: relative;
    width: 100%;
    min-height: 100%;
    padding-top: 90px;
    background-color: @bg-b;
    .content{
      padding: 20px 32px;
      box-sizing: border-box;
      .collect_item{
        padding: 20px;
        margin-bottom: 16px;
        &:last-child{
          margin-bottom: 0;
        }
        .Header{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .Shop{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .ShopImg{
              width: 50px;
              height: 50px;
              border-radius: 50%;
              overflow: hidden;
            }
            .ShopName{
              margin-left: 10px;
            }
            .icon_left{
              margin-left: 10px;
              width: 10px;
            }
          }
          .getCard{

          }
        }
        .GoodsDeil{
          display: flex;
          align-items: center;
          margin-top: 20px;
          .Select{
            width: 20px;
            height: 30px;
            background-color: #53d499;
            border-radius: 50%;
          }
          .GoodsImg{
            width: 170px;
            height: 170px;
          }
          .GoodsText{
            width: 400px;
            margin-left: 20px;
            flex: 1;
            .GoodsName{
              display: flex;
              justify-content: space-between;
              line-height: 40px;
              .Name{
                font-size: 26px;
                color: #252525;
              }
            }
            .evaluat{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              img{
                width: 20px;
                height: 20px;
              }
              span{
                font-size: 24px;
                color: #909090;
              }
            }
            .time{
              line-height: 40px;
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
  }
</style>

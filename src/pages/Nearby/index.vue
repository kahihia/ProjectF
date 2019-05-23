<template>
    <div id="Nearby">
      <head_bar :headTitle="head_title" :tab_d="tab_d" :tab_d_img="1" :bg_color="bg_color"></head_bar>
      <div class="near_content">
        <AMap_comp></AMap_comp>
        <div class="shop_list mixin-centerLeft scrollbar">
          <div v-for="(item,index) in merchantsList" class="shop_item borderBox marginB8" @click="toShopInfo(item.id,item.distance)">
            <div class="goods_img">
              <img class="mixin-img" :src="imgUrl(item.merchantCoverImg)" :onerror="$store.state.remix.errorImg">
            </div>
            <div class="shop_info ellipsis">
              <div class="shop_name marginB8">
                <span class="t-b-b name ellipsis">{{item.merchants_name}}</span>
                <span class="c-b">{{item.distance}}</span>
              </div>
              <div class="star_icon marginB18" v-if="item.merchants_comments_count">
                <!--<img v-for="(val,key) in val.merchants_comments_star_level" src="@/assets/images/icon/icon_star.png"/>-->
                <i class="c-b">{{item.merchants_comments_count}} 评价</i>
              </div>
              <div v-else class="marginB8 c-b">暂无评价</div>
              <div class="c-a marginB8">5折优惠</div>
              <div class="c-a">{{item.merchants_address}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import AMap_comp from '@/components/AMap_comp'
  import {getLocalData,getLocalPosition} from '@/utils/storages';
  import request from '@/utils/request';
  import {getGreatCircleDistance} from '@/utils/utils'
  import {formatDateTime} from '@/utils/format';
  import head_bar from '@/components/head_bar'
    export default {
      name: "index",
      components:{
        AMap_comp,
        head_bar,
      },
      data(){
        return{
          head_title:'附近',
          tab_d:true,
          merchantsList:[],//商铺列表
          defaultImg: 'this.src="' + require('@/assets/images/default_img.png') + '"',//默认图片
          bg_color:'#f4f3f0',//头部背景色
        }
      },
      methods:{
        getMerchantsList(){
          let that = this;
          let params = {
            user_id:getLocalData('user_info').id,
            longitude:getLocalData('position').position.lng,
            latitude:getLocalData('position').position.lat,
            distance:5000000,
            timeStamp:formatDateTime(new Date()),
          };
          request.getMerchants(params).then(res=>{
            let merchantsList = res.data.data;
            merchantsList.map((val,key)=>{
              val.merchants_comments_star_level = Number(val.merchants_comments_star_level);
              val.distance = getGreatCircleDistance(getLocalPosition('position').lat, getLocalPosition('position').lng, val.merchants_latitude, val.merchants_longitude);
              val.merchantCoverImg = val.merchants_img.split(',')[0]
            });
            that.merchantsList = merchantsList
          })
        },
        toShopInfo(id,distance){
          this.$router.push({path:'/shopdetail',query:{merchant_id:id,distance:distance}})
        }
      },
      created(){
        this.$store.commit('selectedTab',{tab_index:1});
        this.$store.commit('userOrMerchant',{is_merchant:false});//显示用户端tabbar
        this.getMerchantsList();
      },
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .marginB8{margin-bottom: 8px}
  .marginB18{margin-bottom: 18px}
  .marginB15{margin-bottom: 15px}
  #Nearby{
    height: 100%;
    .near_content{
      height: 100%;
      .shop_list{
        position: absolute;
        bottom: 48px;
        width: 689px;
        height: 476px;
        overflow: scroll;
        .shop_item{
          display: flex;
          height: 234px;
          background-color: @bg-c;
          box-shadow: 0 0 15px 0
          rgba(0, 1, 1, 0.05);
          .mixin-borderRadius(12px);
          padding: 32px 24px;
          margin-bottom: 8px;
          .goods_img{
            width: 170px;
            height: 170px;
            margin-right: 20px;
          }
          .shop_info{
            flex: 0 0 70%;
            .shop_name{
              display: flex;
              justify-content: space-between;
              align-items: center;
              .name{
                max-width: 340px;
              }
            }
          }
        }
      }
    }
  }
</style>

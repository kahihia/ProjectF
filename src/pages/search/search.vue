<template>
  <div id="search">
    <x-search
    :results="results"
    @result-click="resultClick"
    v-model="value"
    @on-change="getResult"
    auto-fixed
    auto-scroll-to-top
    @on-cancel="backPath"
    :placeholder="placeholder"
    ref="searches">
    </x-search>
    <div class="searchGoods">
      <div class="good-item clearfix" v-for="(item,index) in results" @click="resultClick(item.id,item.distance)">
        <div class="good-img _left">
          <img class="mixin-img" :src="imgUrl(item.merchants_goods_img[0])">
        </div>
        <div class="good-txt _left">
          <div class="name t-b">
            <div class="identification">
              <img v-show="item.is_official==1" class="ident-img" src="@/assets/images/common/findif.png">
              <img v-show="item.merchants_goods_type==2&&item.is_official==0" class="ident-img" src="@/assets/images/common/spell.png">
              <p class="ellipsis c-Bd good-name">{{item.merchants_goods_name}}</p>
            </div>
            <em class="c-b" v-if="item.distance">{{item.distance}}</em>
          </div>
          <div class="evaluate ellipsis">
            <img v-for="i in item.merchants_goods_comments_star_level" src="../../assets/images/icon/icon_star.png"/>
            <i class="c-b">{{item.merchants_goods_comments_number}}评价</i>
          </div>
          <div class="shop-name c-a ellipsis">
            {{item.merchants_name}}
          </div>
          <div v-show="item.is_official==0" class="time ellipsis c-a">
            {{item.merchants_goods_available_time}}
            <span v-if="item.signEndTime==1">最后一天</span>
          </div>
          <div v-show="item.is_official==1" class="time ellipsis c-a">
            {{item.merchants_goods_field_time}}
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
</template>

<script>
  import {Search} from 'vux'
  import {getLocalData,getLocalPosition} from '@/utils/storages';
  import {getGreatCircleDistance} from '@/utils/utils'
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "search",
      components:{'x-search':Search},
      data(){
        return{
          user_info:getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          results: [],
          value: '',
          goods_list:[],
          last_path:this.$route.query.last_path,//上一个路径
          placeholder:this.$route.query.placeholder,//提示信息
        }
      },
      methods:{
        setFocus () {
          this.$refs.searches.setFocus();
        },
        getResult (val) {
          let that = this;
          let res_arr = [];
          this.getResultFn(val).then(res=>{
            res.map((item,index)=>{
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
              res_arr.push(item);
            });
            this.results=val?res_arr : [];
            console.log(this.results)
          })
        },
        getResultFn (val) {
          let params={
            is_merchants_get:0,
            search_name:val,
            timeStamp:this.timeStamp
          };
          return new Promise((resolve, reject)=>{
            request.getGoodslist(params).then(res=>{
              resolve(res.data.data);
            })
          })
        },
        resultClick(id,dis){
          this.$router.push({path:'/goodsdetail',query:{good_id:id,distance:dis}})
        },
        backPath(){
          this.$router.push({path:this.last_path})
        }
      },
      mounted(){
        this.setFocus();
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>
<style lang="less">
  @import "../../assets/less/reset";
  #search{
    background: @bg-b;
    width: 100%;
    min-height: 100%;
    padding-top: 90px;
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
          em {
            position: absolute;
            right: 0;
            top: 0;
          }
        }
        .identification{
          display: flex;
          align-items: center;
          .ident-img{
            width: 70px;
            height: 30px;
          }
          .good-name{
            max-width: 100%;
            margin-left: 10px;
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
</style>
<style lang="less">
  #search{
    .vux-search-box{
      .weui-search-bar{
        height: 80px;
        .weui-search-bar__form{
          .weui-search-bar__box{
            line-height: 72px;
            padding-left: 50px;
            .weui-icon-clear{
              line-height: 72px;
              font-size: 24px;
            }
            .weui-icon-search{
              font-size: 26px;
              line-height: 68px;
            }
            .weui-search-bar__input{
              font-size: 26px;
            }
          }
          .weui-search-bar__label{
            line-height: 42px;
            .weui-icon-search{
              font-size: 24px;
            }
            span{
              font-size: 24px;
            }
          }
        }
        .weui-search-bar__cancel-btn{
          line-height: 65px;
          font-size: 24px;
          color: #fac917;
          text-decoration: none;
        }
      }
    }
    .vux-search_show{
      display: none;
      /*font-size: 24px;*/
    }
  }
</style>

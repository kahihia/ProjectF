<template>
  <div class="goods-list padding32">
    <div :class="tabbar_show?'cate':''" id="scrennBar">
      <!--<scroller lock-y :scrollbar-x=false :bounce=false ref="scroller">-->
        <div class="header" ref="headerBox">
          <div class="header-item c-a" v-for="(item,index) in cateData" @click="goodsItem(index,item.id)">
            <div :class="index==indexGroup?'item-img active-img':'item-img'">
              <img class="mixin-center" :src="imgUrl(item.img)"/>
            </div>
            <span>{{item.name}}</span>
          </div>
        </div>
      <!--</scroller>-->
    </div>
    <!--商品-->
    <div class="good-item clearfix" v-for="(item,index) in list" @click="getGoodsInfo(item.id,item.distance)">
      <div class="good-img _left">
        <img class="mixin-img" :src="imgUrl(item.merchants_goods_img[0])">
      </div>
      <div class="good-txt _left">
        <div class="name ellipsis t-b">
          {{item.merchants_goods_name}}
          <em class="c-b" v-if="item.distance">{{item.distance}}</em>
        </div>
        <div class="evaluate ellipsis">
          <img v-for="i in item.merchants_goods_comments_star_level" src="../assets/images/icon/icon_star.png"/>
          <i class="c-b">{{item.merchants_goods_comments_number}}评价</i>
          <em>hot</em>
        </div>
        <div class="shop-name c-a ellipsis">
          {{item.merchants_name}}
        </div>
        <div class="time ellipsis c-a">
          {{item.merchants_goods_available_time}}
          <span v-if="item.signEndTime==1">最后一天</span>
        </div>
        <div class="c-c price">
          <div class="left-txt">
            <span class="t-b">
              ￥<em>{{item.merchants_goods_discount_price}}</em>
            </span>
            <em class="p-original ">原价 ￥{{item.merchants_goods_price}}</em>
          </div>
          <div class="right-sold c-b">已售{{item.merchants_goods_sold}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import Scroller from "vux/src/components/scroller/index";

  export default {
    name: "goodslist",
    props: {
      list: {
        type: Array,
        default: 'list',//这样可以指定默认的值
        banner_show:'banner_show',
      }
    },
    components: {Scroller},
    data() {
      return {
        cateData: [],//分类列表
        indexGroup: 0,
        scroller: '',
        tabbar_show:false,
      }
    },
    created() {
      let that = this;
      that.getCategoryFn();
    },
    mounted(){
      let that = this;
      window.addEventListener('scroll', that.handleScroll,true)
    },
    destroyed(){
      window.removeEventListener("scroll",this.handleScroll)
    },
    methods: {
      goodsItem($index, cate_id) {//选择分类
        let that = this;
        that.indexGroup = $index;
        that.$emit('screen', cate_id)
      },
       // 获取scrollTop的值，兼容所有浏览器
      handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let offsetTop = document.querySelector('#scrennBar').offsetTop;
        if(scrollTop > offsetTop){
          this.tabbar_show = true
        } else {
          this.tabbar_show = false
        }
      },
      getCategoryFn() {
        let that = this;
        let params = {pid: String(0),request_type:String(1),timeStamp: formatDateTime(new Date())};
        request.getCategory(params).then(res => {
          that.cateData = res.data.data;
          // that.changeWidth()
        });
      },
      //动态改变相册宽度
      changeWidth() {
        let that = this;
        let boxwidth = that.cateData.length;
        this.$refs.headerBox.style.width = boxwidth * (110 + 74) - 74 + "px";
        that.$nextTick(() => {
          that.$refs.scroller.reset();
        })
      },
      //跳转商品详情
      getGoodsInfo(good_id,distance){
        this.$router.push({path:'/goodsdetail',query:{good_id:good_id,distance:distance}})
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/less/reset";

  .goods-list {
    padding-bottom: 90px;
    .cate{
      position: fixed;
      top: 90px;
      left: 0;
      z-index:999;
      background: @W2;
      width: 100%;
    }
    .header {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 30px 0;
      overflow: hidden;
      .header-item {
        position: relative;
        display: inline-block;
        .item-img {
          display: block;
          width: 110px;
          height: 110px;
          background: @G1;
          .mixin-borderRadius(50%);
          position: relative;
        }
        .active-img {
          background: #fff3ae;
        }
        span {
          display: inline-block;
          text-align: center;
          width: 100%;
          padding-top: 14px;
        }
      }
    }
    /*商品*/
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
</style>

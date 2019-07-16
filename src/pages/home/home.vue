<template>
  <div id="home">
    <head_bar :tab_a="tab_a" :has_notice="has_notice" :tab_b="tab_b" @search="toSearch" @showEva="showEva"></head_bar>
    <div class="content">
      <div class="banner">
        <scroller @touchmove.prevent lock-y scrollbar-x :bounce=false height="332px">
          <div class="banner-img" ref="bannerImg">
            <div class="img-item" v-for="item in banner_data" @click="bannerGoodsDetail(item)">
              <img class=" mixin-img" :src="imgUrl(item.img)" />
            </div>
          </div>
        </scroller>
      </div>
      <!--大标题-->
      <div class="big_title">
        <span class="t-a padding32 show">今天</span>
        <span class="t-a padding32">玩什么?</span>
      </div>
      <!--时间-->
      <div class="time padding32 c-b">
        <img class="mixin-centerTop" src="./images/time.png"/>
        <em>{{toDay}}</em>
      </div>
      <div class="goods-list padding32">
        <div :class="tabbar_show?'cate':''" id="scrennBar">
          <!--<scroller lock-y :scrollbar-x=false :bounce=false ref="scroller">-->
          <div class="header" ref="headerBox">
            <div class="header-item c-a" v-for="(item,index) in cateData" @click="goodsItem(index,item.id)">
              <div :class="index==indexGroup?'item-img active-img':'item-img'">
                <img class="mixin-center images" :src="imgUrl(item.img)"/>
              </div>
              <span>{{item.name}}</span>
            </div>
          </div>
          <!--</scroller>-->
        </div>
        <!--商品-->
        <div class="good-item clearfix" v-for="(item,index) in goods_list" @click="getGoodsInfo(item.id,item.distance)">
          <div class="name t-b">
            <div class="identification">
              <img v-show="item.is_official==1" class="ident-img" src="@/assets/images/common/findif.png">
              <img v-show="item.merchants_goods_type==2&&item.is_official==0" class="ident-img" src="@/assets/images/common/spell.png">
              <p class="ellipsis good-name">{{item.merchants_goods_name}}</p>
            </div>
            <em class="c-b" v-if="item.distance">{{item.distance}}</em>
          </div>
          <div class="goods_info">
            <div class="good-img _left">
              <img class="mixin-img" :src="imgUrl(item.merchants_goods_img[0])">
            </div>
            <div class="good-txt _left">
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
        <div class="null_data" v-show="goods_list.length==0">
          <div class="c-b mixin-center">{{goods_data.message}}</div>
        </div>
      </div>
    </div>
    <!--优惠券-->
    <div v-transfer-dom>
      <x-dialog v-model="showVoucher" class="dialog-demo voucher" hide-on-blur :scroll="false"
                :dialog-style="{'width':'680px','max-width':'680px','height':'800px','border-radius': '12px',}">
        <p class="title t-b">优惠券
          <span @click="showVoucher=false" class="mixin-right"><img src="../../assets/images/icon/close.png"></span>
        </p>
        <div class="voucher-list">
          <div class="null_wrap c-b" v-if="coupon_list.length===0">{{coupon_data.message}}</div>
          <div class="voucher-item" :style="'background:url('+item.catCoupon_img+') no-repeat 50% 50% ;color:'+item.coupon_color+';'" @touchmov.prevent v-for="(item,index) in coupon_list" @click="useCoupon(item.merchants_id)" v-else>
            <div class="item-left">
              <div class="left_wrap">
                <p class="coupon_name">{{item.coupons_name}}</p>
                <ul class="condition">
                  <li>满{{item.merchants_coupons_use_standard}}使用</li>
                  <li>{{item.merchants_name}}</li>
                </ul>
                <p class="overtime">使用期限：{{item.merchants_coupons_overtime}}</p>
              </div>
              <div class="right_wrap">
                <em v-if="item.merchants_coupons_type==1"> <i class="numFs">{{item.merchants_coupons_discount}}</i> 元</em>
                <em v-if="item.merchants_coupons_type==2"><i class="numFs">{{Number(item.merchants_coupons_discount)}}</i>折</em>
              </div>
            </div>
            <div class="item-right">立即使用</div>
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="audit" v-transfer-dom>
      <alert v-model="alert_show">{{alert_text}}</alert>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {getLocalPosition,getLocalData} from '@/utils/storages';
  import {formatDate, formatDateTime, formatDate2} from '@/utils/format';
  import {getGreatCircleDistance,stop,move} from '@/utils/utils'
  import request from '@/utils/request';
  import {Scroller, LoadMore, XDialog,Sticky,Alert,TransferDomDirective as TransferDom} from 'vux'
    export default {
      name: "home",
      directives: {TransferDom},
      components: {Scroller, head_bar, LoadMore, XDialog,Sticky,Alert},
      data(){
        return{
          tab_a: true,
          tab_b: false,
          banner_data:[],
          toDay: formatDate2(new Date()),
          goods_list:[],//商品列表
          coupon_data:[],//优惠券数据
          coupon_list:[],//优惠券列表
          goods_data:[],//商品信息
          cateData:[],//类别列表
          startItem: 0,//页码从第一页开始
          endItem: 100,//煤业显示的条数
          num: 100,
          user_info:getLocalData('user_info'),
          tabbar_show:false,
          has_notice:false,
          showVoucher: false,//遮罩层
          alert_show: false,//显示隐藏弹窗
          alert_text: '',//弹窗文本
          indexGroup: 0,
          bgColor:[
            {id:'',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
            {id:'0',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
            {id:'1137',img:require('@/assets/images/common/eatDrink.png'),color:'#f0614c'},
            {id:'1138',img:require('@/assets/images/common/palyer.png'),color:'#a45af5'},
            {id:'1139',img:require('@/assets/images/common/sport.png'),color:'#16d37d'},
            {id:'1140',img:require('@/assets/images/common/travel.png'),color:'#3884eb'}
         ]
        }
      },
      watch:{
        showVoucher:function (val) {
          if(val){
            stop()
          }else {
            move()
          }
        }
      },
      created(){
        let that = this;
        that.getBanner();
        that.getCategoryFn();
        that.getUserCoupons();
        that.getGoodsList(1136);
        this.$store.commit('selectedTab',{tab_index:0});
        this.$store.commit('userOrMerchant',{is_merchant:false});//显示用户端tabbar
        console.log(that.$store.state.remix.source)
        console.log(getLocalData('source'))
      },
      mounted(){
        let that = this;
        window.addEventListener('scroll', that.handleScroll,true)
      },
      destroyed(){
        window.removeEventListener("scroll",this.handleScroll,true)
      },
      methods:{
        useCoupon(id){
          if(id==0){
            this.showVoucher=false;
            this.alert_show=true;
            this.alert_text='该券为全场通用券，在任何一家店铺都能使用';
          }else {
            this.$router.push({
              path:'/shopdetail',
              query:{merchant_id:id}
            })
          }
        },
        //获取用户拥有的优惠券
        getUserCoupons(){
          let that = this;
          let params = {
            user_id:String(that.user_info.id),
            timeStamp:formatDateTime(new Date())
          };
          request.getUserCoupons(params).then(res=>{
            that.coupon_list=res.data.data;
            that.coupon_data=res.data;
            that.coupon_list.length>0?that.has_notice=true:that.has_notice=false;
            if(that.coupon_list.length>0){
              that.coupon_list.forEach((val,key)=>{
                that.bgColor.forEach((item,index)=>{
                  if(val.merchants_coupons_usable_goods_category_id===item.id){
                    val.catCoupon_img=item.img;
                    val.coupon_color=item.color;
                  }
                })
              });
            }
          })
        },
        showEva(){
          this.showVoucher=true;
        },
        bannerGoodsDetail(item){
          if(item.is_link==1){
            if(item.inside_or_outside==1){
              // this.$router.push({
              //   path:'/goodsdetail',
              //   query:{good_id:item.url}
              // })
              window.location.href=item.url
            }else if(item.inside_or_outside==2){
              window.location.href=item.url
            }
          }
        },
        toSearch(){
          this.$router.push({
            path:'/search',
            query:{
              last_path:this.$route.path,
              placeholder:'请输入商品名称、商铺名称'
            }
          })
        },
        goodsItem($index, cate_id) {//选择分类
          let that = this;
          that.indexGroup = $index;
          that.getGoodsList(cate_id)
        },
        getBanner(){
          let params={timeStamp:formatDateTime(new Date())};
          request.getBanner(params).then(res=>{
            this.banner_data = res.data.data;
            this.$refs.bannerImg.style.width = 420 * this.banner_data.length + 'px';
          })
        },
        changeWidth(item_width,interval,) {
          let that = this;
          let boxwidth = that.cateData.length;
          this.$refs.headerBox.style.width = boxwidth * (item_width + interval) - interval + "px";
          that.$nextTick(() => {
            that.$refs.scroller.reset();
          })
        },
        getCategoryFn() {
          let that = this;
          let params = {pid: String(0),request_type:String(1),timeStamp: formatDateTime(new Date())};
          request.getCategory(params).then(res => {
            that.cateData = res.data.data;
            // that.changeWidth()
          });
        },
        getGoodsList(merchants_goods_category){
          let that = this;
          let params = {
            limit_end: String(that.endItem),
            limit_start: String(that.startItem),
            timeStamp: formatDateTime(new Date()),
            merchants_goods_category: String(merchants_goods_category),
            is_merchants_get:String(0)
          };
          request.getGoodslist(params).then(res => {
            let resData = res.data;
            let goods_list=res.data.data;
            if(res.data.code==200){
              goods_list.map((item,index)=>{
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
            that.goods_list=goods_list;
          })
        },
        //跳转商品详情
        getGoodsInfo(good_id,distance){
          this.$router.push({path:'/goodsdetail',query:{good_id:good_id,distance:distance}})
        },
        handleScroll () {
          let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          let offsetTop = document.querySelector('#scrennBar').offsetTop;
          if(scrollTop > offsetTop){
            this.tabbar_show = true
          } else {
            this.tabbar_show = false
          }
        },
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #home{
    background: @bg-b;
    width: 100%;
    min-height: 100%;
    font-size: 28px;
    .content{
      padding-top: 90px;
      .banner {
        height: 332px;
        padding-left: 32px;
        margin-top: 20px;
        margin-bottom: 20px;
        overflow: hidden;
        .banner-img {
          height: 332px;
          .img-item {
            height: 332px;
            width: 410px;
            background: #eee;
            display: inline-block;
            margin-left: 10px;
            background: @Y2;
            .mixin-borderRadius(12px);
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
      /*banner结束*/
      .time {
        position: relative;
        margin-top: 12px;
        em {
          padding-left: 40px;
        }
      }
      /*商品列表*/
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
              .images{
                width: 50px;
              }
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
          .name {
            padding-bottom: 12px;
            .identification{
              display: flex;
              align-items: center;
              .ident-img{
                min-width: 70px;
                min-height: 30px;
                width:  70px;
                height: 30px;
              }
              .good-name{
                max-width: 100%;
                margin-left: 10px;
              }
            }
            em {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
          .goods_info{
            .good-img {
              display: block;
              width: 170px;
              height: 170px;
              margin-right: 20px;
            }
            .good-txt {
              width: calc(100% - 190px);
              position: relative;
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
      }
    }
  }
  .voucher {
    p.title {
      font-size: 30px;
      margin: 32px 34px;
      position: relative;
    }
    .voucher-list {
      margin: 8px 34px;
      height: 700px;
      overflow: scroll;
      .voucher-item {
        width: 600px;
        height: 170px;
        display: flex;
        justify-content: space-between;
        padding: 25px 34px;
        margin-bottom: 20px;
        &:last-child{
          margin-bottom: 0;
        }
        .item-left {
          flex: 0 0 75%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left_wrap{
            text-align: left;
            .coupon_name{
              font-size: 28px;
              margin-bottom: 10px;
            }
            .condition{
              font-size: 18px;
              li{
                list-style: disc;
                margin: 5px;
              }
            }
            .overtime{
              font-size: 18px;
            }
          }
          .right_wrap{
            font-size: 30px;
            .numFs{
              font-size: 56px;
            }
          }
        }
        .item-right{
          font-size: 24px;
          line-height: 110px;
        }
      }
    }
  }
</style>
<style lang="less">
  @switch-checked-bg-color:#ffe035;
  .audit{
    .weui-dialog{
      border-radius: 12px;
      max-width: 340px;
      overflow: hidden;
      .weui-dialog__bd{
        font-size: 24px;
      }
      .weui-dialog__ft{
        font-size: 26px;
        .weui-dialog__btn_primary{
          color: @switch-checked-bg-color;
        }
      }
    }
  }
</style>

<template>
  <div class="warp" id="warp">
    <!--头部-->
    <header>
      <head_bar :tab_a="tab_a" :tab_b="tab_b"></head_bar>
    </header>
    <scroller class="scroller-a" @on-scroll="handleScroll" style="overflow-y: auto;" height="-48" lock-x ref="scroller"
              use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="selPullUp"
              use-pulldown :pulldown-config="pullDownConfig" @on-pulldown-loading="refresh">
      <div>
        <!--banner-->
        <!--<sticky-->
          <!--scroll-box="warp"-->
          <!--ref="sticky"-->
          <!--:offset="300"-->
          <!--:check-sticky-support="false"-->
          <!--:disabled="disabled">-->
        <div class="banner">
          <scroller @touchmove.prevent lock-y scrollbar-x :bounce=false height="332px">
            <div class="banner-img" ref="bannerImg">
              <div class="img-item" v-for="item in banner_data">
                <img class="mixin-img" :src="imgUrl(item.img)" />
              </div>
            </div>
          </scroller>
        </div>
        <!--</sticky>-->
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
        <goodsList :list="list" @screen="screening"></goodsList>
      </div>
      <load-more class="line" :show-loading="false" :tip="tip" background-color="#fbf9fe"></load-more>
    </scroller>
    <!--遮罩层-->
    <div v-transfer-dom>
      <x-dialog v-model="showVoucher" class="dialog-demo voucher" hide-on-blur
                :dialog-style="{'width':'550px','max-width':'550px','height':'800px','border-radius': '12px',}">
        <p class="title t-b">代金券
          <span @click="showVoucher=false" class="mixin-right"><img src="../../assets/images/icon/close.png"></span>
        </p>
        <div class="voucher-list">
          <div class="voucher-item">
            <div class="item-left">
                     <span class="price c-a ellipsis">
                       <em>￥ <i>10</i></em> 代金券
                     </span>
              <span class="content c-a ellipsis">所有时间都可以用</span>
              <span class="time c-c ellipsis">3天内有效</span>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {Scroller, LoadMore, XDialog,Sticky,TransferDomDirective as TransferDom} from 'vux'
  import goodsList from '@/components/goods_list'
  import head_bar from '@/components/head_bar'
  import {getLocalPosition} from '@/utils/storages';
  import {formatDate, formatDateTime, formatDate2} from '@/utils/format';
  import {getGreatCircleDistance} from '@/utils/utils'
  import request from '@/utils/request';

  export default {
    directives: {
      TransferDom
    },
    name: "home",
    components: {Scroller, goodsList, head_bar, LoadMore, XDialog,Sticky},
    data() {
      return {
        tab_a: true,
        tab_b: false,
        startItem: 0,//页码从第一页开始
        endItem: 10,//煤业显示的条数
        num: 10,
        list: [],
        merchants_goods_category: '',
        pullUpConfig: {
          content: '',//
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '加载更多',//请上拉刷新数据up
          upContent: '',//请上拉刷新数据up
          loadingContent: '加载中...',//加载中...
          clsPrefix: 'xs-plugin-pullup-'
        },
        pullDownConfig: {
          content: '下拉刷新',
          height: 40,
          autoRefresh: false,
          upContent: '释放后刷新',
          downContent: '',
          loadingContent: '正在刷新...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        // noData:true,
        tip: '正在加载',
        toDay: '',
        showVoucher: true,//遮罩层
        disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
        banner_data:[],
      }
    },
    created(){
      this.$store.commit('selectedTab',{tab_index:0});
      this.$store.commit('userOrMerchant',{is_merchant:false});//显示用户端tabbar
    },
    mounted() {
      let that = this;
      that.getBanner();
      that.toDay = formatDate2(new Date());
      that.$refs.bannerImg.style.width = 420 * 3 + 'px';
      that.getGoodslist(true, null, that.merchants_goods_category);
    },
    methods: {
      getBanner(){
        let params={timeStamp:formatDateTime(new Date())};
        request.getBanner(params).then(res=>{
          this.banner_data = res.data.data;
        })
      },
      handleScroll(pos) {
        let scrollTop = pos.top;
        if (scrollTop >= 90) {
          this.tab_a = false;
          this.tab_b = true;
        } else {
          this.tab_a = true;
          this.tab_b = false;
        }
      },
      getGoodslist(isEmpty, refresh, merchants_goods_category) {
        let that = this;
        let params = {
          limit_end: String(that.endItem),
          limit_start: String(that.startItem),
          timeStamp: formatDateTime(new Date()),
          merchants_goods_category: String(merchants_goods_category)
        };
        request.getGoodslist(params).then(({data}) => {
          data.data.forEach(function (item, i) {
            // merchants_goods_end_time 最后一天的时间
            let currentTime = new Date((item.merchants_goods_end_time).replace(/-/g, "/")).getTime() - new Date().getTime();
            if (currentTime >= 0) {
              let d = Math.floor(currentTime / 1000 / 60 / 60 / 24);
              if (d <= 1) {
                item.signEndTime = 1;
              }
            }
            // 距离
            getLocalPosition('position')?item.distance = getGreatCircleDistance(getLocalPosition('position').lat,getLocalPosition('position').lng,
              item.merchants_latitude, item.merchants_longitude):item.distance='';
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
          let result = data.data;
          that.tip = '正在加载';
          if (isEmpty) {
            that.list = [];
            if (refresh == 1) {
              this.$refs.scroller.enablePullup();
              this.$refs.scroller.donePulldown();
            }
            // 本来就没有数据
            if (result.length <= 0) {
              that.tip = '没有数据'
            }
          } else {
            //isEmpty为false时，也就是向上滚动刷新selPullUp ()方法被被调用的时候
            if (result && result.length == 0) {
              this.$refs.scroller.disablePullup();
              that.tip = '我是有底线的喔！';
              return
            }
          }
          result.forEach(function (item, index) {
            that.list.push(item)
          });
          // that.isShow = true;
          if (!isEmpty) {
            this.$refs.scroller.donePullup();
            // that.$nextTick(() => {
            //   that.$refs.scroller.reset({top: 0})
            // });
            that.tip = '正在加载'
          }

        })
      },
      selPullUp() {
        // 上拉加载更多
        this.startItem = this.num;
        this.num = parseInt(this.num) + 10;
        this.getGoodslist(false, null, this.merchants_goods_category)
      },
      // 下拉刷新
      refresh() {
        this.startItem = 0;
        this.num = 10;
        this.getGoodslist(true, 1, this.merchants_goods_category)
      },
      screening(params) {//筛选
        this.merchants_goods_category = params;
        this.startItem = 0;
        this.num = 10;
        this.getGoodslist(true, null, params);
      }
    }

  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .warp {
    width: 100%;
    height: 100%;
    font-size: 28px;
    background: @bg-b;
    position: relative;
    overflow-y: hidden;
    header {
      height: 90px;
      width: 100%;
    }
    .scroller-a {
      height: calc(100% - 180px) !important;
      width: 100%;
      /*banner*/
      .banner {
        height: 332px;
        padding-left: 32px;
        padding-top: 20px;
        margin-bottom: 20px;
        overflow: hidden;
        .banner-img {
          height: 332px;
          /*width: 1490px;*/
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
      .voucher-item {
        width: 488px;
        height: 146px;
        margin: 0 auto;
        background: url("./images/voucher.png") no-repeat center;
        position: relative;
        .item-left {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 332px;
          border: 1px solid @voucher-b;
          border-right: 2px dashed @voucher-b;
          background: @bg-c;
          .mixin-borderRadius(6px);
          .price {
            display: block;
            text-align: left;
            padding-top: 10px;
            padding-left: 12px;
            em {
              font-size: 42px;
              i {
                background: linear-gradient(to bottom, #fff 0%, #fff 28%, #ffe035 30%, #ffe035 100%,);
                /*background-color: linear-gradient(to right,#fff 0%, #fff 28%, #ffe035 30%, #ffe035 100%);*/
              }
            }
          }
          .content {
            display: block;
            text-align: left;
            padding: 6px 0;
            padding-left: 12px;
            font-size: 20px;
          }
          .time {
            display: block;
            text-align: left;
            padding-left: 12px;
            color: @hot;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .xs-plugin-pullup-default{
    display: none;
  }
</style>

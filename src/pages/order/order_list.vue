<template>
    <div id="order_list">
      <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
      <div class="allOrder">
        <div class="order_bar">
          <tab custom-bar-width="60px" :line-width="8" bar-active-color="#ffe035" active-color="#363636" default-color="#959595">
            <tab-item selected @click.native="getOrderList()">全部</tab-item>
            <tab-item @click.native="getOrderList(0)">待付款</tab-item>
            <tab-item @click.native="getOrderList(1)">待使用</tab-item>
            <tab-item @click.native="getOrderList(3)">待评价</tab-item>
          </tab>
        </div>
        <ul class="order_block">
          <li class="order_item card" v-for="(item,index) in order_list">
            <div class="up_wrap">
              <span class="c-j">订单编号：{{item.goods_order_no}}</span>
              <em class="c-q" v-if="item.goods_order_status==0">待付款</em>
              <em class="c-q" v-else-if="item.goods_order_status==1">待使用</em>
              <em class="c-b" v-else-if="item.goods_order_status==2">已取消</em>
              <em class="c-q" v-else-if="item.goods_order_status==3">待评价</em>
              <em class="c-b" v-else-if="item.goods_order_status==4">已失效</em>
              <em class="c-b" v-else-if="item.goods_order_status==5">已评价</em>
            </div>
            <div class="mid_wrap" @click="toDetail(item.id)">
              <div class="goods_img">
                <img class="mixin-img" :src="imgUrl(item.goods_imgArr[0])"/>
              </div>
              <div class="goods_info">
                <div class="up_line">
                  <span class="goods_name c-Bd">{{item.merchants_goods_name}}</span>
                  <span class="goods_num c-j">X{{item.goods_order_buy_number}}</span>
                </div>
                <div class="comment_line">
                  <img v-for="i in item.merchants_goods_comments_star_level"
                       src="../../assets/images/icon/icon_star.png"/>
                  <span class="com_text c-j">{{item.merchants_goods_comments_number}}评价</span>
                </div>
                <div class="time_slot c-Bc">{{item.merchants_goods_available_time}}</div>
                <div class="price_line">
                  <span class="t-b-b">￥<em>{{item.goods_order_money}}</em></span>
                  <em class="p-original c-Bc">原价<span class="delete_line">￥{{item.merchatns_goods_platform_price}}</span></em>
                </div>
                <div class="down_line">
                  <div class="coupon" v-show="item.goods_order_status==0">
                    <img src="../../assets/images/detail/icon_coupon.png"/>
                    <span class="c-Bc">优惠券</span>
                  </div>
                  <div>
                    <span class="c-j">合计</span><span class="c-Bd">￥{{item.goods_order_money}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="down_wrap">
              <div class="c-j ellipsis order_time">订单日期：{{item.goods_order_inputtime}}</div>
              <div class="btn_wrap" v-if="item.goods_order_status==0">
                <button @click="cancelOrder(item.id)">取消订单</button>
                <button @click="buyNow(item.id)">立即付款</button>
              </div>
              <div class="btn_wrap" v-else-if="item.goods_order_status==1">
                <button @click="cancelOrder(item.id)">取消订单</button>
                <button @click="showQRcode(item,item.goods_imgArr[0])">立即使用</button>
              </div>
              <div class="btn_wrap" v-else-if="item.goods_order_status==3">
                <button @click="onceAgain(item.merchants_goods_merchants_id)">再来一单</button>
                <button @click="reportEva(item.id,item.goods_imgArr[0])">立即评价</button>
              </div>
              <div class="btn_wrap" v-else>
                <button @click="deleteOrder(item.id)">删除订单</button>
                <button @click="onceAgain(item.merchants_goods_merchants_id)">再来一单</button>
              </div>
            </div>
          </li>
          <li class="null_data" v-show="order_list.length==0">
            <div class="c-b mixin-center">{{order_data.message}}</div>
          </li>
        </ul>
      </div>
      <div class="QRcode_dialog" v-transfer-dom>
        <x-dialog v-model="QRcode_show" class="dialog-demo">
          <div class="order_qr">
            <div class="clearfix">
              <img src="../../assets/images/icon/icon_close.png"
                   class="close_btn" @click="hideQR"/>
            </div>
            <p class="t_e">{{codeTitle}}</p>
            <qrcode class="qrcode" v-if="is_meituan==0" :value="JSON.stringify(barcode)"></qrcode>
            <qrcode class="qrcode" v-if="is_meituan==1" :value="barcode"></qrcode>
            <p class="c-b">请向商家展示此二维码</p>
          </div>
        </x-dialog>
      </div>
      <div class="hint" v-transfer-dom>
        <confirm v-model="hint_show"
                 title="操作提示"
                 @on-confirm="onConfirm">
          <p style="text-align:center;">确定取消吗？</p>
        </confirm>
      </div>
      <div class="hint" v-transfer-dom>
        <confirm v-model="del_show"
                 title="操作提示"
                 @on-confirm="onConfirmDel">
          <p style="text-align:center;">确定删除吗？</p>
        </confirm>
      </div>
      <div class="notice" v-transfer-dom>
        <popup v-model="show_notice" position="top" :show-mask="false">
          <div class="position-vertical-demo">{{noticeMsg}}</div>
        </popup>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {formatDateTime, formatDate2} from '@/utils/format';
  import request from '@/utils/request';
  import {Tab,TabItem,Qrcode,XDialog,Confirm,Popup,TransferDomDirective as TransferDom} from 'vux';
  import {getLocalData} from '@/utils/storages';
  import {wxPayment} from '@/utils/wxInit';
  let timeInterval;
  export default {
      name: "order_list",
      components:{head_bar,Tab,TabItem,Qrcode,XDialog,Confirm,Popup},
      directives: {TransferDom},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'订单列表',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),
          tab_data:[
            {tab_name:'全部',}
          ],
          order_list:[],
          order_data:'',
          order_id:'',
          timeStamp:formatDateTime(new Date()),//时间戳
          QRcode_show:false,//二维码弹窗
          barcode:{},//二维码数据
          codeTitle:'',
          hint_show:false,//取消订单弹窗
          del_show:false,//删除订单弹窗
          show_notice:false,
          noticeMsg:'',
          is_meituan:'',
        }
      },
      watch:{
        show_notice(val){
          if(val){
            setTimeout(() => {
              this.show_notice = false
            },2000)
          }
        },
      },
      methods:{
        toDetail(id){
          this.$router.push({path:'/orderDetail',query:{order_id:id}})
        },
        reportEva(order_id,goods_img){
          this.$router.push({path:'/evaluate',query:{order_id:order_id,goods_img:goods_img}})
        },
        // 获取用户订单列表
        getOrderList(status){
          let that = this;
          status==0?status=String(status):false;
          let params = this.deleteStr({user_id:String(this.user_info.id),goods_order_status:status,timeStamp:that.timeStamp});
          request.getGoodsOrderList(params).then(res=>{
            that.$store.commit('updateLoadingStatus', {isLoading: false});
            that.order_list = res.data.data;
            that.order_data = res.data;
            this.order_list.map((val,key)=>{
              val.goods_imgArr = val.merchants_goods_img.split(',');
              if(val.merchants_goods_type==2){
                let avalid_time = JSON.parse(val.merchants_goods_available_time);
                let valid_arr=[];
                let time_arr=[];
                for (let key in avalid_time){
                  valid_arr.push(that.weekFn(key));
                  time_arr=avalid_time[key];
                }
                let week_str = valid_arr.join(',');
                let time_str = time_arr.join(',');
                val.merchants_goods_available_time=week_str+' '+time_str;
              }
            });
          })
        },
        //显示二维码
        showQRcode(item,good_img){
          let that = this;
          this.codeTitle=item.merchants_goods_name;
          this.is_meituan=item.merchants_goods_is_meituan;
          if(item.merchants_goods_is_meituan==0){
            this.barcode={
              user_id:item.goods_order_user_id,
              goods_id:item.goods_order_goods_id,
              barcode:item.goods_order_code,
            };
            this.QRcode_show=true;
            this.watchBarcode(good_img)
          }else if(item.merchants_goods_is_meituan==1){
            console.log(item.goods_order_meituan_code);
            this.barcode=item.goods_order_meituan_code;
            this.QRcode_show=true;
          }
        },
        hideQR(){
          this.QRcode_show=false;
          clearInterval(timeInterval)
        },
        watchBarcode(good_img){
          timeInterval=setInterval(()=>{
            let params = {
              user_id:this.barcode.user_id,
              goods_id:this.barcode.goods_id,
              barcode:this.barcode.barcode,
              timeStamp:this.timeStamp
            };
            request.monitorMerchantsGoodsBarcode(params).then(res=>{
              if(res.data.code==200){
                clearInterval(timeInterval);
                this.$router.push({
                  path:'/writeOffSuc',
                  query:{good_id:this.barcode.goods_id,good_img:good_img}
                })
              }
            })
          },3000)
        },
        payCancel(){
          let that = this;
          that.$store.commit('updateLoadingStatus', {isLoading: false});
        },
        buyNow(id){
          let that = this;
          that.$store.commit('updateLoadingStatus', {isLoading: true});
          wxPayment(id,that.payCancel,that.getOrderList)
        },
        onceAgain(merchants_id){
          this.$router.push({path:'/shopdetail',query:{merchant_id:merchants_id}})
        },
        // 取消订单
        cancelOrder(order_id){
          this.order_id=order_id;
          this.hint_show=true;
        },
        deleteOrder(order_id){
          this.order_id=order_id;
          this.del_show=true;
        },
        cancelOrderFn(order_id){
          let params={
            id:order_id,
            user_id:this.user_info.id,
            timeStamp:this.timeStamp
          };
          request.cancelGoodsOrder(params).then(res=>{
            this.show_notice=true;
            this.noticeMsg=res.data.message;
            if(res.data.code==200){
              this.getOrderList();
            }
          })
        },
        deleteOrderFn(order_id){
          let params={
            id:order_id,
            user_id:this.user_info.id,
            timeStamp:this.timeStamp,
          };
          request.deleteGoodsOrder(params).then(res=>{
            this.show_notice=true;
            this.noticeMsg=res.data.message;
            if(res.data.code==200){
              this.getOrderList();
            }
          })
        },
        //确认取消？
        onConfirm(){
          this.cancelOrderFn(this.order_id)
        },
        //确认删除？
        onConfirmDel(){
          this.deleteOrderFn(this.order_id)
        }
      },
      created(){
        clearInterval(timeInterval)
      },
      mounted(){
        this.getOrderList();
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        clearInterval(timeInterval);
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
    .mixin-borderRadius(8px)
  }
  #order_list{
    min-height: 100%;
    background-color: @bg-b;
    .allOrder{
      padding: 110px 32px 90px;
      .order_block{
        position: relative;
        .order_item{
          padding: 40px 20px;
          margin-bottom: 15px;
          &:last-child{
            margin-bottom: 0;
          }
          .up_wrap{
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid @border_c;
          }
          .mid_wrap{
            padding: 12px 0 20px;
            display: flex;
            border-bottom: 1px solid @border_c;
            .goods_img{
              width: 170px;
              height: 170px;
              margin-right: 20px;
            }
            .goods_info{
              flex: 1;
              .up_line{
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .price_line {
                span {
                  position: relative;
                  em {background: linear-gradient(to bottom, #fff 0%, #fff 28%, @Y2 30%, @Y2 100%);
                    padding-left: 2px;
                    padding-right: 6px;}
                  .p-original {
                    padding-left: 12px;
                  }
                }
              }
              .down_line{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 4px;
                .coupon{
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 124px;
                }
              }
            }
          }
          .down_wrap{
            padding-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .order_time{
              flex: 0 0 45%;
            }
            button{
              .mixin-setButton(140px,60px,@G1,transparent,24px,none);
              .mixin-borderRadius(8px);
              border: solid 2px @border_e;
              &:nth-of-type(2){
                .mixin-setButton(140px,60px,@G1,@bg-d,24px,none);
                border: none;
                margin-left: 40px;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  #order_list{
    .order_bar{
      padding:0 70px;
      .vux-tab-wrap{
        height: 50px;
        .vux-tab-container{
          width: 100%;
          height: 50px;
          margin: 0 auto;
          .vux-tab{
            height: 50px;
            background-color: transparent;
            .vux-tab-item{
              background: transparent;
              font-size: 24px;
            }
          }
        }
      }
    }
  }
  .QRcode_dialog{
    .weui-dialog{
      max-width: 500px;
      height: 444px;
      box-sizing: border-box;
      padding: 20px 20px 40px;
      text-align: center;
      .close_btn{
        float: right;
      }
      .qrcode{
        padding: 40px 0 20px;
        img{
          width: 250px !important;
          height: 250px !important;
        }
      }
    }
  }
</style>

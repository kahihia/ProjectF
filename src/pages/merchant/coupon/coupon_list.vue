<template>
    <div id="coupon_list">
      <head_bar :backLast="back_last" :tab_c="tab_c" @addSth="addCoupon"
                :head="head" :bg_color="bg_color" :showAdd="true">
      </head_bar>
      <div class="content">
        <div class="null_wrap mixin-center" v-show="coupon_list.length===0">
          <img src="@/assets/images/common/null_notice.png">
          <p class="c-j marginT">亲，你还没有设置优惠券哦！</p>
          <p class="c-j">赶快去设置吧！</p>
        </div>
        <div class="coupon_wrap" v-show="coupon_list.length!==0">
          <div class="coupon_item" v-for="(item,index) in coupon_list" @touchstart="showDeleteButton" @touchend="clearLoop(item.id)" ref="coupon_item"
               :style="'background:url('+item.catCoupon_img+') no-repeat 50% 50% ;color:'+item.coupon_color+';'">
            <div class="coupon_info ellipsis">
              <p class="coupons_name">{{item.coupons_name}}</p>
              <ul class="rules">
                <li>满{{Number(item.use_standard)}}使用</li>
                <li>总数{{item.issue_number}}个，还剩{{item.issue_number-item.user_get_number}}个</li>
              </ul>
              <p class="valid">使用期限：{{item.starttime}}—{{item.overtime}}</p>
            </div>
            <div class="amount_wrap">
              <span class="RMB">￥</span>
              <em>{{Number(item.discount)}}</em>
            </div>
            <div class="getCoupon" @click="editCoupons(item.id)">
              编辑
            </div>
          </div>
        </div>
      </div>
      <div class="hint" v-transfer-dom>
        <confirm v-model="hint_show"
                 title="操作提示"
                 @on-confirm="onConfirm">
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
  import head_bar from '@/components/head_bar';
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  import {Confirm,Popup,TransferDomDirective as TransferDom} from 'vux'
  export default {
    name: "coupon_list",
    components:{head_bar,Confirm,Popup},
    directives: {TransferDom},
    data(){
      return{
        head:'优惠券',
        back_last:true,
        tab_c:true,
        bg_color:'#ffe035',
        timeStamp:formatDateTime(new Date()),//时间戳
        user_info:getLocalData('user_info'),
        coupon_list:[],//优惠券列表
        bg_coupon:[require('../images/bg_currency.png'),require('../images/bg_normal.png'),
          require('../images/bg_spell.png'),require('../images/bg_out.png'),],
        hint_show:false,
        show_notice:false,
        noticeMsg:'',
        coupon_id:'',
        bgColor:[
          {id:'0',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
          {id:'1137',img:require('@/assets/images/common/eatDrink.png'),color:'#f0614c'},
          {id:'1138',img:require('@/assets/images/common/palyer.png'),color:'#a45af5'},
          {id:'1139',img:require('@/assets/images/common/sport.png'),color:'#16d37d'},
          {id:'1140',img:require('@/assets/images/common/travel.png'),color:'#3884eb'}
        ]
        }
    },
    watch:{
      show_notice(val){
        if(val){
          setTimeout(() => {
            this.show_notice = false
          },2000)
        }
      }
    },
    methods:{
      onConfirm(){
        this.deleteCoupon()
      },
      deleteCoupon(){
        let params = {
          merchants_id:this.user_info.merchants_id,
          id:this.coupon_id,
          timeStamp:formatDateTime(new Date())
        };
        request.deleteMerchantsCoupons(params).then(res=>{
          this.show_notice=true;
          this.noticeMsg=res.data.message;
          this.getCoupons()
        })
      },
      showDeleteButton(){
        clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
        this.Loop=setTimeout(()=>{
          this.hint_show = true;
        },1000);
      },
      clearLoop(id) {
        clearInterval(this.Loop);
        this.coupon_id=id;
      },
      // 获取优惠券
      getCoupons(){
        let params={merchants_id:this.user_info.merchants_id,timeStamp:formatDateTime(new Date())};
        request.getMerchantsCoupons(params).then(res=>{
          if(res.data.code===200){
            this.coupon_list=res.data.data;
            if(this.coupon_list.length>0){
              this.coupon_list.forEach((val,key)=>{
                this.changeClass(key,val.usable_goods_type,val.is_over);
                this.bgColor.forEach((item,index)=>{
                  if(val.usable_goods_category_id===item.id){
                    val.catCoupon_img=item.img;
                    val.coupon_color=item.color;
                  }
                })
              });
            }
          }
        })
      },
      editCoupons(id){
        this.$router.push({path:'/addCoupon',query:{coupon_id:id}})
      },
      changeClass(index,status,is_over){
        this.$nextTick(()=>{
          if(is_over==0){
            if(status==0){
              this.$refs.coupon_item[index].className='coupon_item bg_currency'
            }else if(status==1){
              this.$refs.coupon_item[index].className='coupon_item bg_normal'
            }else if(status==2){
              this.$refs.coupon_item[index].className='coupon_item bg_spell'
            }
          }else {
            this.$refs.coupon_item[index].className='coupon_item bg_out'
          }
        })
      },
      addCoupon(){
        this.$router.push({path:'/addCoupon'})
      }
    },
    created(){
      this.getCoupons();
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
.marginT{margin-top: 40px;}
.bg_out{
  background: url("../images/bg_out.png") 50% 50% no-repeat;
  color: #b3b3b3;
}
ul,li{
  list-style: inside;
}
#coupon_list{
  padding-top: 90px;
  min-height: 100%;
  position: relative;
  .content{
    min-height: 100%;
    .null_wrap{
      text-align: center;
    }
    .coupon_wrap{
      margin-top: 40px;
      padding: 0 75px;
      .coupon_item{
        width: 600px;
        height: 170px;
        padding: 28px 40px;
        box-sizing: border-box;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:first-child{
          margin-top: 0;
        }
        .coupon_info{
          .coupons_name{
            font-size: 28px;
          }
          .rules{
            font-size: 18px;
            margin-top: 18px;
          }
          .valid{
            font-size: 16px;
          }
        }
        .amount_wrap{
          .RMB{font-size: 30px;}
          em{font-size: 56px;}
        }
        .getCoupon{
          font-size: 24px;
        }
      }
    }
  }
}
</style>

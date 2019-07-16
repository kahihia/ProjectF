<template>
    <div id="add_coupon">
      <head_bar :backLast="back_last" :tab_c="true"
                :head="head" :bg_color="bg_color">
      </head_bar>
      <div class="content">
        <div class="add_wrap card">
          <!--<div class="add_item">-->
            <!--<span class="title c-a">优惠券</span>-->
            <!--<div :class="index===select_show?'coupon_type c-s':'coupon_type c-j'"-->
                 <!--v-for="(item,index) in select_type" @click="chooseType(index)">-->
              <!--<img :src="item.img_src"/>-->
              <!--<span>{{item.type_name}}</span>-->
            <!--</div>-->
          <!--</div>-->
          <div class="add_item">
            <span class="title wordFive c-a">优惠券名称</span>
            <div class="money c-Bc">
              <label for="couponName"></label>
              <input id="couponName" type="text" class="c-Bc amount"
                     v-model="coupon_data.coupons_name">
            </div>
          </div>
          <div class="add_item">
            <span class="title wordFour c-a">优惠模式</span>
            <div :class="index===type_show?'coupon_model c-s':'coupon_model c-j'"
                 v-for="(item,index) in coupon_type" @click="chooseModel(index)">
              <img :src="item.img_src"/>
              <span>{{item.type_name}}</span>
            </div>
          </div>
          <div class="add_item">
            <span class="title wordFour c-a">优惠金额</span>
            <div class="money c-Bc">
              <label for="amount" v-show="type_show===0">￥</label>
              <input id="amount" type="text" class="c-Bc amount"
                     v-model="coupon_data.discount">
              <span class="c-b" v-show="type_show===1">折</span>
            </div>
          </div>
          <div class="add_item">
            <span class="title wordFive c-a">优惠券个数</span>
            <div class="num c-Bc">
              <label for="number"></label>
              <input id="number" type="text" class="c-Bc amount"
                     placeholder="如:10" v-model="coupon_data.issue_number">
            </div>
          </div>
          <div class="add_item">
            <span class="title wordFour c-a">使用条件</span>
            <div class="condition c-j">
              <label for="cond">满</label>
              <input id="cond" type="text" class="c-Bc amount"
                     placeholder="如:10" v-model="coupon_data.use_standard">
              <span>使用</span>
            </div>
          </div>
          <div class="add_item">
            <span class="title wordFour c-a">使用期限</span>
            <div class="valid_date">
              <datetime class="item_time c-b" v-model="valid_data.start_date"></datetime>
              <datetime class="item_time c-b" v-model="valid_data.end_date"></datetime>
            </div>
          </div>
        </div>
        <button class="btn notAll_btn" v-show="!is_confirm">确定</button>
        <button class="btn confirm_btn" @click="confirmCoupon" v-show="is_confirm">确定</button>
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
  import {Datetime,Popup,TransferDomDirective as TransferDom} from 'vux';
    export default {
      name: "add_coupon",
      components:{head_bar,Datetime,Popup},
      directives: {TransferDom},
      data(){
        return{
          head:'定义优惠券',
          back_last:true,
          bg_color:'#ffe035',
          user_info: getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          coupon_id:this.$route.query.coupon_id,//优惠券id
          select_imgArr:[require('../images/selected.png'),require('../images/not_select.png')],
          select_type:[
            {img_src:require('../images/selected.png'),type_name:'通用'},
            {img_src:require('../images/not_select.png'),type_name:'普通'},
            {img_src:require('../images/not_select.png'),type_name:'拼团'},
          ],
          coupon_type:[
            {img_src:require('../images/selected.png'),type_name:'满减优惠'},
            {img_src:require('../images/not_select.png'),type_name:'折扣优惠'},
          ],
          select_show:2,//默认为拼团
          type_show:0,
          coupon_data:{
            coupons_name:'',//优惠券名称
            discount:'',//折扣
            issue_number:'',//发放个数
            use_standard:'',//使用条件
          },
          valid_data:{
            start_date:'请选择开始时间',
            end_date:'请选择结束时间',
          },
          is_confirm:false,
          show_notice:false,
          noticeMsg:'提示信息',
        }
      },
      watch:{
        select_show(val){
          if(val==0){
            this.select_type[1].img_src=this.select_imgArr[1];
            this.select_type[2].img_src=this.select_imgArr[1]
          }else if(val==1){
            this.select_type[0].img_src=this.select_imgArr[1];
            this.select_type[2].img_src=this.select_imgArr[1]
          }else if(val==2){
            this.select_type[0].img_src=this.select_imgArr[1];
            this.select_type[1].img_src=this.select_imgArr[1]
          }
        },
        type_show(val){
          if(val==0){
            this.coupon_type[1].img_src=this.select_imgArr[1];
          }else{
            this.coupon_type[0].img_src=this.select_imgArr[1];
          }
        },
        coupon_data:{
          handler: function() {
            this.isSelectedAll()
          },
          deep: true
        },
        valid_data:{
          handler: function() {
            this.isSelectedAll()
          },
          deep: true
        },
        show_notice(val){
          if(val){
            setTimeout(() => {
              this.show_notice = false
            },2000)
          }
        }
      },
      methods:{
        isSelectedAll(){//是否填完必填
          if(this.coupon_data.coupons_name&&this.coupon_data.discount&&
            this.coupon_data.issue_number&&this.coupon_data.use_standard&&
            this.valid_data.start_date!=='请选择开始时间'&&
            this.valid_data.end_date!=='请选择结束时间'){
            this.is_confirm=true
          }else {
            this.is_confirm=false
          }
        },
        chooseType(index){
          this.select_show=index;
          this.select_type[index].img_src=this.select_imgArr[0]
        },
        chooseModel(index){
          this.type_show=index;
          this.coupon_type[index].img_src=this.select_imgArr[0]
        },
        confirmCoupon(){
          if(this.coupon_id){
            this.editCoupon(this.coupon_id)
          }else {
            this.confirm_add();
          }
        },
        editCoupon(coupon_id){
          let params={
            id:coupon_id,
            merchants_id:this.user_info.merchants_id,
            coupons_name:this.coupon_data.coupons_name,
            discount:this.coupon_data.discount,
            use_standard:this.coupon_data.use_standard,
            starttime:this.valid_data.start_date,
            overtime:this.valid_data.end_date,
            type:String(this.type_show+1),
            usable_goods_type:String(this.select_show),
            issue_number:this.coupon_data.issue_number,
            timeStamp:formatDateTime(new Date())
          };
          request.editMerchantsCoupons(params).then(res=>{
            this.show_notice=true;
            this.noticeMsg=res.data.message;
            setTimeout(()=>{
              this.$router.push({path:'/couponList'})
            },2000)
          })
        },
        confirm_add(){
          let params={
            usable_goods_type:String(this.select_show),
            type:String(this.type_show+1),
            coupons_name:this.coupon_data.coupons_name,
            discount:this.coupon_data.discount,
            issue_number:this.coupon_data.issue_number,
            use_standard:this.coupon_data.use_standard,
            starttime:this.valid_data.start_date,
            overtime:this.valid_data.end_date,
            merchants_id:this.user_info.merchants_id,
            timeStamp:formatDateTime(new Date())
          };
          request.addMerchantsCoupons(params).then(res=>{
            if(res.data.code==200){
              this.$router.push({path:'/couponList'})
            }
          })
        },
        getCouponsInfo(coupon_id){
          let params={
            id:coupon_id,
            timeStamp:formatDateTime(new Date())
          };
          request.getMerchantsCouponsInfo(params).then(res=>{
            this.assignment(res.data.data)
          })
        },
        assignment(coupon_info){
          this.select_show=coupon_info.usable_goods_type;
          this.coupon_data.issue_number=coupon_info.issue_number;
          this.type_show=coupon_info.type-1;
          this.coupon_type[coupon_info.type-1].img_src=this.select_imgArr[0];
          this.coupon_data.coupons_name=coupon_info.coupons_name;
          this.coupon_data.discount=Number(coupon_info.discount);
          this.coupon_data.use_standard=coupon_info.use_standard;
          this.valid_data.start_date=coupon_info.starttime.split(' ')[0];
          this.valid_data.end_date=coupon_info.overtime.split(' ')[0];
        },
        getQuery(){
          if(this.coupon_id){
            this.getCouponsInfo(this.coupon_id)
          }
        },
      },
      created(){
        this.getQuery()
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
  background-color: @bg-c;
  box-shadow: 0 0 15px 0
  rgba(0, 1, 1, 0.05);
  .mixin-borderRadius(10px)
}
#add_coupon{
    min-height: 100%;
    padding-top: 90px;
    background-color: @bg-b;
    .content{
      padding: 20px 32px 0;
      .add_wrap{
        padding: 0 20px;
        .add_item{
          padding: 30px 0;
          border-bottom: 1px solid @border_c;
          display: flex;
          align-items: center;
          &:last-child{
            border-bottom: none;
          }
          .title{
            margin-right: 130px;
          }
          .wordFour{
            margin-right: 105px;
          }
          .wordFive{
            margin-right: 80px;
          }
          .coupon_type{
            display: flex;
            align-items: center;
            margin-right: 85px;
            &:last-child{
              margin-right: 0;
            }
            img{
              margin-right: 10px;
            }
          }
          .coupon_model{
            display: flex;
            align-items: center;
            margin-right: 40px;
            &:last-child{
              margin-right: 0;
            }
            img{
              margin-right: 10px;
            }
          }
          .money,.num,.condition{
            .amount{
              border: none;
            }
            #cond{
              text-align: center;
            }
          }
          .valid_date{
            .item_time{
              display: inline-block;
              &:first-child{
                padding-right: 28px;
                margin-right: 28px;
                border-right: 1px solid @border_c;
              }
            }
          }
        }
      }
      .btn{
        display: block;
        margin: 0 auto;
        border: none;
        .mixin-borderRadius(8px);
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        margin-top: 40px;
      }
      .notAll_btn{
        .mixin-setButton(500px,60px,@G6,@bg-i,24px,none);
      }
      .confirm_btn{
        .mixin-setButton(500px,60px,@G1,@bg-d,24px,none);
      }
    }
}
</style>

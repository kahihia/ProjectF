<template>
    <div id="goods_detail">
      <!--头部-->
      <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :showImg="showImg"
                :goods_id="good_info.id" :is_collect="good_info.is_collection"
                @is_collect="is_collect" @WXShare="show_guide=true">
      </head_bar>
      <!--banner-->
      <div class="banner">
        <swiper auto height="489px" dots-position="center">
          <swiper-item
            class="swiper-demo-img"
            v-for="(item,index) in good_info.goods_imgArr"
            :key="index">
            <img :src="imgUrl(item)" :onerror="$store.state.remix.errorImg" width="100%" height="auto" style="min-height: 489px">
          </swiper-item>
        </swiper>
      </div>
      <div class="detail_wrap card">
        <!--商铺信息-->
        <div class="merchant_info border_bot">
          <div class="t_e good_name">
            <div class="identification">
              <img v-show="good_info.is_official==1" class="ident-img" src="@/assets/images/common/findif.png">
              <img v-show="good_info.merchants_goods_type==2&&good_info.is_official==0" class="ident-img" src="@/assets/images/common/spell.png">
              <p class="good-name">{{good_info.merchants_goods_name}}</p>
            </div>
            <div class="c-b">{{$route.query.distance}}</div>
          </div>
          <div class="evaluate">
            <img  v-for="i in good_info.merchants_goods_comments_star_level" src="../../assets/images/icon/icon_star.png"/>
            <span class="c-b">{{good_info.merchants_goods_comments_number}}评价</span>
          </div>
          <div class="time">
            <div class="time-a time-icon c-a" v-if="good_info.merchants_open_time">{{good_info.merchants_open_time}}</div>
            <div class="time-a time-icon c-a" v-else>商家暂未填写</div>
            <div class="time-a address p_a" v-if="good_info.merchants_address&&good_info.is_official==0" @click="chooseLApp">{{good_info.merchants_address }}</div>
            <div class="time-a address p_a" v-else-if="good_info.merchants_goods_address&&good_info.is_official==1" @click="chooseLApp">{{good_info.merchants_goods_address }}</div>
            <div class="time-a address c-a" v-else>暂无地址</div>
            <div class="chat">
              <a :href="'tel:'+good_info.merchants_phone">
                <span><img class="mixin-center" src="../../assets/images/detail/icon_phone.png"/></span>
              </a>
              <span @click="toChat()"><img class="mixin-center" src="../../assets/images/detail/icon_Msg.png"/></span>
            </div>
          </div>
        </div>
        <!--优惠券-->
        <div class="point c-a borderBox border_bot">
          <div class="coupon_wrap">
            <div class="img_box"><img src="../../assets/images/detail/icon_coupon.png"/></div>
            <span v-if="good_info.left_show_goods_discount!=10">优惠券</span>
          </div>
          <span class="c-b" @click="show_voucher=true">查看详情</span>
        </div>
        <div class="valid_date c-a border_bot" v-show="good_info.merchants_goods_type==1&&good_info.is_official==0">
          可用时间：{{good_info.merchants_goods_available_time}}
        </div>
        <div class="valid_date c-a border_bot" v-show="good_info.merchants_goods_type==2&&good_info.is_official==0">
          <div class="up_line">
            <img class="icon_date" src="./images/time.png">
            <span class="date_time" @click="toCalendar(good_info.merchants_goods_available_time_weeks,good_info.merchants_goods_end_time,good_info.merchants_goods_start_time)">{{spellDate}}</span>
            <div class="weeks_block">{{weekDay}}</div>
          </div>
          <div class="down_line">
            <div class="field_item" v-show="good_info.merchants_goods_available_time_arr&&good_info.merchants_goods_available_time_arr.length>0"
                 v-for="(item,index) in good_info.merchants_goods_available_time_arr">
              <span>{{item.time}}</span>
              <div class="mid_block">
                <span class="c-h" v-if="good_info.merchants_goods_min_pople>item.buy_number">还差
                  <em class="e_b">{{good_info.merchants_goods_min_pople-item.buy_number}}人</em>拼团成功
                </span>
                <span class="c-h" v-else-if="good_info.merchants_goods_max_pople>item.buy_number">还差
                  <em class="e_b">{{item.poor_number}}人</em>拼满
                </span>
                <span class="c-f">截止时间 {{item.end_group_time}}</span>
              </div>
              <div class="check_box">
                <label  class="radio">
                  <span class="radio-bg"></span>
                  <input type="radio" name="spell" class="spellCheck" @change="changeField(item.time)">
                  <span class="radio-on"></span>
                </label>
              </div>
            </div>
            <div style="text-align: center" v-show="good_info.merchants_goods_available_time_arr&&good_info.merchants_goods_available_time_arr.length==0">该天暂无场次</div>
          </div>
        </div>
        <div class="e_f officalField" v-show="good_info.is_official==1">
          活动时间：{{good_info.merchants_goods_field_time}}
        </div>
        <!--参加的人数-->
        <div class="join_num border_bot">
          <div class="join c-a">
            <div class="title">
              <em class="red_bg"><img class="mixin-center" src="../../assets/images/detail/icon_member.png"/></em>
              <span>{{good_info.participate_num}}个人参加</span>
            </div>
            <!--<span class="mixin-right c-b">查看详情</span>-->
          </div>
          <div class="people">
            <scroller @touchmove.prevent lock-y scrollbar-x :bounce=false height="64px">
              <div class="partHeadImg" ref="partHeadImg">
                <div class="item" v-for="(item,index) in good_info.AlreadyUser" @click="toUserInfo(item.goods_order_user_id)">
                  <img class="mixin-img" :src="imgUrl(item.head_img)" />
                </div>
              </div>
            </scroller>
          </div>
        </div>
        <div></div>
        <!--评论区-->
        <div class="comment_wrap" v-show="comment_list.length>0">
          <div class="head_title">
            <div class="title">
              <em class="red_bg"><img class="mixin-center" src="./images/icon_comment.png"/></em>
              <span class="c-a">评价</span>
            </div>
            <span class="mixin-right c-b">查看详情</span>
          </div>
          <ul class="comment_list">
            <li class="comment_item" v-for="(item,index) in comment_list" :key="index">
              <div class="up_info">
                <div class="user_info">
                  <div class="head_img"><img class="mixin-img" :src="imgUrl(item.head_img)"/></div>
                  <span class="user_name c-o">{{item.user_name}}</span>
                </div>
                <div><img v-for="i in item.merchants_goods_comments_star_level" src="../../assets/images/icon/icon_star.png"/></div>
              </div>
              <div class="mid_text c-a">{{item.comment_content}}</div>
              <div class="down_imgs">
                <ul class="img_wrap">
                  <li class="img_item" v-if="item.comment_img" v-for="(val,key) in item.comment_images" @click="show(key,index)" :key="key">
                    <img class="previewer-img" :src="imgUrl(val.msrc)"/>
                  </li>
                </ul>
                <!--放大图片组件-->
                <div v-transfer-dom>
                  <previewer :list="item.comment_images" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="imgs_text card">
        <!--图文详情-->
        <div class="top_text" v-if="good_info.merchants_goods_info" v-html="good_info.merchants_goods_info"></div>
        <!--地图-->
        <div id="mapWrap"></div>
      </div>
      <!--优惠券列表-->
      <div class="voucher_wrap" v-transfer-dom>
        <popup v-model="show_voucher" position="bottom" max-height="50%">
          <div class="head_title">
            <p class="title t-b">优惠详情
              <span @click="show_voucher=false" class="mixin-right"><img src="../../assets/images/icon/close.png"></span>
            </p>
          </div>
          <div class="voucher-list">
            <div class="null_wrap c-b" v-if="coupon_list.length===0">{{coupon_data.message}}</div>
            <div class="voucher-item" v-for="(item,index) in coupon_list" :style="'background:url('+item.catCoupon_img+') no-repeat 50% 50% ;color:'+item.coupon_color+';'">
              <div class="item-left">
                <div class="left_wrap">
                  <p class="coupon_name">{{item.coupons_name}}</p>
                  <ul class="condition">
                    <li>满{{item.use_standard}}使用</li>
                    <li>{{item.merchants_name}}</li>
                  </ul>
                  <p class="overtime">使用期限：{{item.starttime}}-{{item.overtime}}</p>
                </div>
                <div class="right_wrap">
                  <em v-if="item.type==1">￥ <i class="numFs">{{item.discount}}</i></em>
                  <em v-if="item.type==2"><i class="numFs">{{Number(item.discount)}}</i>折</em>
                </div>
              </div>
              <div class="item-right" @click="receiveCoupon(item.id)" v-if="item.is_receive==0">领取</div>
              <div class="item-right c-b" v-else>已领取</div>
            </div>
          </div>
        </popup>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="showRealInfo" class="real-info" hide-on-blur :scroll="false"
                  :dialog-style="{'width':'686px','max-width':'686px','padding':'40px 40px 60px','box-sizing':'border-box','border-radius': '12px'}">
          <div class="head-title">
            <p class="c-Bf big-title">完善个人信息</p>
            <p class="c-t">Findif 为你购买出行保险需要您的真实信息</p>
          </div>
          <div class="form-info">
            <div class="form-item">
              <img src="./images/realname.png">
              <input v-model="realInfo.real_name" ref="inputs" :readonly="isreadonly" class="inp-item c-x" type="text" placeholder="填写真实姓名">
            </div>
            <div class="form-item">
              <img src="./images/idcard.png">
              <input v-model="realInfo.id_card" :readonly="isreadonly" class="inp-item c-x" type="text" placeholder="填写身份证号">
            </div>
          </div>
          <div class="btn-g">
            <button class="item-btn think" @click="editInfo">修改信息</button>
            <button class="item-btn confirm" @click="submitReal">确认提交</button>
          </div>
        </x-dialog>
      </div>
      <!--btn-->
      <div class="footer borderBox clearfix">
        <div class="footer-left borderBox clearfix _left">
          <div class="price borderBox">
            <div class="price-a">
              <span class="price-b">￥{{good_info.merchatns_goods_platform_discount_price}}</span>
              <span class="price-c delete_line">原价<span class="delete_line">￥{{good_info.merchatns_goods_platform_price}}</span></span>
            </div>
          </div>
          <!--<div class="time">-->
            <!--<span>倒计时<em class="e_a">{{Countdown.hour}}:{{Countdown.minute}}:{{Countdown.second}}</em></span>-->
            <!--<span>结束时间 <em class="e_a" style="font-size: 18px">{{Countdown.day}}天</em></span>-->
          <!--</div>-->
        </div>
        <div class="footer-right borderBox _left" @click="buyGood">购买</div>
      </div>
      <div class="notice goodinfo-notice" v-transfer-dom>
        <popup v-model="show_notice" position="top" :show-mask="false">
          <div class="position-vertical-demo">{{noticeMsg}}</div>
        </popup>
      </div>
      <div class="shareGuide" v-show="show_guide" @click="show_guide=false">
        <img src="../../assets/images/common/share_guide.png" />
      </div>
      <div class="hint" v-transfer-dom>
        <confirm v-model="confirm_show"
                 title="操作提示"
                 @on-confirm="onConfirm">
          <p style="text-align:center;">{{confirm_content}}</p>
        </confirm>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import AMap from '@/utils/AMap'
  import count_down from '@/components/count_down'
  import {Swiper,SwiperItem,Previewer,Popup,XDialog,Confirm,Scroller,TransferDomDirective as TransferDom} from 'vux';
  import {formatDateTime,formatDate} from '@/utils/format';
  import {wxShare,openLocation} from '@/utils/wxInit'
  import {getGreatCircleDistance,isIos,isToday} from '@/utils/utils'
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  let map,Marker;
  export default {
    name: "goods_detail",
    directives: {
      TransferDom,
      focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
    components: {head_bar,count_down,Swiper,SwiperItem,Previewer,Popup,Confirm,XDialog,Scroller},
    data() {
      return {
        tab_c: true,
        back_last: true,
        head: '详情',
        showImg: true,
        show_notice:false,
        noticeMsg:'提示信息',
        AMap:'',
        goods_id: this.$route.query.good_id,//商品id
        user_info: getLocalData('user_info'),//用户信息
        user_id: getLocalData('user_info').id,//用户id
        coupon_id:null,//优惠券id
        user_coupon_id:null,//优惠券id
        good_info: {},//商品详情
        coupon_list: [],//卡券列表
        coupon_data: [],//卡券数据
        defaultImg: 'this.src="' + require('@/assets/images/default_img.png') + '"',//默认图片
        timeStamp:formatDateTime(new Date()),//时间戳
        Countdown:{day:0,hour:0,minute:0,second:0},//倒计时
        show_index:null,
        spell_field:'',
        spellDate:'',
        weekDay:'',
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.previewer-img')[index];
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            let rect = thumbnail.getBoundingClientRect();
            // return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        },//photoswipe的设置
        comment_list:[],
        show_voucher:false,
        show_guide:false,
        confirm_show:false,
        showRealInfo:false,
        isreadonly:false,
        confirm_content:'',
        week_index:1,
        select_imgArr:[require('./images/selected.png'),require('./images/not_select.png')],
        bgColor:[
          {id:'',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
          {id:'0',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
          {id:'1137',img:require('@/assets/images/common/eatDrink.png'),color:'#f0614c'},
          {id:'1138',img:require('@/assets/images/common/palyer.png'),color:'#a45af5'},
          {id:'1139',img:require('@/assets/images/common/sport.png'),color:'#16d37d'},
          {id:'1140',img:require('@/assets/images/common/travel.png'),color:'#3884eb'}
        ],
        realInfo:{}
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
      showRealInfo(val){
        if(!val){
         this.isreadonly=true
        }
      },
    },
    methods: {
      editInfo(){
        this.isreadonly=false;
        this.$nextTick(()=>{   //正确写法
          this.$refs.inputs.focus();
        });
        this.realInfo.id_card=this.user_info.id_card_complete;
      },
      submitReal(){
        if(!this.realInfo.real_name&&!this.realInfo.id_card){
          this.show_notice=true;
          this.noticeMsg='您还未填写的身份信息'
        }else {
          if(!this.realInfo.real_name){
            this.show_notice=true;
            this.noticeMsg='请输入姓名'
          }else {
            if(!this.realInfo.id_card){
              this.show_notice=true;
              this.noticeMsg='请输入身份证号'
            }else {
              if(!this.regularStr(this.realInfo.id_card,'id_card')&&!this.regularStr(this.realInfo.real_name,'ch')){
                this.show_notice=true;
                this.noticeMsg='姓名和身份证号码格式不正确'
              }else {
                if(this.user_info.real_name){
                  if(this.realInfo.real_name!=this.user_info.real_name){
                    if(!this.regularStr(this.realInfo.real_name,'ch')){
                      this.show_notice=true;
                      this.noticeMsg='姓名格式错误'
                    }else {
                      this.updateUserInfo(this.realInfo.real_name,'real_name');
                    }
                  }
                }
                if(this.user_info.id_card_complete){
                  if(this.realInfo.id_card==this.user_info.id_card_complete||this.realInfo.id_card==this.user_info.id_card){
                    this.buySth();
                    this.showRealInfo=false
                  }else {
                    if(!this.regularStr(this.realInfo.id_card,'id_card')){
                      this.show_notice=true;
                      this.noticeMsg='身份证号格式不正确'
                    }else {
                      this.updateUserInfo(this.realInfo.id_card,'id_card')
                    }
                  }
                }
                if(this.realInfo.id_card==this.user_info.id_card_complete&&this.realInfo.real_name==this.user_info.real_name||
                  this.realInfo.id_card==this.user_info.id_card&&this.realInfo.real_name==this.user_info.real_name){
                  this.buySth();
                  this.showRealInfo=false
                }
              }
            }
          }
        }
      },
      updateUserInfo(content,cate){
        let params = {
          user_id:this.user_info.id,
          update_class:cate,
          update_content:content,
          timeStamp:this.timeStamp
        };
        request.updateUserInfo(params).then(res=>{
          this.show_notice=true;
          this.noticeMsg=res.data.message;
          if(res.data.code===200){
            this.getUserInfo(this.user_info.id).then(res=>{
              this.user_info=res;
              this.buySth();
              this.showRealInfo=false
            });

          }
        })
      },
      chooseLApp(){
        if(this.good_info.is_official==0){
          openLocation(this.good_info.merchants_latitude,this.good_info.merchants_longitude,this.good_info.merchants_name,this.good_info.merchants_address,this.$newHttpsSrc)
        }else if(this.good_info.is_official==1){
          openLocation(this.good_info.merchants_goods_address_latitude,this.good_info.merchants_goods_address_longitude,this.good_info.merchants_goods_address,this.good_info.merchants_goods_address,this.$newHttpsSrc)
        }
      },
      wx_share(){
        let options = {
          title:this.good_info.merchants_goods_name, // 分享标题
          info:this.good_info.merchants_goods_share_desc,//分享描述
          newUrl:'https://www.findif.cn/webapp/index.html?good_id='+this.goods_id+'&distance='+this.$route.query.distance,
          img:"https://www.findif.cn/Upload/2018/11/28/5bfe554c5fd0f.png"
        };
        wxShare(options,this.callback);
        // let params={
        //   category_id:this.good_info.merchants_goods_category,
        //   timeStamp:this.timeStamp
        // };
        // request.getUserShareSystem(params).then(res=>{
        //   let res_options = res.data.data;
        //   let options = {
        //     title:this.good_info.merchants_goods_name, // 分享标题
        //     info:this.good_info.merchants_goods_share_desc,//分享描述
        //     newUrl:res_options.url+'?good_id='+this.goods_id+'&distance='+this.$route.query.distance,
        //     img:res_options.img
        //   };
        //   // res_options.newUrl=res_options.url+'?good_id='+this.goods_id+'&distance='+this.$route.query.distance;
        //   wxShare(options,this.callback)
        // })
      },
      toUserInfo(user_id){
        this.$router.push({
          path:'/userInfo',
          query:{user_id:user_id}
        })
      },
      changeField(time){
        let spell_field=this.spellDate+' '+time;
        this.spell_field = spell_field;
        this.getUserBuyField(spell_field)
      },
      getUserBuyField(date){
        let params = {
          id:this.goods_id,
          choose_date:date,
          timeStamp:this.timeStamp
        };
        request.getMerchantsGoodsFieldBuyUser(params).then(res=>{

        })
      },
      callback(){
        this.show_guide=false;
      },
      is_collect(whether){
        this.getGoodsInfo()
      },
      getGoodsInfo() {
        let that = this;
        let params = {
          goods_id: String(that.goods_id),
          user_id: that.user_id,
          timeStamp: this.timeStamp,
        };
        request.getGoodsInfo(params).then(res => {
          let good_info = res.data.data;
          let lnglatXY=[];
          if(good_info.is_official==1){
            lnglatXY=[Number(good_info.merchants_goods_address_longitude),Number(good_info.merchants_goods_address_latitude)]
          }else {
            lnglatXY=[Number(good_info.merchants_longitude),Number(good_info.merchants_latitude)]
          }
          good_info.AlreadyUser?good_info.participate_num = good_info.AlreadyUser.length:good_info.participate_num = 0;
          this.$refs.partHeadImg.style.width = 82 * good_info.AlreadyUser.length + 'px';
          good_info.merchants_goods_img?good_info.goods_imgArr=good_info.merchants_goods_img.split(','):false;
          good_info.left_show_goods_discount=Number(good_info.merchants_goods_discount);
          good_info.show_goods_discount = Number(good_info.merchants_goods_discount)*10+'%';
          // good_info.merchants_goods_info = this.unEscape(good_info.merchants_goods_info);
          that.good_info=good_info;
          this.getMerchantsCoupons();
          if(this.$route.query.date){
            this.getSpell(this.$route.query.date)
          }
          this.getQuery();
          this.wx_share();
          this.initMap(lnglatXY);
          if(good_info.is_official==0){
            this.getComments();
          }else if(good_info.is_official==1){
            this.getGfComments();
            this.spell_field=good_info.merchants_goods_field_time
          }
        })
      },
      getSpell(date){
        // getMerchantsGoodsField
        let params={
          id:this.goods_id,
          choose_date:date,
          timeStamp:this.timeStamp
        };
        request.getMerchantsGoodsField(params).then(res=>{
          this.good_info.merchants_goods_available_time_arr=res.data.data;
        })
      },
      //获取优惠券列表
      getMerchantsCoupons(){
        let that = this;
        let params={user_id:this.user_id,merchants_id:that.good_info.merchants_goods_merchants_id,timeStamp: that.timeStamp};
        request.getMerchantsCoupons(params).then(res=>{
          this.coupon_list = res.data.data;
          this.coupon_data = res.data;
          if(that.coupon_list.length>0){
            that.coupon_list.forEach((val,key)=>{
              that.bgColor.forEach((item,index)=>{
                if(val.usable_goods_category_id===item.id){
                  val.catCoupon_img=item.img;
                  val.coupon_color=item.color;
                }
              })
            });
          }
        })
      },
      receiveCoupon(coupon_id){
        let that = this;
        let params={
          user_id:that.user_id,
          merchants_coupons_id:coupon_id,
          timeStamp:that.timeStamp
        };
        request.userReceiveCoupons(params).then(res=>{
          this.noticeMsg=res.data.message;
          this.show_notice=true;
          this.getMerchantsCoupons()
        })
      },
      //获取商品评价列表
      getGfComments(){
        let that = this;
        let params={ timeStamp:this.timeStamp };
        request.getGfGoodsComments(params).then(res=>{
          let comment_list = res.data.data;
          let comment_images=[];
          comment_list.forEach((val,key)=>{
            if(val.comment_img){
              val.comment_images=comment_images;
              let comment_img = val.comment_img.split(',');
              comment_img.forEach((item,index)=>{
                comment_img.length===1?
                  comment_images=[{src:that.imgUrl(item),msrc:that.imgUrl(item)}]:
                  comment_images.push({src:that.imgUrl(item),msrc:that.imgUrl(item)})
              });
              val.comment_images=comment_images;
            }
          });
          this.comment_list=comment_list;
          console.log(this.comment_list,'this.comment_list')
        })
      },
      getComments(){
        let that = this;
        let params = {goods_id:this.goods_id,timeStamp:this.timeStamp};
        request.getGoodsComments(params).then(res=>{
          let comment_list = res.data.data;
          let comment_images=[];
          comment_list.forEach((val,key)=>{
            if(val.comment_img){
              val.comment_images=comment_images;
              let comment_img = val.comment_img.split(',');
              comment_img.forEach((item,index)=>{
                comment_img.length===1?
                  comment_images=[{src:that.imgUrl(item),msrc:that.imgUrl(item)}]:
                  comment_images.push({src:that.imgUrl(item),msrc:that.imgUrl(item)})
              });
              val.comment_images=comment_images;
            }
          });
          this.comment_list=comment_list;
          console.log(this.comment_list,'this.comment_list')
        })
      },
      buyGoodsFn(params){
        let that = this;
        request.buyMerchantsGoods(params).then(res=>{
          if(res.data.code===200){
            that.$router.push({path:'/confirmOrder',query:{order_id:res.data.data.id}});
          }else {
            this.show_notice=true;
            this.noticeMsg=res.data.message
          }
        });
      },
      buySth(){
        let that = this;
        let params = {
          goods_order_goods_id:that.good_info.id,
          goods_order_user_id:that.user_id,
          timeStamp:that.timeStamp
        };
        if(that.good_info.is_official==1){
          that.spellDate = that.good_info.merchants_goods_field_time.split(" ")[0];
        }
        if(this.good_info.merchants_goods_type===String(2)){
          if(this.spell_field){
            params.goods_order_goods_field=this.spell_field;
            if(isToday(this.spellDate)){
              this.buyGoodsFn(params)
            }else {
              this.confirm_show=true;
              this.confirm_content='您确定购买'+this.spell_field+'该场次吗？';
            }
          }else {
            this.show_notice=true;
            this.noticeMsg='请选择拼团场次'
          }
        }else {
          this.buyGoodsFn(params)
        }
      },
      buyGood(){
        let that = this;
        if(that.good_info.merchants_goods_is_need_insurance==="1"){
          this.showRealInfo=true;
          this.realInfo.id_card=this.user_info.id_card;
        }else if(that.good_info.merchants_goods_is_need_insurance==="0"){
          this.buySth()
        }
      },
      onConfirm(){
        let that = this;
        let params = {
          goods_order_goods_id:that.good_info.id,
          goods_order_user_id:that.user_id,
          timeStamp:that.timeStamp,
          goods_order_goods_field:this.spell_field
        };
        this.buyGoodsFn(params)
      },
      // 倒计时
      timeOut(){
        let that=this;
        if(that.good_info.merchants_goods_end_time){
          let end_time = new Date(that.good_info.merchants_goods_end_time.replace(/-/g, "/"));
          let settime=setInterval(function () {
            let nowTime=Math.floor(new Date().getTime() / 1000);
            let time=end_time - nowTime;
            that.Countdown.hour = (Array(2).join('0')+parseInt(time / 60/ 60 % 60)).slice(-2);
            that.Countdown.minute =(Array(2).join('0')+parseInt(time / 60 % 60)).slice(-2);
            that.Countdown.second = (Array(2).join('0')+parseInt(time % 60)).slice(-2);
          },1000)
        }
      },
      toChat(){
        let that = this;
        let shopImgArr = that.good_info.merchants_img.split(',');
        that.$router.push({
          path:'/chatIn',
          query:{
            to_nickname:that.good_info.merchants_name,//接收者昵称
            urlImg:shopImgArr[0],//接收者头像
            to_username:that.good_info.merchants_admin_phone,//接收者用户名
            good_id:that.good_info.id,//商品id
          }
        })
      },
      toCalendar(weeks,end_time,start_time){
        let that = this;
        this.$router.push({
          path:'/calendar',
          query:{available_time:JSON.stringify(weeks),end_time:end_time,start_time:start_time,good_id:that.goods_id}
        })
      },
      // 放大图片
      show (key,index) {
        this.show_index=index;
        this.$refs.previewer[index].show(key);
      },
      logIndexChange (arg) {
      },
      getQuery(){
        this.$route.query.date?this.spellDate=this.$route.query.date:this.spellDate=this.good_info.merchants_goods_available_time_now_day;
        this.$route.query.weekDay?this.weekDay=this.weekFn(this.$route.query.weekDay):this.weekDay=this.good_info.merchants_goods_available_time_now_week
      },
      changeWeek(index){
        this.week_index = index+1;
      },
      initMap (lnglatXY) {
        this.$nextTick(()=>{
          AMap.init().then((AMap) => {
            this.AMap=AMap;
            this.setMap(lnglatXY); //创建地图
          });
        });
      },
      setMap(lnglatXY){
        console.log(lnglatXY);
        let that = this;
        map = new that.AMap.Map('mapWrap', {
          zoom:15,
          size: new that.AMap.Size(35, 35),
          resizeEnable: true,
          center:lnglatXY,
          mapStyle: "amap://styles/whitesmoke",
          dragEnable:false,
          doubleClickZoom:false,
          zoomEnable:false
        });
        that.markerInit(AMap);
        that.AMap.event.addListener(map,'click',function () { //添加点击事件,传入对象名，事件名，回调函数
          that.chooseLApp()
        })
      },
      markerInit(){
        // 初始化标记
        Marker = new this.AMap.Marker({
          position: map.getCenter(),
          animation: 'AMAP_ANIMATION_DROP',
          icon:require('../../assets/images/icon_map/icon_location.png')
        });
        Marker.setMap(map);
      },
      getInfo(){
        this.getUserInfo(this.user_id).then(res=>{
          this.user_info=res;
          this.realInfo={
            real_name:res.real_name,
            id_card:res.id_card
          };
          res.real_name&&res.id_card?this.isreadonly=true:this.isreadonly=false
        });
      }
    },
    created(){
      this.getGoodsInfo();

      this.getInfo();
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
  @import "../../assets/less/reset";
  .border_bot{
    border-bottom: 1px solid @border_d;
  }
  .card{
    background-color: @W1;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
  }
  .red_bg{
    display: inline-block;
    width: 36px;
    height: 36px;
    background: @hot;
    .mixin-borderRadius(50%);
    position: relative;
    margin-right: 12px;
  }
  #goods_detail{
    position: relative;
    width: 100%;
    min-height: 100%;
    padding-bottom: 120px;
    background-color: @bg-b;
    .banner {
      width: 100%;
      height: 489px;
    }
    .detail_wrap{
      padding: 18px 0 40px 30px;
      margin-bottom: 16px;
      .merchant_info{
        padding-right: 32px;
        .good_name{
          padding-top: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .identification{
            width: 80%;
            display: flex;
            align-items: center;
            .ident-img{
              width: 70px;
              height: 30px;
            }
            .good-name{
              .mixin-cliptext(2);
              max-width: 100%;
              margin-left: 10px;
            }
          }
        }
        .evaluate{
          margin-top: 15px;
        }
        .time {
          position: relative;
          margin-bottom: 0;
          .time-a {
            padding-left: 42px;
            position: relative;
            &::before {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 0;
              content: '';
              width: 28px;
              height: 28px;
            }
          }
          .time-icon {
            margin-top: 24px;
            &::before {
              background: url("../../assets/images/detail/icon_timie.png") no-repeat center;
            }
          }
          .address {
            margin-top: 14px;
            margin-bottom: 18px;
            width: 500px;
            &::before {
              height: 30px;
              background: url("../../assets/images/detail/icon_pos.png") no-repeat center;
            }
          }
          .chat{
            position: absolute;
            right: 0;
            top: -14px;
            width: 190px;
            display: flex;
            justify-content: space-around;
            align-content: center;
            span {
              display: block;
              width: 72px;
              height: 72px;
              overflow: hidden;
              background: @G1;
              .mixin-borderRadius(50%);
              position: relative;
            }
          }
        }
      }
      .point {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 20px 32px 28px 7px;
        .coupon_wrap{
          display: flex;
          align-items: center;
          .img_box{
            margin-right: 8px;
          }
          .coupon_item {
            display: inline-block;
            width: 60px;
            height: 26px;
            border: 2px solid @hot;
            .mixin-borderRadius(4px);
            text-align: center;
            margin-left: 10px;
            &:nth-of-type(1){
              margin-left: 15px;
            }
          }
        }
      }
      .valid_date{
        padding: 25px 0 17px 5px;
        .up_line{
          display: flex;
          align-items: center;
          .date_time{
            margin-left:7px;
          }
          .weeks_block{
            text-align: center;
            flex: 0 0 72%;
          }
        }
        .down_line{
          padding: 40px 20px;
          background-color: @bg-e;
          margin-right: 32px;
          margin-top: 20px;
          .field_item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 26px;
            &:first-child{
              margin-top: 0;
            }
            .mid_block{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
            }
            .check_box{
              position: relative;
              height: 40px;
              width: 40px;
              .spellCheck{
                /*display: block;*/
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .officalField{
        padding: 20px 0;
        border-bottom: 1px solid rgba(107, 127, 158, 0.2);
      }
      .join_num{
        padding: 20px 32px 20px 2px;
        .join {
          position: relative;
          margin-bottom: 23px;
          .title {
            display: flex;
          }
        }
        .item {
          display: inline-block;
          width: 64px;
          height: 64px;
          overflow: hidden;
          background: #ffe035;
          .mixin-borderRadius(50%);
          margin-right: 18px;
        }
      }
      .comment_wrap{
        padding: 22px 32px 0 2px;
        .head_title{
          position: relative;
          margin-bottom: 18px;
          .title{
            display: flex;
          }
        }
        .comment_list{
          .comment_item{
            margin-bottom: 30px;
            &:last-child{
              margin-bottom: 0;
            }
            .up_info{
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              .user_info{
                display: flex;
                align-items: center;
                .head_img{
                  width: 64px;
                  height: 64px;
                  .mixin-borderRadius(50%);
                  overflow: hidden;
                  margin-right: 18px;
                }
              }
            }
            .mid_text{
              .mixin-cliptext(2);
              margin-bottom: 13px;
            }
            .down_imgs{
              .img_wrap{
                display: flex;
                flex-wrap: wrap;
                .img_item{
                  flex: 0 0 33.3333%;
                  img{
                    width: 222px;
                    height: 160px;
                    text-align: center;
                    line-height: 160px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .imgs_text{
      padding: 24px 0;
      font-size: 24px;
      .content {
        .title {
          padding: 24px 34px 60px 34px;
        }
        .top_text{
          display: block;
          padding: 0 58px 32px 34px;
          font-size: 20px;
        }
        .bottom_text{
          display: block;
          padding: 62px 58px 32px 35px;
        }
        .content-img {
          width: 100%;
          height: 360px;
          background: #ffe035;
        }
      }
    }
    #mapWrap{
      height: 250px;
      margin-top: 30px;
      font-size: 24px;
    }
    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 120px;
      opacity: 4;
      .footer-left {
        width: 422px;
        height: 100%;
        background: @G1;
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*align-items: center;*/
        .price {
          width: 246px;
          height: 100%;
          margin: 0 auto;
          text-align: center;
          display: flex;
          align-items: center;
          .price-a {
            width: 172px;
            .price-b {
              font-size: 46px;
              color: @Y2;
              display: block;
              padding-left: 16px;
            }
            .price-c {
              font-size: 18px;
              color: @bg-b;
              padding-left: 24px;
            }
          }
          em {
            width: 2px;
            height: 64px;
            background: @bg-b;
          }
        }
        .time {
          color: @bg-b;
          font-size: 18px;
          span {
            display: block;
          }
        }
      }
      .footer-right {
        width: calc(100% - 422px);
        height: 120px;
        background: @Y2;
        font-size: 46px;
        text-align: center;
        line-height: 120px;
      }
    }
    .shareGuide{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  label{
    position: relative;
    top: 14px;
    font-size: 16px;
    color: #B7BABB;
    line-height: 16px;
  }
</style>
<style lang="less">
  .real-info{
    .weui-dialog{
      .big-title{
        margin-bottom: 20px;
      }
      .form-info{
        margin-top: 60px;
        .form-item{
          display: flex;
          align-items: center;
          &:last-child{
            margin-top: 56px;
          }
          .inp-item{
            display: block;
            width:526px;
            padding: 15px 0;
            border: none;
            border-bottom: 2px solid #ababab;
            text-align: center;
            &::-webkit-input-placeholder{
              color: #909090;
              font-size: 30px;
            }
          }
        }
      }
      .btn-g{
        display: flex;
        justify-content: space-between;
        width: 485px;
        margin: 60px auto 0;
        .item-btn{
          border: none;
          border-radius: 10px;
        }
        .think{
          width: 160px;
          height: 60px;
          color: #252525;
          background-color: #d5d5d5;
          font-size:30px;
          border: none;
          &:active{
            background-color:#d5d5d5;
          }
        }
        .confirm{
          width: 160px;
          height: 60px;
          color: #252525;
          background-color: #ffe035;
          font-size:30px;
          border: none;
          &:active{
            background-color:#d5d5d5;
          }
        }
      }
    }
  }
  .goodinfo-notice{
    .vux-popup-dialog.vux-popup-top{
      z-index: 1000;
    }
  }
</style>
<style scoped>
  .top_text>>>img{
    width: 100%;
  }
</style>

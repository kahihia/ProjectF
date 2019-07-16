<template>
  <div id="good_center">
    <head_bar :tab_d_img="2" :headTitle="head_title" :tab_d="tab_d" :bg_color="bg_color" @addSth="add_goods"></head_bar>
    <div class="good_wrap">
      <div class="head_wrap">
        <div class="left_amount card" @click="toBudget">
          <div class="up_line">
            <span class="t-b-b">余额</span>
            <span class="_right c-p clearfix">详情</span>
          </div>
          <div class="down_line t-a-a">¥{{merchants_bill}}</div>
        </div>
        <div class="right_put" @click="toBalance">
          <div class="img_box"><img class="mixin-img" src="./images/icon_put.png"/></div>
          <div class="c-a put_cn">提现</div>
        </div>
      </div>
      <div class="tab_wrap">
        <tab custom-bar-width="60px" :line-width="8" bar-active-color="#ffe035" active-color="#363636" default-color="#959595">
          <tab-item selected @click.native="getGoodsList(1)">所有</tab-item>
          <tab-item @click.native="getGoodsList(1,2)">已发布</tab-item>
          <!--<tab-item>草稿箱</tab-item>-->
        </tab>
      </div>
      <div class="goods_wrap">
        <ul class="goods_list">
          <li v-show="goods_list.length>0" :class="item.merchants_goods_status==2? 'card good_item':'card_nd good_item'"
              v-for="(item,index) in goods_list" @touchstart="showDeleteButton" @touchend="clearLoop(item.id)">
            <div class="left_wrap">
              <div class="name t-b c-Bd">
                <div class="identification">
                  <img v-show="item.is_official==1" class="ident-img" src="@/assets/images/common/findif.png">
                  <img v-show="item.merchants_goods_type==2&&item.is_official==0" class="ident-img" src="@/assets/images/common/spell.png">
                  <p class="ellipsis good-name">{{item.merchants_goods_name}}</p>
                </div>
              </div>
              <div class="left_info">
                <div class="good_img"><img class="mixin-img" :src="imgUrl(item.merchants_goods_img[0])"></div>
                <div class="goods_info">
                  <!--<p class="good_name ellipsis t-b-b">{{item.merchants_goods_name}}</p>-->
                  <div class="evaluate">
                    <img v-for="i in item.merchants_goods_comments_star_level" src="@/assets/images/icon/icon_star.png"/>
                    <span class="c-b" v-if="item.merchants_goods_comments_star_level==0">暂无评价</span>
                  </div>
                  <p class="merchant_name c-a">{{item.merchants_name}}</p>
                  <p class="time_slot c-a">
                    {{item.merchants_goods_available_time}}
                    <span v-if="item.signEndTime==1">最后一天</span>
                  </p>
                  <div class="price_wrap">
                  <span class="t-b-b">
                    ¥<em :class="item.merchants_goods_status==2?'up':'down'">{{item.merchants_goods_discount_price}}</em>
                  </span>
                    <em class="p-original c-Bc">原价 ¥{{item.merchants_goods_price}}</em>
                  </div>
                </div>
              </div>
            </div>
            <div class="right_wrap">
              <button class="btn" v-show="item.merchants_goods_status==3|item.merchants_goods_status==1" @click="editGoods(item.id)">编辑</button>
              <button class="btn" v-show="item.merchants_goods_status==3|item.merchants_goods_status==1" @click="changeGoodsStatus(item.id,2)">上架</button>
              <button class="btn" v-show="item.merchants_goods_status==2" @click="changeGoodsStatus(item.id,3)">下架</button>
              <span v-show="item.merchants_goods_status==0" class="c-q">待审核</span>
            </div>
          </li>
          <li class="c-b mixin-center" v-show="goods_list.length==0">{{goods_data.message}}</li>
        </ul>
      </div>
    </div>
    <div class="hint" v-transfer-dom>
      <confirm v-model="hint_show"
               title="操作提示"
               @on-confirm="onConfirm">
        <p style="text-align:center;">确定删除吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import {Tab,TabItem,Confirm,TransferDomDirective as TransferDom} from 'vux';
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "good_center",
      components:{head_bar,Tab,TabItem,Confirm},
      directives: {TransferDom},
      data(){
        return{
          head_title:'商品中心',
          tab_d:true,
          bg_color:'#ffe035',//头部背景色
          timeStamp:formatDateTime(new Date()),//时间戳
          goods_list:[],
          goods_data:'',
          hint_show:false,
          user_info:getLocalData('user_info'),
          Loop:'',//计时器
          tab_index:0,
          goods_id:'',
          merchants_bill:'',
          confirm_content:'',
        }
      },
      created(){
        this.getUserInfo(this.user_info.id);
        this.getMerchantsBill();
        this.getGoodsList(1);
        this.$store.commit('selectedTab',{tab_index:1});
        this.$store.commit('userOrMerchant',{is_merchant:true});
      },
      methods:{
        toBudget(){
          this.$router.push({
            path:'/paymentList',
            query:{role:'merchant'}
          })
        },
        toBalance(){
          this.$router.push({
            path:'/balance',
            query:{role:'merchant'}
          })
        },
        editGoods(goods_id){
          this.$router.push({path:'/addGoods',query:{goods_id:goods_id}})
        },
        add_goods(){
          this.$router.push({path:'/addGoods'})
        },
        getGoodsList(status,index){
          let that = this;
          index?this.tab_index=index:false;
          let params={
            merchants_goods_merchants_id:getLocalData('user_info').merchants_id,
            is_merchants_get:status?String(status):null,
            timeStamp:formatDateTime(new Date()),
            merchants_goods_status:String(index)
          };
          index?true:delete params.merchants_goods_status;
          request.getGoodslist(params).then(res=>{
            let resData = res.data;
            let goods_list=res.data.data;
            this.goods_data=res.data;
            if(res.data.code==200){
              goods_list.map((item,index)=>{
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
              that.goods_data = resData;
            }
            that.goods_list=goods_list;
          })
        },
        changeGoodsStatus(goods_id,status){
          let that = this;
          let params={
            id:goods_id,
            merchants_goods_status:status,
            timeStamp:formatDateTime(new Date())
          };
          request.changeGoodsStatus(params).then(res=>{
            if(res.data.code==200){
              that.getGoodsList(1)
            }
          })
        },
        // 获取商铺余额
        getMerchantsBill(){
          let params={
            merchants_id:this.user_info.merchants_id,
            timeStamp:formatDateTime(new Date())
          };
          request.getMerchantsBill(params).then(res=>{
            this.merchants_bill=res.data.data
          })
        },
        showDeleteButton(){
          clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
          this.Loop=setTimeout(()=>{
            this.hint_show = true;
          },1000);
        },
        clearLoop(goods_id) {
          clearInterval(this.Loop);
          this.goods_id=goods_id;
        },
        onConfirm(){
          this.changeGoodsStatus(this.goods_id,4)
        },
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .card{
    background-color: @bg-c;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
  }
  .card_nd{
    background-color: @bg-f;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(12px);
  }
  #good_center{
    min-height: 100%;
    background-color: @bg-b;
    .good_wrap{
      padding-top: 90px;
      .head_wrap{
        width: 100%;
        padding: 27px 30px 30px 32px;
        display: flex;
        .left_amount{
          width: 475px;
          padding: 26px 24px 41px 33px;
          margin-right: 11px;
        }
        .right_put{
          width: 202px;
          background-color: @Y2;
          .mixin-borderRadius(12px);
          padding: 24px 51px 12px;
          .img_box{
            width: 100px;
            height: 100px;
          }
          .put_cn{
            margin-top: 7px;
            text-align: center;
          }
        }
      }
      .tab_wrap{
        padding-left: 36px;
        margin-bottom: 17px;
      }
      .goods_wrap{
        padding:0 30px 90px;
        .goods_list{
          .good_item{
            margin-top: 16px;
            position: relative;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            .left_wrap{
              .name{
                margin-bottom: 20px;
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
                    max-width: 85%;
                    margin-left: 10px;
                  }
                }
              }
              .left_info{
                display: flex;
                .good_img{
                  width: 96px;
                  height: 96px;
                  margin-right: 20px;
                  overflow: hidden;
                }
                .goods_info{
                  flex: 1;
                  .good_name{
                    font-size: 24px;
                    margin-bottom: 4px;
                  }
                  .evaluate{
                    margin-bottom: 11px;
                  }
                  .merchant_name{
                    margin-bottom: 6px;
                  }
                  .time_slot{
                    margin-bottom: 8px;
                  }
                  .price_wrap {
                    span {
                      position: relative;
                      .up {
                        background: linear-gradient(to bottom, @bg-c 0%, @bg-c 28%, @Y2 30%, @Y2 100%);
                        padding-left: 2px;
                        padding-right: 6px;
                      }
                      .down {
                        background: linear-gradient(to bottom, @bg-f 0%, @bg-f 28%, @Y2 30%, @Y2 100%);
                        padding-left: 2px;
                        padding-right: 6px;
                      }
                      .p-original {
                        padding-left: 12px;
                      }
                    }
                  }
                }
              }
            }
            .right_wrap{
              flex: 0 0 12%;
              .btn{
                display: block;
                .mixin-borderRadius(8px);
                border: none;
                &:nth-of-type(1){
                  .mixin-setButton(96px,48px,@W1,@G4,20px,none);
                  margin-bottom: 10px;
                }
                &:nth-of-type(2){
                  .mixin-setButton(96px,48px,@G1,@sign_bg,20px,none);
                }
                &:nth-of-type(3){
                  .mixin-setButton(96px,48px,@W1,@G1,20px,none);
                }
              }
              .mark{
                margin-top: 30px;
                transform: translateX(24px);
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  #good_center{
    .vux-tab-wrap{
      height: 50px;
      .vux-tab-container{
        width: 499px;
        height: 50px;
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
</style>

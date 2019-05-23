<template>
  <div class="scroll_demo">
    <head_bar></head_bar>
    <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
                use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh(categoryId)"
                lock-x ref="scrollerBottom" height="-48">
      <div class="outBox">
        <ul class="dateUl" id="innerI">
        <li v-if="activityList.length==0" class="nothingItem">{{activityData.message}}</li>
        <li v-else class="itemList" v-for="(item,index) in activityList">
          <div class="listBox">
            <div class="column leftColumn">
              <div class="headImgBox columnItem" v-cloak>
                <img :src="imgUrl(item.head_img)" class="toux" :onerror="defaultImg">
              </div>
            </div>
            <div class="column rightColumn">
              <div class="infoColumn">
                <div class="detailInfo columnItem">
                  <!--<div class="userName">{{item.user_name}}</div>-->
                  <!--<div class="doWhat">{{item.title}}</div>-->
                  <div class="bottomGroup">
                    <!--<img src="../../assets/images/Nearby/women.png" class="sex" v-if="item.sex=='2'">-->
                    <!--<img src="../../assets/images/Nearby/men.png" class="sex" v-else>-->
                    <div class="time">{{item.nowTimeToStartTime}}</div>
                    <div class="distance">{{item.distance}}km内</div>
                  </div>
                </div>
              </div>
              <div class="btnColumn">
                <div class="btnColumnSon">
                  <x-button mini plain type="primary" class="consumptionType">{{item.activity_cate_name}}</x-button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      </div>
   </scroller>
    <foot_bar></foot_bar>
  </div>
</template>

<script>
  import XButton from 'vux/src/components/x-button/index'
  import XDialog  from 'vux/src/components/x-dialog/index'
  import LoadMore  from 'vux/src/components/load-more/index'
  import Toast from 'vux/src/components/toast/index'
  import Scroller from 'vux/src/components/scroller/index'
  import ViewBox from 'vux/src/components/view-box/index'
  import head_bar from '@/components/head_bar'
  import foot_bar from '@/components/foot_bar'
  import request from '@/utils/request'
  import {formatDateTime} from '@/utils/format'
  import {imgUrl} from '@/utils/utils'
  const pulldownDefaultConfig = {
    content: '下拉刷新',
    height: 50,
    autoRefresh: false,
    downContent: '下拉刷新',
    upContent: '释放后刷新',
    loadingContent: '正在刷新...',
    clsPrefix: 'xs-plugin-pulldown-'
  };
  const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 60,
    height: 50,
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  };
    export default {
      name: "scroll_demo",
      components:{
        XButton,
        XDialog,
        LoadMore,
        Toast,
        Scroller,
        foot_bar,
        ViewBox,
        head_bar,
      },
      data(){
        return{
          activityList:[],
          activityData:[],
          categoryId:null,//活动类型id
          showToast:false,//提示信息显示
          showMsg:'',//提示信息内容
          startItem:0,
          endItem:8,
          totalCount:null,//总条数
          pullupDefaultConfig: pullupDefaultConfig,
          pulldownDefaultConfig: pulldownDefaultConfig,
          bodyPaddingBottom:'50px',
          bodyPaddingTop:'50px',
          defaultImg: 'this.src="' + require('@/assets/images/head_icon/icon_head.png') + '"'
        }
      },
      methods:{
        getActivity(categoryId,cb){//获取活动列表
          let that = this;
          categoryId=categoryId?categoryId:'';
          let params = {
            category_id:categoryId,
            limit_end:String(that.endItem),
            limit_start:String(that.startItem),
            timeStamp:formatDateTime(new Date())
          };
          request.getActivity(params).then(response => {
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset()
            });
            that.totalCount = response.data.data[0].count_number;
            cb(response.data);
          })
        },
        refresh() {//刷新
          this.endItem=10;
          this.getActivity(this.categoryId,data => {
            this.activityList = data.data;
            this.$refs.scrollerBottom.enablePullup();
            this.$refs.scrollerBottom.donePulldown()
          })
        },
        loadMore() {//加载更多
          this.getActivity(this.categoryId,data => {
            if (this.activityList.length >= this.totalCount) {
              this.$refs.scrollerBottom.disablePullup()
            }
            this.activityList = data.data;
            if(this.activityList.length >= this.endItem){
              this.endItem+=10;
            }
            this.$refs.scrollerBottom.donePullup();
          })
        },
      },
      // mounted(){
      //   this.categoryId=this.$route.query.categoryId;
      //   this.$nextTick(() => {//重置top
      //     this.$refs.scrollerBottom.reset({top: 0})
      //   });
      //   this.loadMore()
      // }
    }
</script>

<style lang="less" scoped>
  .outBox{
    font-size: 28px;

    .dateUl{
    padding: 0;
    width: 92%;
    margin: 0 auto;
    .itemList{
    height: 120px;
    display:flex;
    justify-content:center;
    align-items:center;
    -webkit-overflow-scrolling: touch;
    .listBox{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items:center;
    -webkit-overflow-scrolling: touch;
        .leftColumn{
          display: flex;
          justify-content: space-between;
          align-items:center;
          -webkit-overflow-scrolling: touch;
        //width: 55%;
          .headImgBox{
            width: 120px;
            height: 0;
            padding-bottom: 120px;
            border-radius: 50%;
            overflow: hidden;
            .toux{
              width: 120px;
              height: 120px;
            }
          }
        }
        .rightColumn{
          display: flex;
          justify-content: space-between;
          align-items:center;
          flex: 0 0 80%;
          -webkit-overflow-scrolling: touch;
          .infoColumn{
            display: flex;
            justify-content: space-between;
            -webkit-overflow-scrolling: touch;
          .detailInfo{
              .userName{
                font-size:28px;
                color: #fff;
              }
              .doWhat{
                font-size:28px;
                color: #17e171;
              }
              .bottomGroup{
                display: flex;
                justify-content: space-between;
                align-items:center;
                color: #505052;
                font-size:22px;
                -webkit-overflow-scrolling: touch;
              .sex{
                width: 20px;
                height: 20px;
              }
              }
            }
          }
          .btnColumn{
            .btnColumnSon{
              .consumptionType{
                width: 12vw;
                height: 5.6vw;
                line-height: 5.6vw;
                font-size: 24px;
                color: #17e171;
                border: 1px solid #17e171;
                border-radius: 23px;
              }
              .weui-btn_mini,.weui-btn{
                padding: 0;
               }
              }
            }
          }
        }
      }
    }
  }
</style>

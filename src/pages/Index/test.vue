<template>
  <div class="index">
    <!--v-show="isShow"-->
    <scroller v-model="scrollerStatus" height="-46" lock-x scrollbar-y ref="scroller"
              :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp"
              use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh">
      <div class="title">图文并茂</div>
      <div class="img">提交</div>
        <div v-for="(item, index) in list" >
            {{item.id}} || {{item.user_name}} || {{item.dynamic_content}}

        </div>
    </scroller>

    <load-more v-show="noData" :show-loading="false" :tip="('我是有底线的')" background-color="#313131"></load-more>
  </div>
</template>

<script>
  import { Scroller,LoadMore } from 'vux';
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  export default {
    name: "index",
    components: {Scroller,LoadMore},
    data(){
      return{
        list:[],
        startItem:0,//页码从第一页开始
        endItem:2,//煤业显示的条数
        num:2,
        user_id:'980',
        showUp: true,
        upobj: {
          content: '请上拉刷新数据',
          pullUpHeight: 60,
          height:40,
          autoRefresh: false,
          downContent: '请上拉刷新数据111',
          upContent: '请上拉刷新数据up',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        scrollerStatus: {
          pullupStatus: 'default'
        },
        pulldownDefaultConfig:{
          content: '下拉刷新',
          height: 40,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '释放后刷新',
          loadingContent: '正在刷新...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        noData:false,
      }
    },
    mounted () {
      //第一次加载
      this.getNewsList(true);
      this.$nextTick(() => {
        this.$refs.scroller.reset()
      })
    },
    methods:{
      getNewsList(isEmpty,refresh){
        let that=this;
        let params={ limit_end:String(that.endItem),limit_start:String(that.startItem),timeStamp:formatDateTime(new Date()),user_id:String(that.user_id) };
        request.getList(params).then(({ data }) => {
          let result=data.data;
          that.noData=false;
          if (isEmpty) {
            that.list = [];
            if(refresh==1){
              that.$refs.scroller.enablePullup();
              that.$refs.scroller.donePulldown();
            }
          } else {
            //isEmpty为false时，也就是向上滚动刷新selPullUp ()方法被被调用的时候
            if (result && result.length === 0) {
              that.noData=true;
              that.scrollerStatus.pullupStatus = 'disabled' ;// 禁用下拉
              return
            }
          }
          result.forEach(function (item, index) {
            that.list.push(item)
          });
          if (!isEmpty) {
            that.scrollerStatus.pullupStatus = 'default';
            that.$nextTick(() => {
              this.$refs.scroller.reset({top:0})
            })
          }

        })
      },
      selPullUp () {
        this.startItem = this.num;
        this.num = parseInt(this.num) + 2;
        this.getNewsList(false)
      },
      // 下拉刷新
      refresh(){
        this.startItem=0;
        this.num =2;
        this.getNewsList(true,1)
      },
    },
    activated () {
      this.$refs.scroller.reset()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .index{
    width: 100%;
    height: 100%;
    background: #fff;
    font-size:24px;
    .title{
      font-size:24px;
    }
    .img{
      margin: 0 auto ;
      text-align: center;
      .mixin-setButton(180px,auto,#fff,#000,24px,#eee)
      //.mixin-borderRadius()
    }
  }
</style>

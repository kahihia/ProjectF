<template>
    <div class="index" style="font-size: 28px">
      <!--v-model="scrollerStatus"  -->
      <scroller  style="font-size: 28px;"   height="-48" lock-x  ref="scroller"
                use-pullup   :pullup-config="pullUpConfig"  @on-pullup-loading="selPullUp"
                use-pulldown :pulldown-config="pullDownConfig" @on-pulldown-loading="refresh">
        <div class="box2" style="font-size: 28px;">
                  <div style="font-size: 28px">图文组合列表</div>
                  <div v-for="(item, index) in list" class="listItem">
                    {{item.id}} || {{item.user_name}}
                  </div>
          </div>
      </scroller>
      <load-more v-show="showData" :show-loading="false" :tip="('正在加载')" background-color="#fbf9fe"></load-more>
      <load-more v-show="noData" :show-loading="false" :tip="('底线')" background-color="#fbf9fe"></load-more>

    </div>
</template>

<script>
  import { Scroller,LoadMore  } from 'vux';
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
    export default {
        name: "index",
      components: {Scroller,LoadMore },
      data(){
          return{
             list:[],
            startItem:0,//页码从第一页开始
            endItem:2,//煤业显示的条数
            num:2,
            user_id:'980',
            showUp: true,
            pullUpConfig: {
              content: '请上拉刷新数据',//请上拉刷新数据
              pullUpHeight: 60,
              height:40,
              autoRefresh: false,
              downContent: '请上拉刷新数据111',//请上拉刷新数据111
              upContent: '请上拉刷新数据up',//请上拉刷新数据up
              loadingContent: '加载中...',//加载中...
              clsPrefix: 'xs-plugin-pullup-'

            },
            pullDownConfig:{
              content: '下拉刷新',
              height: 40,
              autoRefresh: false,
              downContent: '下拉刷新',
              upContent: '释放后刷新',
              loadingContent: '正在刷新...',
              clsPrefix: 'xs-plugin-pulldown-'
            },
            showData:false,
            noData:false,
            // isShow:false,
          }
      },
      mounted () {
        //第一次加载
        this.getNewsList(true);
        this.$nextTick(() => {
          this.$refs.scroller.reset({top:0})
        })
      },
      methods:{
        getNewsList(isEmpty,refresh){
               let that=this;
               let params={ limit_end:String(that.endItem),limit_start:String(that.startItem),timeStamp:formatDateTime(new Date()),user_id:String(that.user_id) };
              request.getList(params).then(({ data }) => {
                let result=data.data;
                that.showData=true;
                that.noData=false;
                    if (isEmpty) {
                      that.list = [];
                      if(refresh==1){
                        this.$refs.scroller.enablePullup();
                        this.$refs.scroller.donePulldown();
                      }

                    } else {
                      //isEmpty为false时，也就是向上滚动刷新selPullUp ()方法被被调用的时候
                      if (result && result.length === 0) {
                        this.$refs.scroller.disablePullup();
                        that.showData=false;
                        that.noData=true;
                        return
                      }

                    }
                    result.forEach(function (item, index) {
                      that.list.push(item)
                    });
                   // that.isShow = true;
                   if (!isEmpty) {
                     this.$refs.scroller.donePullup();
                         that.$nextTick(() => {
                           that.$refs.scroller.reset({top:0})
                         })
                    }

              })
           },
        selPullUp () {
          // 上拉加载更多
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
      created () {
        this.$refs.scroller.reset({top:0})
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
   .index{
     width: 100%;
     height: 100%;
     background: #fff;
     .listItem{
       margin: 10px auto ;
       width: 90%;
       height: 60px;
       border: 1px solid #00eb63;
     }
   }
</style>

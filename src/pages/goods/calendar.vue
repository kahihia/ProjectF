<template>
  <div id="calendar">
    <head_bar :backLast="true" :tab_c="true"
              :head="head" :bg_color="bg_color">
    </head_bar>
    <inline-calendar
      ref="calendar"
      class="inline-calendar-demo"
      v-model="value"
      :start-date="timeStamp"
      :disable-past="true"
      :showLastMonth="false"
      :showNextMonth="false"
      :weeks-list="weeksList"
      :disable-date-function="disableDateFunction"
      @on-change="onChange"
    >
    </inline-calendar>
  </div>
</template>

<script>
  import {InlineCalendar} from 'vux'
  import head_bar from '@/components/head_bar'
  import {formatDate} from '@/utils/format';
    export default {
      name: "calendar",
      components:{InlineCalendar,head_bar},
      data(){
        return{
          head:'日历选择',
          bg_color:'#f4f3f0',
          value:'',
          weeksList:[],
          timeStamp:formatDate(new Date()),//时间戳
          available_time:JSON.parse(this.$route.query.available_time),
          start_time:new Date(this.$route.query.start_time.replace(/-/g, '/')).getTime(),
          end_time:new Date(this.$route.query.end_time.replace(/-/g, '/')).getTime(),
          goods_id: this.$route.query.good_id,//商品id
          now_time:new Date().getTime()
        }
      },
      methods:{
        disableDateFunction(date){
          let time_s=new Date(date.formatedDate.replace(/-/g, '/')).getTime();
          for(let i=0;i<this.available_time.length;i++){
            if(this.available_time[i]===7)this.available_time[i]=0;
            if(this.available_time[i]===date.weekDay&&
              this.end_time>=time_s&&
              this.start_time<time_s){
              return false
            }
          }
          return true
        },
        onChange(val){
          let that = this;
          let weekDay=that.formatWeek(val);
          this.$router.push({
            path:'/goodsdetail',
            query:{
              good_id:that.goods_id,
              date:val,
              weekDay:weekDay
            }
          })
        }
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
#calendar{
  padding-top: 90px;
  font-size: 26px;
}
</style>
<style lang="less">
  .inline-calendar{
    tr{
      td{
        font-size: 26px;
        span.vux-calendar-each-date{
          width: 45px;
          height: 45px;
          line-height: 44px;
        }
      }
    }
  }
</style>

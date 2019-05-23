<template>
  <div id="newMap">
    <head_bar  :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
    <div class="top_container">
      <AMap_comp @getNearby="getNearby" :showSearch="true"></AMap_comp>
    </div>
    <div class="underMapBox">
      <ul class="under_ul">
        <li class="under_item" v-for="(item,index) in NearbyData" @click="showNearby(index)">
          <div class="under_icon"><img :src="item.imgSrc"></div>
          <div class="under_right">
            <div class="under_title">{{ item.name}}</div>
            <div class="under_description">{{ item.pname }}{{ item.cityname }}{{ item.address}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import AMap_comp from './AMap_comp'
  import XButton from 'vux/src/components/x-button/index'
  import {getLocalData} from '@/utils/storages'
  import head_bar from './head_bar';
  export default {
    name:'MapComponent',
    components:{
      XButton,
      AMap_comp,
      head_bar
    },
    data () {
      return {
        tab_c:true,
        back_last:true,
        head:'地址',
        bg_color:'#f4f3f0',
        loading:false,
        queryInput:'',
        searchData:[],
        lnglatXY:[],
        NearbyData:[],
        icon_show:0,
      }
    },
    props:['log'],
    methods:{
      getNearby(data){
        this.NearbyData=data;
      },
      showNearby(index){
        var that = this;
        var lng = that.NearbyData[index].location.lng;
        var lat = that.NearbyData[index].location.lat;
        var address = that.NearbyData[index].name;
        var lnglatXY = [lng,lat];
        let last_path = that.$route.query.last_path;
        let merchants_id = that.$route.query.merchants_id;
        this.$router.push({
          path:last_path,
          query:{
            categoryId:that.$route.query.categoryId,
            // merchants_id:merchants_id,
            lnglatXY:lnglatXY,
            address:address,
          }
        })
      },
    },
    activated () {
      let that = this;
      let position = getLocalData('position').position;//获取本地位置信息
      let lnglatXY = [position.lng,position.lat];
      that.lnglatXY = lnglatXY;
      this.$store.commit('updateBottomNav', {showBottomNav: false});
    },
    deactivated(){
      this.$store.commit('updateBottomNav', {showBottomNav: true});
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/less/reset";
  #newMap{
    height: 100%;
    .top_container{
      height: 55%;
    }
    .underMapBox{
      width: 100%;
      height: 45%;
      overflow-y: scroll;
      .under_ul{
        font-size: 24px;
      }
    }
  }
</style>
<style lang="less">
  .mapHead{
    .icon_position{
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>

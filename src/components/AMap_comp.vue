<template>
  <div id="AMap_comp">
    <div id="searchBox" v-show="showSearch">
      <input id="tipinput" type="text" ref="searchText" v-model="queryInput" @keyup="keyUpSearch" placeholder="请输入关键字搜索"/>
      <div id="clearSearchBtn">
        <div class="del" @click="clearInput">&#10005;</div>
      </div>
    </div>
    <!--结果面板-->
    <ul class="address_items" id="address_result" v-if="searchData.length > 0">
      <li class="address_item" v-for="(item,index) in searchData" @click="showPosition(index)">
        <div class="PTitle">{{ item.name }}</div>
        <div class="description">{{ item.pname }}{{ item.cityname }}{{ item.address }}</div>
      </li>
    </ul>
    <div id="container"></div>
    <div id="temp" style="display:none"></div>
    <div id="panel" style="display:none"></div>
  </div>
</template>

<script>
  let map,Marker,geocoder,loc_Mark;
  import AMap from '@/utils/AMap'
  import {getLocalPosition} from '@/utils/storages'
  let placeSearch;
    export default {
      name: "AMap_comp",
      props:['showSearch',],
      data(){
        return{
          AMap:'',
          searchData:[],
          lnglatXY:[],
          NearbyData:[],
          icon_show:0,
          queryInput:'',
        }
      },
      created(){
         this.$nextTick(()=>{
           AMap.init().then((AMap) => {
             this.AMap=AMap;
             this.initMap(AMap)
           });
         })
      },
      methods:{
        initMap (AMap) {
          var loc_position = getLocalPosition('position');
          var lnglatXY=[loc_position.lng,loc_position.lat];
          this.setMap(AMap,lnglatXY); //创建地图
          // this.location(AMap);//定位
        },
        setMap(AMap,lnglatXY,address){
          var _self = this;
          map = new AMap.Map('container', {
            zoom:18,
            size: new AMap.Size(35, 35),
            resizeEnable: true,
            center:lnglatXY,
            mapStyle: "amap://styles/whitesmoke",
          });
          if(address) {
            _self.searchData = [];
          }
          this.moveEvent(AMap,lnglatXY);
          this.searchNearby(AMap,lnglatXY);
        },
        searchNearby(AMap,lnglatXY){
          var _self = this;
          AMap.service(["AMap.PlaceSearch"], function() {
            _self.PlaceSearch(AMap,'panel');
            placeSearch.searchNearBy('', lnglatXY, 200, function (status, result) {
              _self.NearbyData = result.poiList.pois;
              _self.$emit('getNearby',result.poiList.pois);
              // _self.NearbyData.imgSrc=''
              // _self.NearbyData.map((val,key)=>{
              //   _self.NearbyData[key].imgSrc=require('./images/no_position.png')
              // });
              // _self.NearbyData[0].imgSrc=require('./images/act_position.png');
            });
          })
        },
        PlaceSearch(AMap,name){
          placeSearch = new AMap.PlaceSearch({
            //构造地点查询类
            pageSize: 10,
            pageIndex: 1,
            city: "成都",//城市
            cityLimit: 'true',
            panel: name
            // 搜索结果的展示面板对元素id，不知道为什么一定要有该参数，最终获取的结果才更完整
          });
        },
        markerInit(AMap){
          // 初始化标记
          Marker = new AMap.Marker({
            position: map.getCenter(),
            animation: 'AMAP_ANIMATION_DROP',
            icon:require('../assets/images/icon_map/icon_location.png')
          });
          Marker.setMap(map);
        },
        moveEvent(AMap,lnglatXY){
          var that = this;
          AMap.event.addListener(map, 'dragging', function() {
            Marker.setPosition(map.getCenter());
          });
          AMap.event.addListener(map, 'dragend', function() { // 停止移动
            // 利用地图地理编码查询地址
            //实例化Geocoder
            AMap.service('AMap.Geocoder', function() { //回调函数
              //实例化Geocoder
              geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              //TODO: 使用geocoder 对象完成相关功能
            });
            geocoder.getAddress(map.getCenter(), function(status, data) {
              if (status === 'complete' && data.info === 'OK') {
                //获得了有效的地址信息:即
                var position = {
                  Lat:map.getCenter().getLat(),
                  Lng:map.getCenter().getLng()
                };
                var lnglatXY = [map.getCenter().getLng(),map.getCenter().getLat()];
                that.searchNearby(AMap,lnglatXY);
                var addressArr = [];
                addressArr.push(data.regeocode.formattedAddress.split("市"));
                // that.getAdd(position,addressArr[0][1])
              } else {
                //获取地址失败
                switch (data.info) {
                  case 'INVALID_UESR_KEY':
                    break;
                  case 'SERVICE_UNAVAILABLE':
                    break;
                  case 'INSUFFICIENT_PRIVILEGES':
                    break;
                  case 'INVALID_PARAMS':
                    break;
                  default:
                    break;
                }
              }
            });
            if(Marker){
              Marker.setPosition(map.getCenter());
              // Marker.setAnimation('AMAP_ANIMATION_DROP')
            }
          });
          that.regeocoder(AMap,lnglatXY);
          that.searchNearby(AMap,lnglatXY);
        },
        regeocoder(AMap,lnglatXY,address) {  //逆地理编码
          var that = this;
          AMap.service('AMap.Geocoder', function() { //回调函数
            //实例化Geocoder
            geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            //TODO: 使用geocoder 对象完成相关功能
          });
          geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              var position = {
                Lng:lnglatXY[0],
                Lat:lnglatXY[1]
              };
              var addressArr = [];
              addressArr.push(result.regeocode.formattedAddress.split("市"));
              // that.getAdd(position,addressArr[0][1]);
              that.geocoder_CallBack(AMap,result);
            }
          });
          if(address){
            var _position = {
              lng:lnglatXY[0],
              lat:lnglatXY[1]
            };
            that.getAdd(_position,address);
          }
          // 把标记加入地图实例
          // Marker.setMap(map);
          map.setFitView();
        },
        geocoder_CallBack(AMap,data) {
          var that = this;
          var address = data.regeocode.formattedAddress; //返回地址描述
          that.markerInit(AMap);
        },
        clearInput(){ //清空搜索
          var that = this;
          that.queryInput='';
          that.searchData = [];
        },
        //搜索
        keyUpSearch () {
          var that = this;
          this.AMap.service(["AMap.PlaceSearch"], function() {
            //关键字查询
            that.PlaceSearch(that.AMap,'temp');
            that.searchKeyWord()
          })
        },
        searchKeyWord(){
          var that = this;
          var txt = this.$refs.searchText.value;
          placeSearch.search(txt, function(status, result) {
            if (status == 'complete' && result.info == 'OK') {
              //这里可以console.log(result)，查看所有返回的参数
              that.searchData = result.poiList.pois;
            }
            if(that.queryInput==''||that.queryInput==null){
              that.searchData = []
            }
          })
        },
        //搜索后定位
        showPosition(index){
          var that = this;
          var lat = that.searchData[index].location.lat;
          var lng = that.searchData[index].location.lng;
          var address = that.searchData[index].name;
          var lnglatXY = [lng,lat];
          that.setMap(this.AMap,lnglatXY,address);
        },
      }
    }
</script>

<style lang="less" scoped>
  @import "../assets/less/reset";
  #AMap_comp{
    height: 100%;
    position: relative;
    padding-top: 90px;
    #searchBox {
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      z-index: 10001;
      height: 50px;
      #tipinput {
        width: 100%;
        height: 50px;
        border: none;
        border-radius: 5px;
        font-size: 24px;
        line-height: 50px;
        padding: 0 7px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.38);
        color: @G1;
        outline: none;
        　&::-webkit-input-placeholder {
          color: @G1;
          font-size: 24px;
          letter-spacing: 2px;
        }
      }
      #clearSearchBtn {
        position: absolute;
        right: 0;
        top: 0;
        margin: auto;
        width: 50px;
        height: 50px;
        padding: 10px;
        text-align: center;
        vertical-align: middle;
        font-size: 24px;
        color: #ddd;
        box-sizing: border-box;
        #clearSearchBtn .del {
          background: #eee;
          border-radius: 12px;
          width: 100%;
          height: 100%;
        }
      }
    }
    #address_result{
      position: absolute;
      top: 140px;
      z-index: 10000;
      background-color: #fff;
      font-size: 14px;
      width: 100%;
      height: 70%;
      padding: 0;
      list-style: none;
      overflow: scroll;
      .address_item{
        width: 90%;
        margin: 0 auto;
        padding: 5px;
        border-bottom: 1px solid #ddd;
      }
    }
    #container{
      height: 100%;
    }
  }
</style>
<style lang="less">
  .amap-logo {
    display: none;
  }
  .amap-copyright {
    bottom:-100px;
    display: none;
  }
  .amap-icon{
    /*position: relative;*/
    /*display: block;*/
    /*width: 126px;*/
    /*height: 126px;*/
    /*text-align: center;*/
    /*border-radius: 50%;*/
    /*background-color: rgba(255, 243, 174, .6);*/
    /*animation: mymove 1.5s infinite;*/
    img{
      /*position: absolute;*/
      /*top: 50% !important;*/
      /*left: 50% !important;*/
      /*transform: translate(-50%, -50%);*/
    }
  }
  @keyframes mymove {
    0% {
      box-shadow: 0 0 0 2px rgba(255, 243, 174, .6);
      height: 71px;
      width: 71px;
    }
    50%{
      box-shadow: 0 0 0 20px rgba(255, 243, 174);
      opacity: .6;
      filter: alpha(opacity=1);
      height: 72px;
      width: 72px;
    }
    100% {
      box-shadow: 0 0 0 2px rgba(255, 243, 174, .6);
      height: 71px;
      width: 71px;
    }
    100% {
      /*opacity: 0;*/
      /*filter: alpha(opacity=0);*/
    }
  }
</style>

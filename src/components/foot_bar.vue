<template>
    <div class="foot">
      <!--用户端tabbar-->
      <tabbar v-if="!$store.state.tabbar.is_merchant" v-model="$store.state.tabbar.tab_index">
        <tabbar-item v-for="(item,index) in Tabbar_user" :show-dot="item.show_dot" :badge="item.badge" :key="index" :link=item.path>
          <img slot="icon" :src="item.tab_img">
          <img slot="icon-active" :src="item.tab_img">
          <div slot="icon-active" class="active_show"></div>
          <span slot="label">{{item.tab_label}}</span>
        </tabbar-item>
      </tabbar>
      <!--商户端tabbar-->
      <tabbar v-else v-model="$store.state.tabbar.tab_index">
        <tabbar-item v-for="(item,index) in Tabbar_shop" :show-dot="item.show_dot" :badge="item.badge" :key="index" :link=item.path>
          <img slot="icon" :src="item.tab_img">
          <img slot="icon-active" :src="item.tab_img">
          <div slot="icon-active" class="active_show"></div>
          <span slot="label">{{item.tab_label}}</span>
        </tabbar-item>
      </tabbar>
    </div>
</template>

<script>
  import { Tabbar,Badge,TabbarItem } from 'vux'
    export default {
      name: "foot_bar",
      data(){
        return{
          tab_index:0,
          Tabbar_user:[
            {tab_img:require('./../assets/images/footer_icon/icon_home.png'),tab_label:'首页',path:'/'},
            {tab_img:require('./../assets/images/footer_icon/icon_location.png'),tab_label:'附近',show_dot:true,path:'/Nearby'},
            {tab_img:require('./../assets/images/footer_icon/icon_msg.png'),tab_label:'聊天',path:'/chat'},
            {tab_img:require('./../assets/images/footer_icon/setting.png'),tab_label:'设置',path:'/options'},
            ],//用户端tab
          Tabbar_shop:[
            {tab_img:require('./../assets/images/footer_icon/icon_shop.png'),tab_label:'商铺',path:'/merchantHome'},
            {tab_img:require('./../assets/images/footer_icon/icon_goods.png'),tab_label:'商品',show_dot:true,path:'/merchantGoods'},
            {tab_img:require('./../assets/images/footer_icon/icon_msg.png'),tab_label:'聊天',show_dot:true,path:'/chat'},
            {tab_img:require('./../assets/images/footer_icon/setting.png'),tab_label:'设置',path:'/merchantOpt'},
            ],//用户端tab
        }
      },
      components: {
        Tabbar,
        TabbarItem,
        Badge
      },
    }
</script>

<style lang="less" scoped>

</style>
<style lang="less">
  @tabbar-text-active-color:#252525;
  .foot{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .weui-tabbar{
      font-size: 12px;
      .weui-tabbar__item{
        box-sizing: border-box;
        padding-top: 15px;
        text-decoration: none;
        overflow: hidden;
        z-index: 2;
        .weui-tabbar__icon{
          position: relative;
          width: 40px;
          height: 40px;
          img{
            position: absolute;
            left: 0;
            z-index: 2;
          }
          .active_show{
            position: absolute;
            left: 6px;
            top: 19px;
            z-index: 1;
            width: 39px;
            height: 25px;
            background-color: #ffe035;
          }
        }
      }
      .weui-tabbar__label{
        font-size: 16px;
        color:@tabbar-text-active-color;
        line-height: 36px;
      }
      .weui-bar__item_on{
        position: relative;
        z-index: 4;
        &:before {
          content: "";
          display: block;
          position: absolute;
          z-index: 3;
          width: 100%;
          height: 90px;
          pointer-events: none;
          //设置径向渐变
          background-image: radial-gradient(circle,#666 10%, transparent 10.01%);
          background-repeat: no-repeat;
          background-position: 50%;
          transform: scale(10, 10);
          opacity: 0;
          transition: transform .7s, opacity .7s;
        }
        &:active:before {
          transform: scale(0, 0);
          opacity: .3;
          //设置初始状态
          transition: 0s;
        }
        .weui-tabbar__label{
          color:@tabbar-text-active-color;
        }
      }
    }
  }
</style>

<template>
  <div id="chatIn">
    <head_bar :headTitle="head_title" :tab_e="tab_e"></head_bar>
    <div class="chatMsg" id="chatMsg">
      <!--聊天开始-->
      <div class="briefGoodInfo mixin-centerLeft" v-show="good_info">
        <div class="goodImgBox"><img class="mixin-img" :src="imgUrl(good_info.goods_img)"/></div>
        <div class="good_info">
          <div class="top_block">
            <div class="top_left_goodInfo">
              <div class="good_name t-b-b">{{good_info.merchants_goods_name}}</div>
              <div class="time_slot c-a">{{good_info.merchants_goods_inputtime}}至<br>{{good_info.merchants_goods_end_time}}</div>
            </div>
            <div class="top_right_btn c-h">send to chat</div>
          </div>
          <div class="price_block">
            <div>
              <span class="t-b">
                ￥<em class="c-Ba">{{good_info.merchants_goods_discount_price}}</em>
              </span>
              <em class="p-original">原价 ￥{{good_info.merchants_goods_price}}</em>
            </div>
            <div class="c-b">已售{{good_info.merchants_goods_sold}}</div>
          </div>
        </div>
      </div>
      <ul id="chatBox" :class="good_id?'paddingT':''" ref="chatBox">
        <li class="session_block" v-for="(item,index) in chatHistory">
          <div v-if="item.from == chat_data.to_username" class="left_session session">
            <em class="time c-f">{{item.time}}</em>
            <div class="session_item">
              <div class="img_box"><img :src="item.from_img" class="head_img mixin-img"></div>
              <div class="item_msg c-a">{{item.sourceMsg}}</div>
            </div>
          </div>
          <div v-if="item.from == chat_data.from_username" class="right_session session">
            <em class="time c-f">{{item.time}}</em>
            <div class="session_item">
              <div class="item_msg c-a">{{item.sourceMsg}}</div>
              <div class="img_box"><img :src="item.from_img" class="head_img mixin-img"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--底部输入-->
    <div class="foot_input">
      <div class="input">
        <input type="text" v-model="chat_data.textMsg">
      </div>
      <div class="btn">
        <button @click="sendText">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {setLocalData,getLocalData} from '@/utils/storages'
  import {nowTime,formatDateTime} from '@/utils/format'
  import request from '@/utils/request';
  import { mapState,mapActions } from 'vuex'
  export default {
    name: "chatIn",
    components: {
      head_bar
    },
    data() {
      return {
        head_title: this.$route.query.to_nickname,
        tab_e: true,
        nowTime:new Date(),
        user_info:getLocalData('user_info'),//用户信息
        chatHistory:[],//聊天记录
        good_id:null,//商品id
        good_info: '',//商品详情
        timeStamp:formatDateTime(new Date()),//时间戳
        chat_data:{},//消息列表
        coverMessage:{}//存储消息列表
      }
    },
    watch:{
      chatHistory:'scroller',
    },
    computed:{
      ...mapState({
        JIM: state => state.chat.JIM,
      })
    },
    methods:{
      /**
       *获取scrollTop的值，兼容所有浏览器
       */
      getScrollTop() {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        return scrollTop;
      },
       // 设置scrollTop的值
      setScrollTop(scroll_top) {
        document.documentElement.scrollTop = scroll_top;
        window.pageYOffset = scroll_top;
        document.body.scrollTop = scroll_top;
      },
      // 滚动到底部
      scroller(){
        this.$nextTick(()=>{
          // let offsetTop = chatBox.scrollHeight;
          var chatBox=document.querySelector("#chatBox");
          // var chatMsg=document.querySelector("#chatMsg");
          var bodyHeight=chatBox.scrollHeight;
          this.setScrollTop(bodyHeight);
          chatBox.scrollTop=bodyHeight;
          window.scrollTo(0,bodyHeight);
          // chatMsg.scrollTop=bodyHeight;
        })
      },
      // 存储会话列表
      conversations(coverMessage){
        let that = this;
        let conversations=getLocalData('conversations');
        if(!!conversations){
          conversations.coverData[coverMessage.to_username] = [coverMessage];
          // setLocalData('conversations',conversations);
          that.$store.commit('saveConversations',{conversations:conversations})
        }else {
          let coverData={};
          coverData[coverMessage.to_username]=[coverMessage];
          // setLocalData('conversations',{coverData});
          that.$store.commit('saveConversations',{conversations:{coverData}})
        }
      },
      // 从localstroage获取聊天历史记录
      getQuery(){
        var that = this;
        that.chat_data={
          from_username:that.user_info.phone,//发起者用户名
          to_username:that.$route.query.to_username,//接收者用户名
          to_nickname:that.$route.query.to_nickname,//接收者昵称
          to_img:that.imgUrl(that.$route.query.urlImg),//接收者头像
          from_img:that.imgUrl(that.user_info.head_img),//发送者头像
        };
        that.good_id=that.$route.query.good_id;
        that.good_id?this.getGoodsInfo():false
      },
      getChatListDataFromLocal () {//获取聊天消息
        let chatData = getLocalData('chatData');
        if (chatData) {
          var currentChatData = chatData.chatHistoryData[this.chat_data.to_username];
          if (currentChatData) {
            this.chatHistory.push(...currentChatData);
          }
        }
      },
      // 发送文本
      sendText(){
        let that=this;
        if (!that.chat_data.textMsg) return;
        let sendTime = nowTime();
        let to_username=that.chat_data.to_username;
        // that.receiveNickName=that.to_nickname;
        // 发送消息
        that.JIM.sendSingleMsg({
          'target_username' : to_username,
          'target_nickname' : that.chat_data.to_nickname,
          'content' :that.chat_data.textMsg,
          'appkey': that.jgAppKey,
          'no_notification':false,
        }).onSuccess(function(data) {
          let coverMessage={
            to_username:that.chat_data.to_username,//接收者用户名
            to_nickname:that.chat_data.to_nickname,
            to_img:that.chat_data.to_img,
            sourceMsg:that.chat_data.textMsg,
          };
          // that.setConversations(coverMessage);
          let sendMessage = {
            from: that.chat_data.from_username,
            sourceMsg: that.chat_data.textMsg,
            time: sendTime,
            from_img:that.chat_data.from_img,
            to_img:that.chat_data.to_img
          };
          let chatData=getLocalData('chatData');
          if(!!chatData){
            if (!!chatData.chatHistoryData[to_username]) {
              chatData.chatHistoryData[to_username].push(sendMessage);
            } else {
              chatData.chatHistoryData[to_username] = [sendMessage]
            }
            setLocalData('chatData',chatData);
          }else {
            var chatHistoryData={};
            chatHistoryData[to_username]=[sendMessage];
            setLocalData('chatData',{chatHistoryData});
          }
          that.chatHistory.push(sendMessage);
          that.chat_data.textMsg='';
        }).onFail(function(data) {
        });
      },
      // 接受文本消息
      receiveTextMsg(){
        let that=this;
        let sendTime = nowTime();
        that.JIM.onMsgReceive(function(data) {
          that.coverMessage.to_username=data.messages[0].content.from_name;
          that.coverMessage.to_img=data.messages[0].content.msg_body.extras.from_img;
          that.coverMessage.to_nickname=data.messages[0].content.target_name;
          let converMsg = {
            to_username:data.messages[0].content.from_name,
            to_img:data.messages[0].content.msg_body.extras.from_img,
            receiveNickName:data.messages[0].content.target_name,
            to_nickname:data.messages[0].content.msg_body.extras.my_name,
            sourceMsg: data.messages[0].content.msg_body.text,
            unRead:true,
          };
          // that.setConversations(converMsg);
          let receiveMessage = {
            from: data.messages[0].content.from_name,
            sourceMsg: data.messages[0].content.msg_body.text,
            time: sendTime,
            from_img: data.messages[0].content.msg_body.extras.from_img,
            to_img:data.messages[0].content.msg_body.extras.to_img,
          };
          let chatData=getLocalData('chatData');
          if(!!chatData){
            if (!!chatData.chatHistoryData[converMsg.to_username]) {
              chatData.chatHistoryData[converMsg.to_username].push(receiveMessage);
            } else {
              chatData.chatHistoryData[converMsg.to_username] = [receiveMessage]
            }
            setLocalData('chatData',chatData);
          }else {
            let chatHistoryData={};
            chatHistoryData[converMsg.to_username]=[receiveMessage];
            setLocalData('chatData',{chatHistoryData});
          }
          that.chatHistory.push(receiveMessage)
        });
        // 离线同步监听
        that.JIM.onSyncConversation(function(data) {
          that.coverMessage.to_username=data[0].from_username;
          that.coverMessage.to_img=data[0].msgs[0].content.msg_body.extras.from_img;
          that.coverMessage.to_nickname=data[0].msgs[0].content.target_name;
          let converMsg = {
            to_username:data[0].from_username,
            to_img:data[0].msgs[0].content.msg_body.extras.from_img,
            receiveNickName:data[0].msgs[0].content.target_name,
            to_nickname:data[0].msgs[0].content.msg_body.extras.my_name,
            sourceMsg: data[0].msgs[0].content.msg_body.text,
            unRead:true,
          };
          // that.setConversations(converMsg);
          let receiveMessage = {
            from: data[0].msgs[0].content.from_name,
            sourceMsg: data[0].msgs[0].content.msg_body.text,
            time: sendTime,
            from_img: data[0].msgs[0].content.msg_body.extras.from_img,
            to_img:data[0].msgs[0].content.msg_body.extras.to_img,
          };
          let chatData=getLocalData('chatData');
          if(!!chatData){
            if (!!chatData.chatHistoryData[converMsg.to_username]) {
              chatData.chatHistoryData[converMsg.to_username].push(receiveMessage);
            } else {
              chatData.chatHistoryData[converMsg.to_username] = [receiveMessage]
            }
            setLocalData('chatData',chatData);
          }else {
            let chatHistoryData={};
            chatHistoryData[converMsg.to_username]=[receiveMessage];
            setLocalData('chatData',{chatHistoryData});
          }
          that.chatHistory.push(receiveMessage)
        });
      },
      // 获取商品详情
      getGoodsInfo() {
        let that = this;
        let params = {
          goods_id: that.good_id,
          user_id: that.user_info.id,
          timeStamp: formatDateTime(new Date()),
        };
        request.getGoodsInfo(params).then(res => {
          var good_info = res.data.data;
          good_info.merchants_goods_img?good_info.goods_img=good_info.merchants_goods_img.split(',')[0]:false;
          that.good_info=good_info;
        })
      },
    },
    mounted() {
      this.getQuery();
      this.scroller();
      this.getChatListDataFromLocal();
      this.receiveTextMsg();
      this.$store.commit('updateBottomNav', {showBottomNav: false});
    },
    destroyed() {
      this.$store.commit('updateBottomNav', {showBottomNav: true})
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .paddingT{padding-top: 166px;}
  #chatIn {
    padding-bottom: 120px;
    .chatMsg {
      padding-top: 100px;
      position: relative;
      .briefGoodInfo {
        position: fixed;
        z-index: 1;
        width: 689px;
        margin: 0 auto;
        display: flex;
        padding: 28px 20px;
        background-color: #ffffff;
        box-shadow: 0 0 15px 0 rgba(0, 1, 1, 0.05);
        border-radius: 12px;
        .goodImgBox {
          width: 110px;
          height: 110px;
        }
        .good_info {
          padding-left: 15px;
          flex: 1;
          .top_block {
            display: flex;
            justify-content: space-between;
            .top_right_btn {
              width: 174px;
              height: 54px;
              line-height: 54px;
              text-align: center;
              background-color: #ffd733;
              border-radius: 6px;
            }
          }
          .price_block {
            display: flex;
            justify-content: space-between;
            span {
              position: relative;
              em {
                background: linear-gradient(to bottom, #fff 0%, #fff 28%, @Y2 30%, @Y2 100%);
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
      #chatBox{
        .session_block {
          .session {
            padding: 0 30px;
            .time {
              display: block;
              text-align: center;
              padding: 25px 0 13px 0;
            }
            .session_item {
              display: flex;
              align-items: center;
              .img_box {
                width: 70px;
                height: 70px;
                .mixin-borderRadius(50%);
                overflow: hidden;
              }
              .item_msg {
                position: relative;
                padding: 26px 30px;
                background-color: @log_bg;
                border: solid 1px @border_b;
                box-shadow: 0 0 15px 0 rgba(0, 1, 1, 0.05);
                .mixin-borderRadius(12px);
              }
            }
          }
          .left_session {
            .session_item {
              justify-content: flex-start;
              .img_box {
                margin-right: 20px;
              }
              .item_msg {
                &:before {
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  content: "";
                  width: 0;
                  height: 0;
                  right: 99%;
                  border-top: 15px solid transparent;
                  border-right: 15px solid @log_bg;
                  border-bottom: 15px solid transparent;
                }
              }
            }
          }
          .right_session {
            .session_item {
              justify-content: flex-end;
              .img_box {
                margin-left: 42px;
              }
              .item_msg {
                &:before {
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  content: "";
                  width: 0;
                  height: 0;
                  left: 99%;
                  border-top: 15px solid transparent;
                  border-left: 15px solid @log_bg;
                  border-bottom: 15px solid transparent;
                }
              }
            }
          }
        }
      }
    }
    .foot_input{
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      background-color: @bg-a;
      padding: 20px 30px;
      box-sizing: border-box;
      .input{
        width: 80%;
        height: 60px;
        margin-right: 5%;
        input{
          display: inline-block;
          outline: none;
          border: none;
          width: 100%;
          height: 100%;
          font-size: 24px;
          .mixin-borderRadius(12px)
        }
      }
      .btn{
        width: 15%;
        height: 50px;
        button{
          font-size: 20px;
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background-color: @sign_bg;
          .mixin-borderRadius(6px);
        }
      }
    }
  }
</style>

import {setLocalData,getLocalData} from "../../utils/storages";
require('@/assets/js/Webim/jmessage-sdk-web.2.6.0.min');
import request from '../../utils/request'
import {formatDateTime} from '@/utils/format';
import {getBase64Image,dataURLtoBlob,imgUrl,reducerDate} from '@/utils/utils';
let user_info=getLocalData('user_info');
let JIM=new JMessage();
let jgAppKey='';
const state = {
  JIM: null,
  conversation: getLocalData('conversation'),    // 接收到的消息列表
  messageList: [],       // 消息列表，最终用于聊天气泡渲染
};
const getters = {
  JIM: state => state.JIM,
  conversation: state => state.conversation,
  messageList: state => state.messageList
};
const mutations = {
  set_jim (state, JIM) {
    state.JIM = JIM
  },
  set_chat_conversation(state, conversation) {
    setLocalData('conversation',conversation.conversation);
    state.conversation = conversation.conversation
  },
  set_chat_msg_list(state, messageList) {
    state.messageList = messageList
  },
};
const actions={
  initJIM ({ commit,state }) {
    let params={
      timeStamp:formatDateTime(new Date())
    };
    // 获取极光签名
    request.getJgSign(params).then(res => {
      jgAppKey=res.data.data.appkey;
      // 初始化极光
      JIM.init({
        "appkey": res.data.data.appkey,
        "random_str": res.data.data.random_str,
        "signature": res.data.data.signature,
        "timestamp": res.data.data.timestamp,
        "flag": 1
      }).onSuccess(function (res) {
        if(user_info && !JIM.isLogin()){
          // 登录
          JIM.login({
            username: user_info.phone,
            password: user_info.phone,
          }).onFail( (arg)=> {
            if (arg.code === 880103) {
              // 注册用户，把之前已经有的项目用户数据和极光IM用户数据同步
              JIM.register({
                username: user_info.phone,
                password: user_info.phone,
              }).onSuccess(function () {
                JIM.updateSelfInfo({
                  nickname:user_info.user_name
                }).onSuccess(function(data) {
                  //data.code 返回码
                  //data.message 描述
                }).onFail(function(data) {
                  //同上
                });
              })
            }
            // reject(arg)
          }).onSuccess((res)=> {
            commit('set_jim', JIM);
            getJIMUserInfo().then(res=>{
              if(!res.user_info.nickname){
                updateSelfInfo(user_info.user_name)
              }
              if(!res.user_info.avatar){
                updateSelfAvatar(user_info.head_img)
              }
            });
          })
        }
      }).onFail( (error)=> {
      });
    })
  },
  onMsgReceive({commit,state}){
    JIM.onMsgReceive((data)=> {
      getConversations().then(res=>{
        let converMsg = {};
        res.map((val,key)=>{
          if(val.username===data.messages[0].from_username){
            let urlObj={'media_id':val.avatar};
            JIM.getResource(urlObj).onSuccess(source=> {
              val.avatar_url=source.url;
              converMsg = {
                to_username:data.messages[0].from_username,
                to_img:val.avatar_url,
                my_name:data.messages[0].content.target_name,
                to_nickname:data.messages[0].content.from_name,
                sourceMsg: data.messages[0].content.msg_body.text,
                unRead:true,
              };
              let conversation=getLocalData('conversation');
              if(!!conversation){
                conversation.coverData[converMsg.to_username] = [converMsg];
                commit('set_chat_conversation',{conversation:conversation})
              }else {
                let coverData={};
                coverData[converMsg.to_username]=[converMsg];
                commit('set_chat_conversation',{conversation:{coverData}})
              }
            });
          }
        });
      });
    });
  },
};
// 修改个人头像
function updateSelfAvatar(head_img) {
  let img = imgUrl(head_img);
  let image = new Image();
  image.src = img;
  image.onload = function() {
    //这样就获取到了文件的Base64字符串
    let base64 = getBase64Image(image);
    //Base64字符串转二进制
    let blob = dataURLtoBlob(base64);
    let canvas = document.createElement('canvas');
    let dataURL = canvas.toDataURL('image/jpeg', 0.5);
    let fd = new FormData(document.forms[0]);
    fd.append("image", blob, 'image.png');
    JIM.updateSelfAvatar({
      'avatar' : fd
    }).onSuccess(function(data) {
    }).onFail(function(data) {
    });
  }
}
// 获取极光个人信息
function getJIMUserInfo() {
  return new Promise((resolve, reject) => {
    JIM.getUserInfo({
      'username' : user_info.phone,
      'appkey' : jgAppKey
    }).onSuccess(function(data) {
      resolve(data)
    }).onFail(function(data) {
      reject(data.message)
    });
  })
}
//修改个人信息
function updateSelfInfo(user_name) {
  JIM.updateSelfInfo({
    nickname:user_name
  }).onSuccess(function(data) {
    //data.code 返回码
    //data.message 描述
  }).onFail(function(data) {
    //同上
  });
}
function getConversations() {
  return new Promise((resolve, reject) => {
    JIM.getConversation().onSuccess((res)=> {
      resolve(res.conversations)
    });
  })
}
export default{
  state,
  getters,
  actions,
  mutations
}

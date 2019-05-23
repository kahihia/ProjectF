import request from '../../utils/request'
import {formatDateTime} from '@/utils/format';
import {setLocalData,getLocalData} from '@/utils/storages';
import {nowTime} from '@/utils/format';
import {wxShare,wxConfig} from '@/utils/wxInit';
let user_info = getLocalData('user_info');
export default {
  install(Vue,options){
    Vue.prototype.imgUrl=function (url){//图片处理
      if(url){
        if(url.slice(0,5)=="http:"){
          let newUrlArr=url.split(":");
          let newUrl = newUrlArr[0]+"s:"+newUrlArr[1];
          return newUrl
        }
        if(url.slice(0,5) == 'https'||url.slice(0,3)=="../ ")
        {return url;}else{return this.$newHttpsSrc+url;}
      }
    };
    Vue.prototype.isPlus=function (str){//图片处理
      let num = Number(str);
      if (num > 0) {
        return true;
      }else {
        return false
      }
    };
    Vue.prototype.deleteStr=function (obj){//删除!属性
      let newObj=obj;
      for (let key in newObj){
        newObj[key]?newObj[key]:delete newObj[key];
      }
      return newObj;
    };
    Vue.prototype.regularStr=function (string,type){//正则
      let reg='';
      if(type==='ch'){
        reg=/^[\u4e00-\u9fa5]+$/;
        if(reg.test(string)){return true}else {return false}
      }
      if(type==='bank_card'){
        reg=/^([1-9]{1})(\d{15}|\d{18})$/;
        if(reg.test(string)){return true}else {return false}
      }
      if(type==='phone'){
        reg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
        if(reg.test(string)){return true}else {return false}
      }
      if(type==='math'){
        reg=/^\d+(\.\d+)?$/;
        if(reg.test(string)){return true}else {return false}
      }
      if(type==='id_card'){
        reg= /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(string)){return true}else {return false}
      }
    };
    Vue.prototype.weekFn=function (week){//周几
      if(week==1) return '周一';
      if(week==2) return '周二';
      if(week==3) return '周三';
      if(week==4) return '周四';
      if(week==5) return '周五';
      if(week==6) return '周六';
      if(week==7) return '周日';
    };
    Vue.prototype.inverse=function (num){
      if (num < 0){
        num = ~(num - 1);
      }else if (num>0){
        num = ~num + 1;
      }
      return num;
    };
    Vue.prototype.HTMLEncode=function (html){//转义
      let temp = document.createElement("div");
      (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
      let output = temp.innerHTML;
      temp = null;
      return output;
    };
    Vue.prototype.unEscape=function (html){//反转义
      var temp = document.createElement("div");
      temp.innerHTML = html;
      var output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    };
    Vue.prototype.formatWeek=function (val){
      let dateArr=val.split('-');
      let ssdate = new Date(dateArr[0], parseInt(dateArr[1] - 1), dateArr[2]);
      let weekDay=String(ssdate.getDay());
      if(weekDay===String(0))weekDay=String(7);
      return weekDay
    };
    Vue.prototype.obgToArr=function (obj){//
      var arr = [];
      for (let i in obj) {
        let o = {};
        o[i] = obj[i];
        arr.push(o)
      }
     return arr
    };
    Vue.prototype.uploadImg=function (e, id_names){//单张上传
      let _self = this;
      //上传图片
      // let headImg = document.getElementById("uploads").files;
      // lrz(headImg[0], { width: 300 }).then(function(result) {
      //   var img = new Image();
      //   img.src = result.base64;
      //   return result;
      // }).then(function (result) {
      //   _self.$router.push({path:'/page1',query:{img_data:result.base64}});
      // });
      let file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
        return false
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        _self.$router.push({path:'/cutImg',query:{img_data:data}})
      };
      // 转化为base64
      reader.readAsDataURL(file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
    };
    Vue.prototype.uploadImgs=function (idname,imgGroup){//多选上传
      let that=this;
      var files = document.getElementById(idname).files;
      var length = files.length;
      if(length<=1){
        that.compress(files[0],imgGroup)
      }else {
        for(let i in files){
          if(i<files.length){
            that.compress(files[i],imgGroup)
          }
        }
      }
    };
    Vue.prototype.compress=function (item,imgGroup){//多选上传

    };
    Vue.prototype.isIos=function (){
      //获取浏览器的userAgent,并转化为小写
      var ua = navigator.userAgent.toLowerCase();
      //判断是否是苹果手机，是则是true
      var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
      if (isIos) {
        this.$refs.uploads.removeAttribute("capture");
      }
    };
    Vue.prototype.getUserInfo=function (user_id) {
      let params = {
        timeStamp:formatDateTime(new Date()),
        id:user_id,
      };
      return new Promise((resolve,reject)=>{
        request.getUserInfo(params).then(res=>{
          if(res.data.code==200){
            setLocalData('user_info',res.data.data);
            resolve(res.data.data);
          }else {
            reject(res.data.message)
          }
        })
      })
    };
  }
}

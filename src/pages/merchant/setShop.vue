<template>
    <div id="setShop">
      <head_bar  :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
      <div class="set_wrap">
        <div class="form_wrap card">
          <!--上半部分表单-->
          <form>
            <div class="form_item" v-for="(item,index) in formData">
              <label :for="item.id_name" class="t-b-a label_item">{{item.title}}<em>*</em></label><br>
              <input v-model="item.value" type="text" class="input_item c-b marginT16" :id="item.id_name" ref="input" :readonly="item.readonly"
                     :placeholder="item.placeholder" @click="chooseSth(index)" @change="changeVal(item.value,index)">
            </div>
            <div class="form_item">
              <label for="shop_introduce" class="t-b-a label_item">门店简介</label><br>
              <textarea id="shop_introduce" v-model="merchants_info" cols="30" rows="10" class="c-j area_item marginT16"
                        placeholder="请输入门店简介..."></textarea>
            </div>
            <div class="form_item">
              <p class="t-b-a label_item">营业时间<em>*</em></p>
              <div class="openTime marginT16">
                <div class="detail" v-show="showDetailOpenTime">
                  <div class="top_line">
                    <span class="c-Bc">日期</span>
                    <img src="./images/down.png" alt="">
                  </div>
                  <ul class="select c-Bc">
                    <li :class="openDateIndex===index?'select_item activeOpen':'select_item'" v-for="(item,index) in openDate" @click="chooseOpenDate(index)">{{item}}</li>
                  </ul>
                  <div class="top_line">
                    <span class="c-Bc">时间</span>
                  </div>
                  <div class="select diff">
                    <datetime class="select_item c-Bc" v-model="openStartTime" format="HH:mm"></datetime>
                    <span class="c-j marginR20">至</span>
                    <datetime class="select_item c-Bc" v-model="openEndTime" format="HH:mm"></datetime>
                  </div>
                  <button class="confirm" @click="confirmOpenTime">确认</button>
                </div>
                <div class="brief" v-show="!showDetailOpenTime" @click="showDetailOpenTime=true">
                  <span class="c-b">{{openTime}}</span>
                  <img src="./images/down.png" alt="">
                </div>
              </div>
            </div>
            <div class="shop_album t-b-a">
              <p>商家头像<em>*</em><span class="e_c">(传且仅传一张)</span></p>
              <div class="show_album marginT16">
                <div class="img_item" v-if="albumGroup.length>0" v-for="(item,index) in albumGroup">
                  <img class="del_btn" src="../../assets/images/icon/icon_del.png" @click="delImages(index,albumGroup)">
                  <img :src="imgUrl(item)" class="mixin-img" />
                </div>
                <div class="uploads">
                  <input class="input_val" id="shopAlbum" ref="uploads" type="file" name="cover"
                         accept="image/*" @change="upOneImg('shopAlbum',1)" multiple/>
                  <div class="img_add"><img src="./images/addImg.png"/></div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="upload_wrap card">
          <!--下半部分表单-->
          <form>
            <div class="form_item" v-for="(item,index) in downData">
              <label :for="item.id_name" class="t-b-a label_item">{{item.title}}<em>*</em></label><br>
              <input type="text" class="input_item c-b marginT16" :id="item.id_name" :placeholder="item.placeholder"
                     v-model="item.value" :disabled="item.disabled" @change="changeDownVal(item.value,index)">
            </div>
          </form>
          <div class="upload_item t-b-a">
            <p>上传营业执照<em>*</em></p>
            <div class="show_album marginT16">
              <div class="img_item" v-if="businessGroup.length>0" v-for="(item,index) in businessGroup">
                <img class="del_btn" src="../../assets/images/icon/icon_del.png" @click="delImages(index,businessGroup)">
                <img :src="imgUrl(item)" class="mixin-img" />
              </div>
              <div class="uploads">
                <input class="input_val" id="business" ref="uploads" type="file" name="cover"
                       accept="image/*" @change="upOneImg('business',2)" multiple/>
                <div class="img_add"><img src="./images/addImg.png"/></div>
              </div>
            </div>
          </div>
          <div class="upload_item t-b-a">
            <p>上传卫生许可证</p>
            <div class="show_album marginT16">
              <div class="img_item" v-if="healthGroup.length>0" v-for="(item,index) in healthGroup">
                <img class="del_btn" src="../../assets/images/icon/icon_del.png" @click="delImages(index,healthGroup)">
                <img :src="imgUrl(item)" class="mixin-img" />
              </div>
              <div class="uploads">
                <input class="input_val" id="health" ref="uploads" type="file" name="cover"
                       accept="image/*" @change="upOneImg('health',3)" multiple/>
                <div class="img_add"><img src="./images/addImg.png"/></div>
              </div>
            </div>
          </div>
          <div class="upload_item t-b-a">
            <p>上传经营者身份证<em>*</em><span class="e_c">(身份证正反两张)</span></p>
            <div class="show_album marginT16">
              <div class="img_item" v-if="IDCardGroup.length>0" v-for="(item,index) in IDCardGroup">
                <img class="del_btn" src="../../assets/images/icon/icon_del.png" @click="delImages(index,IDCardGroup)">
                <img :src="imgUrl(item)" class="mixin-img" />
              </div>
              <div class="uploads">
                <input class="input_val" id="IDCard" ref="uploads" type="file" name="cover"
                       accept="image/*" @change="upOneImg('IDCard',4)" multiple/>
                <div class="img_add"><img src="./images/addImg.png"/></div>
              </div>
            </div>
          </div>
        </div>
        <div class="agreementBox">
          <div>
            <input type="checkbox" id="my_check" v-model="isAgreement">
            <label for="my_check"></label>
          </div>
          <div>
            <span class="link c-h">同意商户合作协议</span>
          </div>
        </div>
        <div class="done_wrap">
          <button class="submitBtn cannotSub" v-if="!isSelected" @click="testa">提交审核</button>
          <button class="submitBtn" @click="submitExamine" v-else>提交审核</button>
        </div>
        <!--类型弹窗-->
        <popup-picker class="typeReq" ref="cate" :show-name="true"
                      :show="type_pop" :data="type_info.type_list" :columns="3"
                      v-model="type_info.type_id" @on-hide="showType()">
        </popup-picker>
        <div class="audit" v-transfer-dom>
          <alert v-model="alert_show" @on-hide="onHide">{{noticeMsg}}</alert>
        </div>
      </div>
      <div class="notice" v-transfer-dom>
        <popup v-model="show_notice" position="top" :show-mask="false">
          <div class="position-vertical-demo">{{noticeMsg}}</div>
        </popup>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import {PopupPicker,Alert,Popup,Datetime,TransferDomDirective as TransferDom} from 'vux';
  import {formatDateTime, formatDate2} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
    export default {
      name: "setShop",
      components:{head_bar,PopupPicker,Alert,Popup,Datetime},
      directives: {TransferDom},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'商户入驻',
          bg_color:'#f4f3f0',
          user_info: getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          formData:[
            {id_name:'shop_name',title:'门店名字',placeholder:'给你的店铺取个名字吧！',value:'',readonly:false},
            {id_name:'shop_address',title:'门店地址',placeholder:'武侯区天府二街',value:this.$route.query.address,readonly:true},
            {id_name:'address_detail',title:'详细地址',placeholder:'门店详细地址',value:'',readonly:false},
            {id_name:'shop_type',title:'商户类型',placeholder:'请选择商户类型',value:this.cate_str,disabled:true,readonly:true},
            {id_name:'shop_phone',title:'联系电话',placeholder:'请输入你的手机号',value:'',readonly:false}
          ],
          downData:[
            {id_name:'shop_name',title:'经营者真实姓名',placeholder:'张三',value:''},
            {id_name:'shop_address',title:'身份证号',placeholder:'请输入经营者身份证号码',value:''},
          ],
          up_items:[],
          down_items:[],
          albumGroup:[],//商铺相册
          businessGroup:[],
          healthGroup:[],
          IDCardGroup:[],
          merchants_info:'',
          isSelected:false,
          isAgreement:false,
          show_notice:false,
          type_info:{
            type_list:[],
            type_id:[],
            pidArr:[],//商户的二级类型
          },
          type_pop:false,//显示隐藏类型选择弹窗
          alert_show:false,
          noticeMsg:'',//提示信息
          lnglatXY:[],//经纬度
          cate_str:'',
          merchant_info:{},
          merchants_id:this.$route.query.merchants_id,
          openDate:['工作日','周末','每天'],
          openDateIndex:0,
          openStartTime:'',
          openEndTime:'',
          showDetailOpenTime:false,
        }
      },
      watch:{
        formData: {
          handler: function() {
            this.isSelectedAll()
          },
          deep: true
        },
        downData: {
          handler: function() {
            this.isSelectedAll()
          },
          deep: true
        },
        albumGroup(){
          this.isSelectedAll()
        },
        businessGroup(){
          this.isSelectedAll()
        },
        IDCardGroup(){
          this.isSelectedAll()
        },
        openTime(){
          this.isSelectedAll()
        },
        isAgreement(){
          this.isSelectedAll()
        },
        cate_str(val){
          this.formData[3].value=val
        },
        show_notice(val){
          if(val){
            setTimeout(() => {
              this.show_notice = false
            },2000)
          }
        }
      },
      computed:{
        openTime(){
          let dates = '';
          if(this.openStartTime&&this.openEndTime){
            dates=this.openDate[this.openDateIndex];
            return dates+' '+this.openStartTime+'-'+this.openEndTime;
          }else {
            return '请选择营业时间'
          }
        }
      },
      methods:{
        confirmOpenTime(){
          if(this.openStartTime&&this.openEndTime){
            this.showDetailOpenTime=false
          }
        },
        uploadAlbum(){
          this.upOneImg('shopAlbum',1)
        },
        testa(){
          console.log(this.up_items[4],'type_id');
        },
        changeVal(val,key){
          this.up_items[key]=val;
        },
        isSelectedAll(){//是否填完必填
          for(let i=0;i<this.formData.length;i++){
            if(this.formData[i].value){
              for(let j=0;j<this.downData.length;j++){
                if(this.downData[j].value){
                  if(this.businessGroup.length>0&&this.albumGroup.length===1&&this.IDCardGroup.length===2&&this.openTime!=='请选择营业时间'){
                    this.isAgreement?this.isSelected=true:this.isSelected=false;
                  }else {
                    this.isSelected=false;
                  }
                }else {
                  this.isSelected=false;
                  break;
                }
              }
            }else {
              this.isSelected=false;
              break;
            }
          }
        },
        changeDownVal(val,key){
          this.down_items[key]=val;
        },
        isIos(){
          //获取浏览器的userAgent,并转化为小写
          let ua = navigator.userAgent.toLowerCase();
          //判断是否是苹果手机，是则是true
          let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
          if (isIos) {
            this.$refs.uploads.removeAttribute("capture");
          }
        },
        upOneImg(idname,index){
          let that=this;
          var files = document.getElementById(idname).files;
          var length = files.length;
          if(length<=1){
            that.compress(files[0],index)
          }else {
            for(let i in files){
              if(i<files.length){
                that.compress(files[i],index)
              }
            }
          }
        },
        compress(item,index){//压缩图片上传
          let that=this;
          lrz(item, { width: 480 }).then(function(result) {
            let img = new Image();
            img.src = result.base64;
            return result;
          }).then(function (result) {
            let params={img:result.base64};
            request.uploadOneImg(params).then(res=>{
              let resData = res.data.data;
              if(index==1){
                that.albumGroup.push(resData)
              }else if(index==2){
                that.businessGroup.push(resData)
              }else if(index==3){
                that.healthGroup.push(resData)
              }else if(index==4){
                that.IDCardGroup.push(resData)
              }
            })
          });
        },
        chooseSth(index){
          // index==1?this.$router.push({path:'/addSelect',
          //   query:{last_path:this.$route.path}}):'';
          // index==2?this.type_pop=true:'';
          if(index==1){
            this.$router.push({path:'/addSelect',
              query:{last_path:this.$route.path,merchants_id:this.merchants_id}})
          }else if(index==3){
            this.type_pop=true
          }
        },
        submitExamine(){//提交审核
          let params=this.deleteStr({
            merchants_name:this.up_items[0],//商铺名称
            merchants_address:this.up_items[1]+','+this.up_items[2],//商铺地址
            merchants_category:this.type_info.type_id[0],//分类id
            merchants_phone:this.up_items[4],//商铺电话
            merchants_longitude:String(this.lnglatXY[0]),//地址经度
            merchants_latitude:String(this.lnglatXY[1]),//地址纬度
            merchants_info:this.merchants_info,//商铺简介
            merchants_img:this.albumGroup.join(','),//商铺图片
            merchants_open_time:this.openTime,//营业时间
            merchants_user_id:this.user_info.id,//所属用户ID
            real_name:this.down_items[0],//所属用户真实姓名
            id_card:this.down_items[1],//所属用户身份证号
            merchants_user_id_card_img:this.IDCardGroup.join(','),//身份证照片
            merchants_health_license_img:this.healthGroup.join(','),//卫生许可证
            merchants_business_license_img:this.businessGroup.join(','),//营业执照照片
            timeStamp:formatDateTime(new Date())
          });
          this.$store.commit('updateLoadingStatus', {isLoading: true});
          if(this.merchants_id){
            params.id=this.merchants_id;
            request.editMerchants(params).then(res=>{
              this.show_notice=true;
              this.noticeMsg = res.data.message+'，2秒后跳转...';
              setTimeout(() => {
                this.$store.commit('updateLoadingStatus', {isLoading: false});
                this.$router.push({path:'/merchantOpt'})
              },2000)
            })
          }else {
            request.joinMerchants(params).then(res=>{
              this.$store.commit('updateLoadingStatus', {isLoading: false});
              if(res.data.code===200){
                this.alert_show=true;
                this.noticeMsg = res.data.message;
              }else {
                this.show_notice=true;
                this.noticeMsg = res.data.message;
              }
            })
          }
        },
        onHide(){
          this.$router.push({path:'/options'})
        },
        typeReq(pid){
          let that = this;
          let params = {request_type:String(2),pid:String(pid),timeStamp:formatDateTime(new Date())};
          request.getCategory(params).then((res)=>{
            let arr=res.data.data;
            arr.map((item,i)=>{
              that.type_info.pidArr.push({pid:item.id});
              item.value=item.id;
              item.parent=item.pid;
            });
            that.type_info.type_list=arr;
          });
        },
        showType(){
          this.type_pop=false;
          var cate_value = this.$refs.cate.$el.innerText;
          this.cate_str=cate_value;
        },
        getMerchantsInfo(merchants_id){
          let params={
            id:merchants_id,
            timeStamp:formatDateTime(new Date())
          };
          request.merchantsInfo(params).then(res=>{
            this.merchant_info=res.data.data;
            this.assignment();
          })
        },
        assignment(){
          this.up_items[0]=this.merchant_info.merchants_name;
          this.up_items[1]=this.merchant_info.merchants_address;
          this.up_items[4]=this.merchant_info.merchants_phone;
          this.formData[0].value=this.merchant_info.merchants_name;
          this.formData[1].value=this.merchant_info.merchants_address.split(',')[0];
          this.formData[2].value=this.merchant_info.merchants_address.split(',')[1];
          this.up_items[1]=this.merchant_info.merchants_address.split(',')[0];
          this.up_items[2]=this.merchant_info.merchants_address.split(',')[1];
          this.type_info.type_id=[this.merchant_info.merchants_category];
          this.cate_str=this.merchant_info.merchants_category_name;
          this.type_info.type_id=[this.merchant_info.merchants_category];
          this.formData[4].value=this.merchant_info.merchants_phone;
          this.merchants_info=this.merchant_info.merchants_info;
          this.lnglatXY=[this.merchant_info.merchants_longitude,this.merchant_info.merchants_latitude];
          this.albumGroup=this.merchant_info.merchants_img.split(",");
          this.downData[0].value=this.merchant_info.real_name;
          this.down_items[0]=this.merchant_info.real_name;
          this.downData[1].value=this.merchant_info.id_card;
          this.down_items[1]=this.merchant_info.id_card;
          this.merchant_info.merchants_business_license_img?
            this.businessGroup=this.merchant_info.merchants_business_license_img.split(",")
            :this.businessGroup=[];
          this.merchant_info.merchants_health_license_img?
            this.healthGroup=this.merchant_info.merchants_health_license_img.split(",")
            :this.healthGroup=[];
          this.merchant_info.merchants_user_id_card_img?
            this.IDCardGroup=this.merchant_info.merchants_user_id_card_img.split(",")
            :this.IDCardGroup=[];
        },
        getQuery(){
          this.lnglatXY=this.$route.query.lnglatXY;
          this.formData[1].value=this.$route.query.address;
          this.up_items[1]=this.$route.query.address;
          this.lnglatXY=this.$route.query.lnglatXY;
          this.formData[4].value=this.user_info.phone;
          this.up_items[4]=this.user_info.phone;
          if(this.$route.query.merchants_id){
            this.getMerchantsInfo(this.$route.query.merchants_id);
          }
        },
        delImages(index,imgArr){
          imgArr.splice(index,1)
        },
        chooseOpenDate(index){//选择营业日期
          this.openDateIndex=index;
        }
      },
      activated(){
        let user_id = this.$route.query.uid;
        if(user_id){
          this.getUserInfo(user_id).then(res=>{
            this.getQuery();
            this.typeReq(0);
            this.user_info=res
          });
        }else {
          this.getQuery();
          this.typeReq(0);
        }
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      created(){
        // this.getQuery();
        let user_id = this.$route.query.uid;
        if(user_id){
          this.getUserInfo(user_id).then(res=>{
            this.user_info=res
          });
        }
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      },
      deactivated(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      },
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .card{
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px)
  }
  em{color: @sign}
  .marginT16{margin-top: 16px}
  .marginR20{margin-right: 20px}
  #setShop{
    padding-top: 90px;
    min-height: 100%;
    background-color: @bg-b;
    .show_album{
      display: flex;
      align-items: center;
      .img_item{
        position: relative;
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
      .uploads{
        position: relative;
        .input_val{
          position: absolute;
          display: block;
          width: 100px;
          height: 100px;
          opacity: 0;
        }
      }
    }
    .set_wrap{
      padding: 20px 32px 40px;
      .form_wrap,.upload_wrap{
        padding: 40px 20px;
        margin-bottom: 16px;
        .form_item,.upload_item{
          margin-bottom: 40px;
          .input_item{
            display: block;
            width: 100%;
            border: none;
            background-color: @bg-e;
            padding: 20px 0;
            text-align: center;
          }
          .area_item{
            display: block;
            width: 646px;
            height: 140px;
            border: none;
            background-color: @bg-e;
            padding: 20px;
            box-sizing: border-box;
          }
        }
      }
      .upload_wrap{
        margin-bottom: 40px;
      }
      .agreementBox{
        display: flex;
        align-items:center;
        color: #505052;
        padding: 40px 52px;
        #my_check{
          display: none;
        }
        #my_check + label{
          background-color: @bg-c;
          border: solid 2px #53d499;
          width: 24px;
          height:24px;
          display: inline-block;
          text-align: center;
          vertical-align: middle;
          line-height: 20px;
        }
        #my_check:checked + label:after{
          content:"\2714";
          font-size: 24px;
          color: #53d499;
        }
        .link{
          margin-left: 10px;
          text-decoration: none;
        }
      }
      .done_wrap{
        .submitBtn{
          display: block;
          border: none;
          .mixin-setButton(500px,60px,@G1,@bg-d,24px,none);
          box-shadow: 0 5px 9px 0
          rgba(0, 1, 1, 0.14);
          .mixin-borderRadius(8px);
          margin: 0 auto;
        }
        .cannotSub{
          .mixin-setButton(500px,60px,@G6,@bg-i,24px,none);
        }
      }
      .openTime{
        padding: 20px;
        background-color: @bg-e;
        .detail{
          .top_line{
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .select{
            display: flex;
            align-items: center;
            margin: 20px 0 40px;
            .select_item{
              width: 100px;
              height: 50px;
              line-height: 50px;
              text-align: center;
              background-color: @W1;
              margin-right: 20px;
              border: none;
            }
            .activeOpen{
              width: 100px;
              height: 50px;
              background-color: @Y4;
              outline: solid 1px @bg-d;
            }
          }
          .diff{
            margin: 20px 0;
          }
          .confirm{
            display: block;
            border: none;
            .mixin-setButton(120px,60px,@W1,@btn_bg2,24px,none);
            box-shadow: 0 5px 9px 0
            rgba(0, 1, 1, 0.14);
            .mixin-borderRadius(8px);
            margin: 0 auto;
          }
        }
        .brief{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
<style lang="less">
  #setShop{
    .vux-cell-box{
      &:not(:first-child):before{
        border-top: none;
        height: 0;
      }
      .vux-popup-picker-select{
        height: 0;
        opacity: 0;
      }
    }
  }
  .vux-popup-picker-container{
    .vux-popup-header{
      font-size: 24px;
      height: 50px;
    }
  }
  .vux-picker{
    .scroller-indicator{
      height: 50px;
    }
    .scroller-item{
      height: 50px;
      font-size: 24px;
    }
  }
</style>

<template>
  <div id="add_goods">
    <head_bar :backLast="back_last" :tab_c="tab_c" @publish="publishGoods"
              :head="head" :bg_color="bg_color" :showSuc="true">
    </head_bar>
    <div class="add_wrap">
      <div class="add_img">
        <img src="./images/add_img.png" @click="ex_show=true"/>
        <img v-for="(item,index) in add_goods_data.goods_imgs" :src="imgUrl(item)" class="img_item" @click="deleteImages(index)">
      </div>
      <form class="form_wrap">
        <div class="form_item">
          <label for="shop_name" class="c-a label_item"><img src="./images/icon_title.png"> 标题/名字：</label><br>
          <input type="text" class="input_item c-b" id="shop_name" v-model="add_goods_data.goods_name"
                 placeholder="给你的商品取个名字吧！">
        </div>
        <div class="form_item">
          <label class="c-a label_item"><img src="./images/icon_address.png">商品分类：</label><br>
          <!--<input type="text" class="input_item c-j" id="address" placeholder="请选择商品分类">-->
          <!--类型弹窗-->
          <popup-picker class="input_item c-b" ref="cate" :show-name="true" title="请选择类型"
                        :show="type_pop" :data="type_info.type_list" :columns="1" value-text-align="left"
                        v-model="type_info.type_id" @on-hide="showType()">
          </popup-picker>
        </div>
        <div class="double_item form_item">
          <div>
            <label for="price" class="c-a label_item"><img src="./images/icon_coin.png">折扣价：</label><br>
            <input type="text" class="input_item c-b" v-model="add_goods_data.goods_price" id="price"
                   placeholder="￥00.00" onkeyup="value=value.replace(/[^\d]/g,'')">
          </div>
          <div>
            <label for="origin" class="c-a label_item"><img src="./images/icon_orign.png">原价：</label><br>
            <input type="text" class="input_item c-b" v-model="add_goods_data.goods_origin" id="origin"
                   placeholder="￥00.00" onkeyup="value=value.replace(/[^\d]/g,'')">
          </div>
        </div>
      </form>
      <div class="sales_wrap">
        <div class="head_top">
          <img class="title_icon" src="./images/icon_sales.png" />
          <span class="c-a title_name">销售模式</span>
          <div class="select" v-for="(item,index) in select_model">
            <img :src="item.img_src" @click="modelSwitch(index)"/>
            <span class="c-Bc">{{item.model_name}}</span>
            <img src="./images/icon_help.png" v-if="item.show_help"/>
          </div>
        </div>
        <div class="sales_model">
          <div class="norm_model" v-show="!model_switch">
            <div class="head_line item_model">
              <div class="top_line">
                <span class="top_item c-Bc">日期</span>
                <span class="top_item weeks c-r" v-for="(item,index) in normal_time">{{item.value}}</span>
              </div>
              <div class="selector">
                <checker v-model="week_checked" type="radio" default-item-class="demo1-item"
                         selected-item-class="demo1-item-selected" @on-change="checkRa">
                  <checker-item v-for="(item,index) in normal_time" :value="item"
                                :key="index">
                  </checker-item>
                </checker>
              </div>
              <div class="valid_block top_valid">
                <datetime class="item_time c-a" v-model="valid_data.start_time" format="HH:mm"></datetime>
                <span class="c-r interval">至</span>
                <datetime class="item_time c-a" v-model="valid_data.end_time" format="HH:mm"></datetime>
              </div>
              <div class="stock">
                <div class="stock_block">
                  <label class="c-Bc title">库存</label>
                  <input class="stock_input input_block c-a" type="text" v-model="add_goods_data.inventory">
                </div>
              </div>
            </div>
          </div>
          <div class="collage_model" v-show="model_switch">
            <div class="head_line">
              <div class="top_line">
                <span class="top_item c-Bc">日期</span>
                <span class="top_item weeks c-r" v-for="(item,index) in weeks">{{item.value}}</span>
              </div>
              <div class="selector">
                <checker v-model="collweek_checked" type="checkbox" default-item-class="demo1-item"
                         selected-item-class="demo1-item-selected" @on-change="collegeCheck">
                  <checker-item v-for="(item,index) in weeks" :value="index+1"
                                :key="index">
                  </checker-item>
                </checker>
              </div>
            </div>
            <div class="body_line">
              <span class="title c-Ba">开团时间</span>
              <div class="time_block">
                <datetime v-for="(item,index) in timeObj.open_num" :key="index" class="item_time c-a"
                          v-model="timeObj.open_time[index]" format="HH:mm"></datetime>
              </div>
              <img src="./images/icon_add.png" @click="addTime" v-show="timeObj.show_add" />
            </div>
            <div class="body_line">
              <span class="title c-Ba">取消拼团</span>
              <div class="time_block c-j">
                提前
                <input class="item_time input_block c-a" type="text" v-model="add_goods_data.cancel_time">
                小时，可取消订单
              </div>
            </div>
            <div class="body_line">
              <span class="title c-Ba">截止时限</span>
              <div class="time_block c-j">
                提前
                <input class="item_time input_block c-a" type="text" v-model="add_goods_data.cut_time">
                小时，截止拼团
              </div>
            </div>
            <div class="foot_line">
              <span class="c-Ba title">人数</span>
              <input class="inp c-a" type="text" v-model="add_goods_data.number.min_num">
              <span class="c-r interval">至</span>
              <input class="inp c-a" type="text" v-model="add_goods_data.number.max_num">
            </div>
          </div>
        </div>
      </div>
      <div class="foot_line item_model">
        <span class="c-Bc title">有效日期</span>
        <div class="valid_block">
          <datetime class="item_time c-a" :display-format="formatValueFunction" v-model="valid_data.start_date"></datetime>
          <span class="c-r interval">至</span>
          <datetime class="item_time c-a" :display-format="formatValueFunction" v-model="valid_data.end_date"></datetime>
        </div>
      </div>
  <div id="editor" class="editor">
      <p>{{add_goods_data.goods_desc}}</p>
    </div>
  </div>
    <div class="img_upload" v-if="ex_show">
      <div class="input_wrap">
        <input type="file" ref="uploads" id="upload_camera" name="file" multiple="multiple" accept="image/*"
               capture="camera" @change="uploadAlbum('upload_camera')">
        <input type="file" ref="uploads" id="upload_file" name="file" multiple="multiple"
               accept="image/*" @change="uploadAlbum('upload_file')">
      </div>
    </div>
    <actionsheet v-model="ex_show" :menus="menu" show-cancel></actionsheet>
    <div class="notice" v-transfer-dom>
      <popup v-model="show_notice" position="top" :show-mask="false">
        <div class="position-vertical-demo">{{noticeMsg}}</div>
      </popup>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {formatDateTime,formatDate,now_time} from '@/utils/format';
  import request from '@/utils/request';
  import {Actionsheet,Checker,PopupPicker,CheckerItem,Datetime,Group,Popup,
    TransferDomDirective as TransferDom} from 'vux';
  import {getLocalData} from '@/utils/storages';
  import {getNextMonth} from '@/utils/utils';
  import E from 'wangeditor'
  export default {
    name: "add_goods",
    components:{head_bar,Actionsheet,Checker,CheckerItem,Datetime,Group,PopupPicker,Popup},
    directives: {TransferDom},
    data(){
      return{
        tab_c:true,
        back_last:true,
        head:'添加商品',
        bg_color:'#ffe035',
        user_info: getLocalData('user_info'),//用户信息
        ex_show:false,
        show_notice:false,
        goods_id:this.$route.query.goods_id,
        content:'',
        menu:{
          menu1: '拍照',
          menu2: '从相册中选择'
        },
        select_imgArr:[require('./images/selected.png'),require('./images/not_select.png')],
        select_model:[
          {img_src:require('./images/selected.png'),model_name:'普通模式'},
          {img_src:require('./images/not_select.png'),model_name:'拼团模式',show_help:true},
        ],
        weeks:[{value:'周一'},{value:'周二'},{value:'周三'},{value:'周四'},{value:'周五'},{value:'周六'},{value:'周日'}],
        normal_time:[{value:'工作日'},{value:'周末'},{value:'每天'}],
        week_checked:[],
        collweek_checked:[],
        check_date:false,
        select_show:false,
        timeStamp:formatDateTime(new Date()),//时间戳
        timeObj:{
          open_num:1,
          show_add:true,
          open_time:[],
        },
        model_switch:false,//模式切换
        valid_data:{
          start_date:formatDateTime(new Date()).split(" ")[0],
          end_date:getNextMonth(formatDateTime(new Date())).split(" ")[0],
          start_time:'9:00',
          end_time:'10:00',
        },
        formatValueFunction (val) {
          return val.replace(/-/g, '.')
        },
        group_time:[],//团购时间
        type_pop:false,
        cate_str:'',
        type_info:{
          type_list:[],
          type_id:[],
          pidArr:[],
        },
        add_goods_data:{
          goods_imgs:[],//商品图片
          goods_name:'',//商品名称
          goods_price:'',//商品价格
          goods_origin:'',//商品原价
          goods_desc:'',//商品简介
          available_time:'',//可用时间
          number:{min_num:'',max_num:''},
          cut_time:1,
          cancel_time:6,
          inventory:'',
        },
        noticeMsg:'提示信息',
        goods_info:{},
      }
    },
    watch:{
      select_show(val){
        if(val){//拼团模式
          this.select_model[0].img_src=this.select_imgArr[1];
          this.select_model[1].img_src=this.select_imgArr[0];
        }else {//普通模式
          this.select_model[1].img_src=this.select_imgArr[1];
          this.select_model[0].img_src=this.select_imgArr[0];
        }
      },
      show_notice(val){
        if(val){
          setTimeout(() => {
            this.show_notice = false
          },2000)
        }
      }
    },
    methods:{
      createEditor(){
        let that= this;
        let editor = new E('#editor');
        editor.customConfig.onchange = (html) => {
          this.add_goods_data.goods_desc = html
        };
        editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ];
        editor.customConfig.customUploadImg = function (files, insert) {
          // files 是 input 中选中的文件列表
          // insert 是获取图片 url 后，插入到编辑器的方法
          let form = new FormData();
          form.append('file',files[0]);
          let reader=new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload=function(e){
            let params={img:reader.result};
            that.uploadOneImg(params).then(res=>{
              insert(that.$newHttpsSrc+res)
            })
          };
          // 上传代码返回结果之后，将图片插入到编辑器中
        };
        editor.create();
        editor.txt.html(that.add_goods_data.goods_desc)
      },
      uploadOneImg(params){
        return new Promise((resolve,reject)=>{
          request.uploadOneImg(params).then(res=>{
            let resData = res.data.data;
            resolve(resData)
          })
        });
      },
      showGoodsData(){
        if(this.goods_id){
          let params={
            goods_id:this.goods_id,
            timeStamp:this.timeStamp
          };
          request.getGoodsInfo(params).then(res=>{
            this.goods_info=res.data.data;
            this.processing();
          })
        }
      },
      processing(){
        this.add_goods_data.goods_imgs=this.goods_info.merchants_goods_img.split(',');
        this.add_goods_data.goods_name=this.goods_info.merchants_goods_name;
        this.add_goods_data.goods_price=this.goods_info.merchants_goods_discount_price;
        this.add_goods_data.goods_origin=this.goods_info.merchants_goods_price;
        this.type_info.type_id=[this.goods_info.merchants_goods_category];
        this.valid_data.end_date=this.goods_info.merchants_goods_end_time.split(' ')[0];
        this.add_goods_data.goods_desc=this.goods_info.merchants_goods_info;
        if(this.goods_info.merchants_goods_type==1){
          this.add_goods_data.inventory=this.goods_info.merchants_goods_inventory;
          let time_arr = this.goods_info.merchants_goods_available_time.split(" ");
          let week_arr = time_arr[0].split(",");
          let hour_arr = time_arr[1].split("-");
          week_arr.map((val,key)=>{
            this.week_checked.push({value:val})
          });
          this.valid_data.start_time=hour_arr[0];
          this.valid_data.end_time=hour_arr[1];
        }else {
          let field = this.get_object_first_attribute(this.goods_info.merchants_goods_available_time);
          this.select_show=true;
          this.model_switch=true;
          this.collweek_checked=this.goods_info.merchants_goods_available_time_weeks;
          this.timeObj.open_num=field.length;
          this.timeObj.open_time=field;
          this.add_goods_data.cut_time=this.goods_info.merchants_goods_end_group_time;
          this.add_goods_data.number.min_num=this.goods_info.merchants_goods_min_pople;
          this.add_goods_data.number.max_num=this.goods_info.merchants_goods_max_pople;
        }
        this.showType();
        this.createEditor();
      },
      get_object_first_attribute(data){
        for (let key in data)
          return data[key];
      },
      showType(){//显示分类列表
        this.cate_str='';
        let cate_value = this.$refs.cate.$el.innerText;
        this.cate_str=cate_value;
        if(this.type_info.type_id.length>0){
          document.querySelector('.weui-label').style.display='none';
        }
      },
      typeReq(pid){
        let that = this;
        let params = {request_type:String(2),pid:String(pid),timeStamp:that.timeStamp};
        request.getCategory(params).then((res)=>{
          let arr=res.data.data;
          this.showGoodsData();
          arr.map((item,i)=>{
            that.type_info.pidArr.push({pid:item.id});
            item.value=item.id;
            item.parent=item.pid;
          });
          that.type_info.type_list=arr;
        });
      },
      publishGoods(){
        this.$store.commit('updateLoadingStatus', {isLoading: true});
        let params=this.deleteStr({
          merchants_goods_name:this.add_goods_data.goods_name,//商品名称(活动名称)
          merchants_goods_merchants_id:this.user_info.merchants_id,//商铺ID
          merchants_goods_price:this.add_goods_data.goods_origin,//商品价格
          merchants_goods_category:this.type_info.type_id.join(','),//商品分类
          merchants_goods_discount_price:this.add_goods_data.goods_price,//折扣后价格
          merchants_goods_img:this.add_goods_data.goods_imgs.join(','),//商品图片(逗号分割)
          merchants_goods_inventory:String(this.add_goods_data.inventory),//库存
          merchants_goods_info:encodeURIComponent(this.add_goods_data.goods_desc),//商品简介
          merchants_goods_type:this.select_show?String(2):String(1),//商品类型
          merchants_goods_start_time:this.valid_data.start_date,
          merchants_goods_end_time:this.valid_data.end_date,
          timeStamp:this.timeStamp,
        });
        if(!this.select_show){//普通模式
          let valid_time=this.add_goods_data.available_time+' '+
            this.valid_data.start_time+'-'
            +this.valid_data.end_time;
          params.merchants_goods_available_time=valid_time;//可用时间
        }else {
          for(let key in this.group_time){
            this.group_time[key] = this.timeObj.open_time
          }
          params.merchants_goods_available_time=encodeURIComponent(JSON.stringify(this.group_time));
          params.merchants_goods_min_pople=String(this.add_goods_data.number.min_num);
          params.merchants_goods_max_pople=String(this.add_goods_data.number.max_num);
          params.merchants_goods_end_group_time=String(this.add_goods_data.cut_time);
          params.merchants_goods_cancel_order_time=String(this.add_goods_data.cancel_time);
        }
        if(this.goods_id){
          params.id=this.goods_id;
          request.editMerchantsGoods(params).then(res=>{
            this.$store.commit('updateLoadingStatus', {isLoading: false});
            if(res.data.code===200){
              this.$router.push({path:'/merchantGoods'})
            }else {
              this.show_notice=true;
              this.noticeMsg=res.data.message
            }
          })
        }else {
          request.addMerchantsGoods(params).then(res=>{
            this.$store.commit('updateLoadingStatus', {isLoading: false});
            if(res.data.code===200){
              this.$router.push({path:'/merchantGoods'})
            }else {
              this.show_notice=true;
              this.noticeMsg=res.data.message
            }
          })
        }
      },
      addTime(){//添加时段
        if(this.timeObj.open_num<5){
          this.timeObj.open_num+=1;
          this.timeObj.open_time.push(now_time(new Date()));
          if(this.timeObj.open_num==5){
            this.timeObj.show_add=false;
          }
        }
      },
      checkIn(value){
        let timeArr=[];
        value.map((val,key)=>{
          timeArr.push(val.value)
        });
        this.add_goods_data.available_time=timeArr.join(',');
      },
      checkRa(value){
        this.add_goods_data.available_time=value.value
      },
      collegeCheck(value){
        let list = {};
        for (let key in value) {
          list[value[key]] = [];
        }
        this.group_time=list;
      },
      modelSwitch(index){//普通模式
        if(index==0){
          this.select_show=false;
          this.model_switch=false;
        }else {
          this.select_show=true;
          this.model_switch=true;
        }
      },
      uploadAlbum(idname){//多选上传图片
        let that=this;
        var files = document.getElementById(idname).files;
        var length = files.length;
        if(length<=1){
          that.compress(files[0])
        }else {
          for(let i in files){
            if(i<files.length){
              that.compress(files[i])
            }
          }
        }
      },
      compress(item){//压缩图片上传
        let that=this;
        lrz(item, { width: 480 }).then(function(result) {
          let img = new Image();
          img.src = result.base64;
          return result;
        }).then(function (result) {
          let params={img:result.base64};
          request.uploadOneImg(params).then(res=>{
            let resData = res.data.data;
            that.add_goods_data.goods_imgs.push(resData)
          })
        });
      },
      deleteImages(index){
        this.add_goods_data.goods_imgs.splice(index,1)
      },
      getDefaultTime(){
        let params={
          merchants_id:String(this.user_info.merchants_id),
          timeStamp:this.timeStamp
        };
        request.getMerchantsGoodsDefaultTime(params).then(res=>{
          let resData = res.data.data;
          this.timeObj.open_num=resData.length;
          this.timeObj.open_time=resData;
          if(this.timeObj.open_num==5){
            this.timeObj.show_add=false;
          }
        })
      }
    },
    created(){
      this.typeReq(0);
      this.getDefaultTime();
    },
    mounted(){
      if(!this.goods_id){
        this.createEditor();
      }
      this.$store.commit('updateBottomNav', {showBottomNav: false});
    },
    destroyed(){
      this.$store.commit('updateBottomNav', {showBottomNav: true});
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .demo1-item {
    width: 20px;
    height: 20px;
    .mixin-borderRadius(4px);
    border: solid 2px #ababab;
    margin-right: 62px;
    &:last-child{
      margin-right:0;
    }
  }
  .demo1-item-selected {
    width: 20px;
    height: 20px;
    border: 1px solid #53d499;
    background: url("./images/check_out.png") 100% 100% no-repeat;
  }
  #add_goods{
    min-height: 100%;
    background-color: @W2;
    padding-bottom: 90px;
    .add_wrap{
      padding: 90px 32px 0;
      .add_img{
        padding-top: 26px;
        .img_item{
          width: 160px;
          height: 120px;
        }
      }
      .form_wrap{
        .form_item{
          margin-top: 40px;
          &:first-child{
            margin-top: 24px;
          }
          &:nth-of-type(3){
            .input_item{
              padding: 12px 0 12px 41px;
            }
          }
          .label_item{
            display: flex;
            align-items: center;
            img{
              margin-right: 16px;
            }
          }
          .input_item{
            display: block;
            width: 100%;
            margin-top: 22px;
            border: none;
            background-color: @bg-e;
            padding: 9px 0 9px 41px;
          }
        }
        .double_item{
          display: flex;
          justify-content: space-between;
          .input_item{
            padding:12px 0 12px 41px;
          }
        }
      }
      .sales_wrap{
        margin-top: 40px;
        .head_top{
          display: flex;
          align-items: center;
          .title_icon{
            margin-right: 15px;
          }
          .title_name{
            margin-right: 45px;
          }
          .select{
            display: flex;
            align-items: center;
            margin-right: 70px;
            &:last-child{margin-right: 0}
            img{margin-right: 10px}
            span{margin-right: 10px}
          }
        }
        .sales_model{
          margin-top: 40px;
          padding: 20px;
          background-color: @bg-e;
          .norm_model{
            .item_model{
              padding-bottom: 20px;
              display: flex;
              align-items: center;
              .title{
                margin-right: 40px;
              }
              .valid_block{
                display: flex;
                align-items: center;
                .interval{
                  margin: 0 20px;
                }
                .item_time{
                  display: inline-block;
                  padding: 10px 10px;
                  border: solid 2px @border_e;
                  .mixin-borderRadius(8px);
                  background: transparent;

                }
              }
              .stock{
                margin-top: 20px;
                .stock_input{
                  display: inline-block;
                  padding: 10px 10px;
                  border: solid 2px @border_e;
                  .mixin-borderRadius(8px);
                  margin-right: 16px;
                  background: transparent;
                }
              }
              .top_valid{
                margin-top: 20px;
                margin-left: 58px;
              }
            }
            .head_line{
              display: block;
            }
            .top_line{
              display: flex;
              flex-wrap: nowrap;
              margin-bottom: 10px;
              .top_item{
                margin-right:34px;
                &:last-child{
                  margin-right: 0;
                }
              }
            }
            .selector{margin-left: 87px}
          }
          .collage_model{
            .head_line{
              padding-bottom: 20px;
              border-bottom: 1px solid @border_f;
              display: block;
              .top_line{
                display: flex;
                flex-wrap: nowrap;
                margin-bottom: 10px;
                .top_item{
                  margin-right:40px;
                  &:last-child{
                    margin-right: 0;
                  }
                }
              }
              .selector{margin-left: 87px}
            }
            .body_line{
              display: flex;
              align-items: center;
              border-bottom: 1px solid @border_f;
              padding: 20px 0;
              .title{
                display: inline-block;
                width: 60px;
                margin-right: 37px;
              }
              .time_block{
                margin-right: 10px;
                .item_time{
                  display: inline-block;
                  padding: 10px 10px;
                  border: solid 2px @border_e;
                  .mixin-borderRadius(8px);
                  margin-right: 16px;
                  background: transparent;
                  &:last-child{
                    margin-right: 0;
                  }
                }
                .input_block{
                  display: inline-block;
                  width: 100px;
                  height: 40px;
                  margin-left: 20px;
                  margin-right: 20px;
                }
              }
            }
            .foot_line{
              display: flex;
              align-items: center;
              padding-top: 20px;
              .title{
                margin-right: 40px;
              }
              .inp{
                background-color: transparent;
                border: solid 2px @border_e;
                .mixin-borderRadius(8px);
                display: inline-block;
                width: 100px;
                height: 40px;
                padding: 10px 26px;
              }
              .interval{
                margin: 0 20px;
              }
            }
          }
        }
      }
      .foot_line{
        display: flex;
        align-items: center;
        margin-top: 40px;
        margin-bottom: 40px;
        .title{
          margin-right: 40px;
        }
        .valid_block{
          display: flex;
          align-items: center;
          .interval{
            margin: 0 20px;
          }
          .item_time{
            display: inline-block;
            padding: 10px 10px;
            /*width: 152px;*/
            border: solid 2px @border_e;
            .mixin-borderRadius(8px);
          }
        }
      }
      .textArea{
        margin-top: 40px;
        textarea{
          padding: 20px;
          display: block;
          width: 686px;
          height: 160px;
          border: solid 1px @bg-g;
          background-color: transparent;
        }
      }
      .add_more{
        display: block;
        margin: 26px auto 0 auto;
        .mixin-setButton(200px,48px,@W1,@G1,24px,none);
        .mixin-borderRadius(8px);
      }
    }
    .img_upload{
      position: fixed;
      left: 0;
      bottom: 77px;
      width: 100%;
      z-index: 5001;
      .input_wrap{
        input{
          width: 100%;
          display: block;
          position: relative;
          padding: 20px 0;
          opacity: 0;
          font-size: 24px;
        }
      }
    }
  }
</style>
<style lang="less">
  #add_goods{
    .weui-actionsheet__cell{
      font-size: 24px;
      padding: 20px 0;
    }
    #editor{
      font-size: 24px;
      .w-e-toolbar{
        flex-wrap: wrap;
        .w-e-menu{
          z-index: 451!important;
        }
       .w-e-droplist{
         .w-e-dp-title{
           font-size: 22px;
         }
       }
      }
      .w-e-text-container{
        z-index: 450!important;
        .w-e-panel-container{
          .w-e-panel-tab-title{
            font-size: 24px;
          }
          .w-e-panel-tab-content{
            .w-e-up-img-container{
              div{
                &:nth-of-type(2){
                  display: block !important;
                  opacity: 0;
                }
              }
            }
            input[type=text].block{
              font-size: 22px;
            }
            .w-e-button-container{
              button{
                font-size: 20px;
              }
            }
          }

        }
      }
    }
  }
</style>

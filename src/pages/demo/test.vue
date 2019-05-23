<template>
  <div>
    <button @click="getCategoryFn">怼我</button>
    <div>
      <form id="form" onsubmit="return false" method="post" enctype="multipart/form-data">
        <label class="btn" for="uploads">upload</label>
        <input type="file" id="uploads" name="img" class="getCamera" @change="uploadImg($event, 1)">
      </form>
    </div>
    <AMap_comp></AMap_comp>
    <div id="box">
      <ul id="con1" ref="con1" :class="{anim:animate==true}">
        <li v-for='item in items'>{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>

  import request from '@/utils/request'
  import {formatDateTime} from '@/utils/format'
  import AMap_comp from '@/components/AMap_comp'
    export default {
      name: "test",
      data(){
        return{
          animate:false,
          items:[
            {name:"马云"},
            {name:"雷军"},
            {name:"王勤"}
          ]
        }
      },
      components:{
        AMap_comp
      },
      created(){
        setInterval(this.scroll,2000)
      },
      methods:{
        getCategoryFn(){
          let params={pid:0,timeStamp:formatDateTime(new Date())};
          request.getCategory(params).then((data)=>{
          })
        },
        uploadImg (e, num) {
          var _self = this;
          //上传图片
          // let headImg = document.getElementById("uploads").files;
          // lrz(headImg[0], { width: 300 }).then(function(result) {
          //   var img = new Image();
          //   img.src = result.base64;
          //   return result;
          // }).then(function (result) {
          //   _self.$router.push({path:'/page1',query:{img_data:result.base64}});
          // });
          var file = e.target.files[0];
          if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
            alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
            return false
          }
          var reader = new FileReader();
          reader.onload = (e) => {
            let data;
            if (typeof e.target.result === 'object') {
              // 把Array Buffer转化为blob 如果是base64不需要
              data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
              data = e.target.result
            }
            _self.$router.push({path:'/page1',query:{img_data:data}})
          };
          // 转化为base64
          reader.readAsDataURL(file)
          // 转化为blob
          // reader.readAsArrayBuffer(file)
        },
        scroll(){
          this.animate=true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
          setTimeout(()=>{      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
            this.items.push(this.items[0]);  // 将数组的第一个元素添加到数组的
            this.items.shift();               //删除数组的第一个元素
            this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
          },1000)
        }
      }
    }
</script>

<style scoped>
  #box{
    width: 300px;
    height: 30px;
    overflow: hidden;
    padding-left: 30px;
    border: 1px solid black;
    color: #fff;
    background-color: #3b434b;
  }
  .anim{
    transition: all 0.5s;
    margin-top: -30px;
  }
  #con1 li{
    list-style: none;
    line-height: 30px;
    height: 30px;
  }
</style>

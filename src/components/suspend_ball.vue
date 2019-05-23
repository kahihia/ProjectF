<template>
    <div id="suspend"
       @mousedown.stop="down" @touchstart.stop="down"
       @mousemove.prevent="move" @touchmove.prevent="move"
       @mouseup.prevent="end" @touchend.prevent="end">
      <img src="../assets/images/icon/icon_suspend.png" class="mixin-img">
    </div>
</template>

<script>
    export default {
      name: "suspend_ball",
      props:['isShow'],
      data() {
        return {
          flags: false,
          position: {x: 0,y: 0},
          nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
        }
      },
      methods: {
        // 实现移动端拖拽
        down() {
          this.flags = true;
          let touch;
          let moveDiv = document.querySelector('#suspend');
          if (event.touches) {
            touch = event.touches[0];
          } else {
            touch = event;
          }
          this.position.x = touch.clientX;
          this.position.y = touch.clientY;
          this.dx = moveDiv.offsetLeft;
          this.dy = moveDiv.offsetTop;
        },
        move() {
          if (this.flags) {
            let moveDiv = document.querySelector('#suspend');
            let touch;
            let w = document.documentElement.clientWidth;
            event.touches?touch = event.touches[0]:touch = event;
            this.nx = touch.clientX - this.position.x;
            this.ny = touch.clientY - this.position.y;
            this.xPum = this.dx + this.nx;
            this.yPum = this.dy + this.ny;
            moveDiv.style.left = this.xPum + "px";
            moveDiv.style.top = this.yPum + "px";
          }
        },
//鼠标释放时候的函数
        end() {
          this.flags = false;
        },
      }
    }
</script>

<style lang="less" scoped>
  #suspend {
    z-index: 990;
    position: fixed;
    top: 80%;
    right: 0;
    width: 130px;
    height: 130px;
  }
</style>

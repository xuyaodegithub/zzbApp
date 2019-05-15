<template>
  <div>
    <div class="collect-box"
      v-if="isShowCollect"
      :style="{left: conleft , top: contop}"
      @click="showCollectVisi = true"
      ref="consultRef"
      @touchstart = "mouseDown"
      @touchmove = "mouseMove"
      @touchend = "mouseEnd"
    >
      放到桌面
    </div>
    <van-popup v-model="showCollectVisi" position="bottom" class="collect-wrapper-pop" >
      <div class="collect-box-pop">
        <div class="collect-title">
          <h1>创建桌面图标</h1>
          <p>添加到桌面将有助于提高您的借款效率!</p>
        </div>
        <div class="collect-content" v-if="model === 'ios'">
          点击页面下方的<i class="Icon-Loan iconupload colorblue aurora-upload"></i>按钮,在弹出的菜单中选择【添加至主屏幕】即可
          <p class="Icon-Loan iconfillarrow-down aurora-icon"></p>
        </div>
        <ul class="collect-content" v-else>
          <li class="content-li">
            请点击浏览器底部设置按钮-添加书签-手机桌面-确定
          </li>
          <li>
            (部分机型)请点击浏览器底部设置按钮-工具箱-添加快捷方式-手机桌面-确定
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup } from 'vant';
export default {
  name: 'Collect',
  components: {
    [Popup.name]: Popup
  },
  data () {
    return {
      whiteList: ['Home', 'ID'],
      flag: false,
      cur: {
        x: 0,
        y: 0
      },
      nx: 0,
      ny: 0,
      dx: 0,
      dy: 0,
      conleft: `${document.body.offsetWidth - 40}px`,
      contop: `${document.body.offsetHeight - 40}px`,
      showCollectVisi: false,
      routerName: this.$route.name
    };
  },
  computed: {
    isShowCollect () {
      return this.whiteList.includes(this.routerName);
    },
    model () {
      const UserAgent = navigator.userAgent;
      const isAndroid = UserAgent.indexOf('Android') > -1 || UserAgent.indexOf('Adr') > -1;
      return isAndroid ? 'android' : 'ios';
    }
  },
  methods: {
    // 按下
    mouseDown () {
      const consultRef = this.$refs.consultRef;
      this.flag = true;
      let touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.cur.x = touch.clientX;
      this.cur.y = touch.clientY;
      this.dx = consultRef.offsetLeft;
      this.dy = consultRef.offsetTop;
    },
    // 移动
    mouseMove () {
      const consultRef = this.$refs.consultRef;
      const maxWidth = document.body.offsetWidth;
      const maxHeight = document.body.offsetHeight;
      const cwidth = consultRef.offsetWidth;
      const cheight = consultRef.offsetHeight;
      if (this.flag) {
        let touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.cur.x;
        this.ny = touch.clientY - this.cur.y;
        let left = this.dx + touch.clientX - this.cur.x;
        let top = this.dy + touch.clientY - this.cur.y;
        left = left < 0 ? 0 : left > maxWidth - cwidth ? maxWidth - cwidth : left;
        top = top < 0 ? 0 : top > maxHeight - cheight ? maxHeight - cheight : top;
        this.conleft = left + 'px';
        this.contop = top + 'px';
        // 阻止页面的滑动默认事件
        document.addEventListener('touchmove', this.handler, { passive: false });
      }
    },
    // 释放
    mouseEnd () {
      this.flag = false;
      document.removeEventListener('touchmove', this.handler, { passive: false });
    },
    // 取消阻止默认事件
    handler () {
      event.preventDefault();
    }
  },
  mounted () {
  },
  watch: {
    '$route' (route) {
      this.routerName = route.name;
    }
  }
};
</script>

<style lang="stylus" scoped>
.collect-box
  display inline-block
  position fixed
  bottom 50px
  right 15px
  border 1px solid #f13c38
  background rgba(241, 60, 56, 0.7)
  padding 5px
  text-align center
  line-height 15px
  width 40px
  height 40px
  color #fff
  font-size 12px
  z-index 100

.collect-wrapper-pop
  border-radius 8px
  margin-bottom 20px
  width 90%
.collect-box-pop
  padding 12px 15px
  // margin-bottom 40px

  .collect-title
    margin-bottom 20px
    h1
      font-size 22px
      font-weight bolder
      line-height 2
    p
      color #666

.collect-content
  line-height 2
  font-size 16px

.aurora-upload
  font-size 18px
.aurora-icon
  // position absolute
  bottom 10px
  text-align center
  font-size 50px
  line-height 1

</style>

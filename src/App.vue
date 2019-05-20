<template>
  <div id="app">
    <transition name="bounce">
      <router-view  class="child-view"/>
    </transition>
    <Collect/>
    <!--    底部导航-->
<!--    <van-tabbar v-model="active" v-show="$route.path!=='/login'">-->
<!--      <van-tabbar-item info="3">-->
<!--        <span>自定义</span>-->
<!--        <img-->
<!--          slot="icon"-->
<!--          slot-scope="props"-->
<!--          :src="active===0 ? icon.active : icon.normal"-->
<!--        >-->
<!--      </van-tabbar-item>-->
<!--      &lt;!&ndash;      <van-tabbar-item icon="search">标签</van-tabbar-item>&ndash;&gt;-->
<!--      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>-->
<!--    </van-tabbar>-->
  </div>
</template>
<script>
import {Collect} from '@/components';
// import { Tabbar, TabbarItem } from 'vant';
export default {
  name: 'App',
  data () {
    return {
      // active: 0,
      // icon: {
      //   normal: '//img.yzcdn.cn/icon-normal.png',
      //   active: '//img.yzcdn.cn/icon-active.png'
      // }
    };
  },
  components: {
    Collect
    // [Tabbar.name]: Tabbar,
    // [TabbarItem.name]: TabbarItem
  },
  mounted () {

  }
};
</script>
<style>
  #app{
    height: 100%;
  }
  .bounce-enter-active {
    transform: translateX(100%);
  }
  .bounce-leave-active {
    transform: translateX(-100%);
  }
  .child-view {
    transition: all .15s linear;
  }
</style>

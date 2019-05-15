<template>
  <div>
    <header class="header-flex">
      <van-icon
        v-if="hasBack"
        name="arrow-left" class="header-left"
        @click="$router.go(-1)"/>
      <span class="header-title ellipsis" v-if="title" :style="titleStyle">{{title}}</span>
      <div class="header-right">
        <slot name="textright"></slot>
      </div>
    </header>
    <div class="relave">&nbsp&nbsp&nbsp</div>
  </div>
</template>

<script>
import { Icon } from 'vant';
export default {
  name: 'myHeader',
  components: {
    [Icon.name]: Icon
  },
  props: {
    hasBack: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    titleStyle: {
      type: Object
    }
  }
};
</script>
<style lang="stylus" scoped>
  .relave
    height 50px
    width 100%
  .header-flex
    position fixed
    height 50px
    width 100%
    top 0
    left 0
    right 0
    z-index 999
    display flex
    justify-content space-between
    background #f13c38
    color #FFF
    align-items center
    box-sizing: border-box;
    &:after
      position absolute
      bottom 0
      border-bottom 1px solid #f0f0f0
      content ''
      height 0.5px
      width 100%

  .header-left
    position absolute
    top 50%
    transform translateY(-50%)
    width 96px
    padding-left 10px
    font-size: 18px;

  .header-title
    margin 0 70px
    height 50px
    line-height 50px
    color #FFF
    width 100%
    text-align center
    font-size 18px

  .header-right
    position absolute
    top 50%
    transform translateY(-50%)
    right 10px
    width 96px
    text-align right
    padding-right 10px
    color #FFF
    font-size 16px
    a
      color #FFF
</style>

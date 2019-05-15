<template>
  <section>
    <myHeader title="联系客服"/>
    <div class="aurora-box-top">
      <div class="conact-box">
        <h1 class="title">在线客服</h1>
        <!-- <p class="tel">
          <span class="fs16">微信号：</span>
          zhouzhuanbao123
        </p> -->
        <p class="tel">
          <span class="fs16">QQ：</span>
          3358448285
        </p>
        <p class="text">如果您在使用周转宝的过程中有任何疑问，请您与周转宝客服人员联系。</p>
      </div>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { RESULTSUCCESS } from 'utils/match';
export default {
  components: {
    myHeader
  },
  data () {
    return {
      RESULTSUCCESS
    };
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
  .conact-box
    padding 30px
    .title
      font-size 14px
      line-height 2

    .tel
      font-size 20px
      line-height 1.5
    .text
      line-height 1.5
      color #979797
      font-size 14px
      margin-top 10px

  .tel-link
    display inline-block
    line-height 50px
</style>

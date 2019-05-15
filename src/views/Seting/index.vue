<template>
  <section>
    <myHeader title="设置"/>
    <div class="aurora-box-top">
      <button class="aurora-btn-box aurora-btn-box">删除</button>
    </div>
  </section>
</template>
<script>
import { myHeader } from 'components/index';
export default {
  components: {
    myHeader
  }
};
</script>
<style lang="stylus" scoped>
  section
    min-height 100%
.btn
  height 30px
  line-height 30px
  padding 0 10px
  background-color #e4393c
  border-radius 15px
  color #fff
  text-align center

</style>
